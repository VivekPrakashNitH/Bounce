package com.pingboard.service;

import com.pingboard.entity.HealthCheck;
import com.pingboard.entity.Incident;
import com.pingboard.entity.Monitor;
import com.pingboard.repository.HealthCheckRepository;
import com.pingboard.repository.IncidentRepository;
import com.pingboard.repository.MonitorRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
public class HealthCheckScheduler {

    private static final Logger log = LoggerFactory.getLogger(HealthCheckScheduler.class);

    private final MonitorRepository monitorRepository;
    private final HealthCheckRepository healthCheckRepository;
    private final IncidentRepository incidentRepository;
    private final AlertService alertService;

    private final HttpClient httpClient;
    private final ExecutorService executor;

    public HealthCheckScheduler(MonitorRepository monitorRepository,
            HealthCheckRepository healthCheckRepository,
            IncidentRepository incidentRepository,
            AlertService alertService) {
        this.monitorRepository = monitorRepository;
        this.healthCheckRepository = healthCheckRepository;
        this.incidentRepository = incidentRepository;
        this.alertService = alertService;

        this.executor = Executors.newFixedThreadPool(20);
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .executor(executor)
                .followRedirects(HttpClient.Redirect.NORMAL)
                .build();
    }

    /**
     * Runs every 30 seconds. Fetches all active monitors and checks
     * those that are due (based on their individual interval).
     */
    @Scheduled(fixedRate = 30000)
    public void runHealthChecks() {
        List<Monitor> activeMonitors = monitorRepository.findByIsActiveTrue();

        if (activeMonitors.isEmpty()) {
            return;
        }

        log.debug("Running health checks for {} active monitors", activeMonitors.size());

        List<CompletableFuture<Void>> futures = activeMonitors.stream()
                .filter(this::isDueForCheck)
                .map(monitor -> CompletableFuture.runAsync(
                        () -> checkMonitor(monitor), executor))
                .toList();

        // Wait for all checks to complete (non-blocking at scheduler level)
        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]))
                .exceptionally(ex -> {
                    log.error("Error in health check batch: {}", ex.getMessage());
                    return null;
                });
    }

    private boolean isDueForCheck(Monitor monitor) {
        var lastCheck = healthCheckRepository
                .findFirstByMonitorIdOrderByCheckedAtDesc(monitor.getId());

        if (lastCheck.isEmpty()) {
            return true; // Never checked before
        }

        long secondsSinceLastCheck = Duration.between(
                lastCheck.get().getCheckedAt(), OffsetDateTime.now()).getSeconds();

        return secondsSinceLastCheck >= monitor.getIntervalSeconds();
    }

    private void checkMonitor(Monitor monitor) {
        long startTime = System.currentTimeMillis();
        boolean isUp = false;
        Integer statusCode = null;
        String errorMessage = null;

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(monitor.getUrl()))
                    .method(monitor.getMethod(),
                            "GET".equals(monitor.getMethod()) || "HEAD".equals(monitor.getMethod())
                                    ? HttpRequest.BodyPublishers.noBody()
                                    : HttpRequest.BodyPublishers.noBody())
                    .timeout(Duration.ofMillis(monitor.getTimeoutMs()))
                    .header("User-Agent", "PingBoard/1.0 Health Check")
                    .build();

            HttpResponse<Void> response = httpClient.send(request,
                    HttpResponse.BodyHandlers.discarding());

            statusCode = response.statusCode();
            isUp = statusCode == monitor.getExpectedStatus();

            if (!isUp) {
                errorMessage = "Expected status " + monitor.getExpectedStatus()
                        + " but got " + statusCode;
            }

        } catch (Exception e) {
            errorMessage = e.getClass().getSimpleName() + ": " + e.getMessage();
            log.debug("Monitor {} check failed: {}", monitor.getId(), errorMessage);
        }

        long responseTimeMs = System.currentTimeMillis() - startTime;

        // Persist health check result
        HealthCheck healthCheck = HealthCheck.builder()
                .monitorId(monitor.getId())
                .statusCode(statusCode)
                .responseTimeMs((int) responseTimeMs)
                .isUp(isUp)
                .errorMessage(errorMessage)
                .build();

        healthCheckRepository.save(healthCheck);

        // Handle incident detection
        handleIncidentDetection(monitor, isUp, errorMessage);
    }

    private void handleIncidentDetection(Monitor monitor, boolean isUp, String errorMessage) {
        var openIncident = incidentRepository
                .findByMonitorIdAndResolvedAtIsNull(monitor.getId());

        if (!isUp && openIncident.isEmpty()) {
            // New incident — monitor just went down
            Incident incident = Incident.builder()
                    .monitorId(monitor.getId())
                    .cause(errorMessage)
                    .build();
            incidentRepository.save(incident);
            log.warn("INCIDENT OPENED: Monitor {} ({}) is DOWN", monitor.getName(), monitor.getUrl());

            // Trigger alert
            alertService.sendDownAlert(monitor, errorMessage);

        } else if (isUp && openIncident.isPresent()) {
            // Incident resolved — monitor is back up
            Incident incident = openIncident.get();
            incident.setResolvedAt(OffsetDateTime.now());
            incidentRepository.save(incident);

            long downtimeSeconds = Duration.between(incident.getStartedAt(), incident.getResolvedAt()).getSeconds();
            log.info("INCIDENT RESOLVED: Monitor {} ({}) is UP (downtime: {}s)",
                    monitor.getName(), monitor.getUrl(), downtimeSeconds);

            // Trigger recovery alert
            alertService.sendRecoveryAlert(monitor, downtimeSeconds);
        }
    }
}
