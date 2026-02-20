package com.pingboard.controller;

import com.pingboard.dto.HealthCheckResponse;
import com.pingboard.entity.HealthCheck;
import com.pingboard.entity.Monitor;
import com.pingboard.repository.HealthCheckRepository;
import com.pingboard.repository.MonitorRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/monitors/{monitorId}/checks")
public class HealthCheckController {

    private final HealthCheckRepository healthCheckRepository;
    private final MonitorRepository monitorRepository;

    public HealthCheckController(HealthCheckRepository healthCheckRepository,
            MonitorRepository monitorRepository) {
        this.healthCheckRepository = healthCheckRepository;
        this.monitorRepository = monitorRepository;
    }

    @GetMapping
    public ResponseEntity<List<HealthCheckResponse>> getChecks(
            @PathVariable Long monitorId,
            @RequestParam(defaultValue = "24") int hours,
            Authentication auth) {

        Long userId = (Long) auth.getPrincipal();
        verifyOwnership(monitorId, userId);

        OffsetDateTime since = OffsetDateTime.now().minusHours(hours);
        List<HealthCheckResponse> checks = healthCheckRepository
                .findByMonitorIdAndCheckedAtAfterOrderByCheckedAtDesc(monitorId, since)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(checks);
    }

    @GetMapping("/uptime")
    public ResponseEntity<Map<String, Object>> getUptime(
            @PathVariable Long monitorId,
            @RequestParam(defaultValue = "30") int days,
            Authentication auth) {

        Long userId = (Long) auth.getPrincipal();
        verifyOwnership(monitorId, userId);

        OffsetDateTime since = OffsetDateTime.now().minusDays(days);
        long total = healthCheckRepository.countTotalChecks(monitorId, since);
        long up = healthCheckRepository.countUpChecks(monitorId, since);
        double avg = healthCheckRepository.averageResponseTime(monitorId, since);

        double uptimePercent = total > 0 ? (up * 100.0 / total) : 100.0;

        return ResponseEntity.ok(Map.of(
                "uptimePercent", Math.round(uptimePercent * 100.0) / 100.0,
                "avgResponseMs", Math.round(avg * 100.0) / 100.0,
                "totalChecks", total,
                "periodDays", days));
    }

    private void verifyOwnership(Long monitorId, Long userId) {
        monitorRepository.findByIdAndUserId(monitorId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Monitor not found"));
    }

    private HealthCheckResponse toResponse(HealthCheck hc) {
        return HealthCheckResponse.builder()
                .id(hc.getId())
                .statusCode(hc.getStatusCode())
                .responseTimeMs(hc.getResponseTimeMs())
                .isUp(hc.getIsUp())
                .errorMessage(hc.getErrorMessage())
                .checkedAt(hc.getCheckedAt())
                .build();
    }
}
