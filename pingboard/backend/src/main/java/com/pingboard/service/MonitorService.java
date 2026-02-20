package com.pingboard.service;

import com.pingboard.dto.CreateMonitorRequest;
import com.pingboard.dto.MonitorResponse;
import com.pingboard.entity.HealthCheck;
import com.pingboard.entity.Monitor;
import com.pingboard.repository.HealthCheckRepository;
import com.pingboard.repository.MonitorRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MonitorService {

    private static final Logger log = LoggerFactory.getLogger(MonitorService.class);
    private static final int MAX_MONITORS_PER_USER = 50;

    private final MonitorRepository monitorRepository;
    private final HealthCheckRepository healthCheckRepository;

    public MonitorService(MonitorRepository monitorRepository,
            HealthCheckRepository healthCheckRepository) {
        this.monitorRepository = monitorRepository;
        this.healthCheckRepository = healthCheckRepository;
    }

    public List<MonitorResponse> getMonitorsByUser(Long userId) {
        return monitorRepository.findByUserId(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public MonitorResponse getMonitorById(Long id, Long userId) {
        Monitor monitor = monitorRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Monitor not found"));
        return toResponse(monitor);
    }

    @Transactional
    public MonitorResponse createMonitor(CreateMonitorRequest request, Long userId) {
        long count = monitorRepository.countByUserId(userId);
        if (count >= MAX_MONITORS_PER_USER) {
            throw new IllegalArgumentException("Maximum " + MAX_MONITORS_PER_USER + " monitors per user");
        }

        Monitor monitor = Monitor.builder()
                .userId(userId)
                .name(request.getName().trim())
                .url(request.getUrl().trim())
                .method(request.getMethod())
                .intervalSeconds(request.getIntervalSeconds())
                .timeoutMs(request.getTimeoutMs())
                .expectedStatus(request.getExpectedStatus())
                .build();

        monitor = monitorRepository.save(monitor);
        log.info("Monitor created: id={}, url={}, userId={}", monitor.getId(), monitor.getUrl(), userId);

        return toResponse(monitor);
    }

    @Transactional
    public MonitorResponse updateMonitor(Long id, CreateMonitorRequest request, Long userId) {
        Monitor monitor = monitorRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Monitor not found"));

        monitor.setName(request.getName().trim());
        monitor.setUrl(request.getUrl().trim());
        monitor.setMethod(request.getMethod());
        monitor.setIntervalSeconds(request.getIntervalSeconds());
        monitor.setTimeoutMs(request.getTimeoutMs());
        monitor.setExpectedStatus(request.getExpectedStatus());

        monitor = monitorRepository.save(monitor);
        log.info("Monitor updated: id={}", monitor.getId());

        return toResponse(monitor);
    }

    @Transactional
    public void deleteMonitor(Long id, Long userId) {
        Monitor monitor = monitorRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Monitor not found"));
        monitorRepository.delete(monitor);
        log.info("Monitor deleted: id={}", id);
    }

    @Transactional
    public MonitorResponse toggleMonitor(Long id, Long userId) {
        Monitor monitor = monitorRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Monitor not found"));
        monitor.setIsActive(!monitor.getIsActive());
        monitor = monitorRepository.save(monitor);
        log.info("Monitor toggled: id={}, active={}", id, monitor.getIsActive());
        return toResponse(monitor);
    }

    private MonitorResponse toResponse(Monitor monitor) {
        OffsetDateTime since30d = OffsetDateTime.now().minusDays(30);

        // Get latest check
        var latestCheck = healthCheckRepository.findFirstByMonitorIdOrderByCheckedAtDesc(monitor.getId());

        // Calculate uptime
        long totalChecks = healthCheckRepository.countTotalChecks(monitor.getId(), since30d);
        long upChecks = healthCheckRepository.countUpChecks(monitor.getId(), since30d);
        double uptimePercent = totalChecks > 0 ? (upChecks * 100.0 / totalChecks) : 100.0;

        // Calculate avg response time
        double avgResponseMs = healthCheckRepository.averageResponseTime(monitor.getId(), since30d);

        return MonitorResponse.builder()
                .id(monitor.getId())
                .name(monitor.getName())
                .url(monitor.getUrl())
                .method(monitor.getMethod())
                .intervalSeconds(monitor.getIntervalSeconds())
                .timeoutMs(monitor.getTimeoutMs())
                .expectedStatus(monitor.getExpectedStatus())
                .isActive(monitor.getIsActive())
                .currentlyUp(latestCheck.map(HealthCheck::getIsUp).orElse(null))
                .uptimePercent(Math.round(uptimePercent * 100.0) / 100.0)
                .avgResponseMs(Math.round(avgResponseMs * 100.0) / 100.0)
                .lastCheckedAt(latestCheck.map(HealthCheck::getCheckedAt).orElse(null))
                .createdAt(monitor.getCreatedAt())
                .build();
    }
}
