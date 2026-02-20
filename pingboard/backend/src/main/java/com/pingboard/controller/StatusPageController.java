package com.pingboard.controller;

import com.pingboard.dto.MonitorResponse;
import com.pingboard.entity.Monitor;
import com.pingboard.entity.User;
import com.pingboard.repository.HealthCheckRepository;
import com.pingboard.repository.MonitorRepository;
import com.pingboard.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Public status page endpoint — NO authentication required.
 * Shows monitor names and uptime (not URLs, for security).
 */
@RestController
@RequestMapping("/api/status")
public class StatusPageController {

    private final UserRepository userRepository;
    private final MonitorRepository monitorRepository;
    private final HealthCheckRepository healthCheckRepository;

    public StatusPageController(UserRepository userRepository,
            MonitorRepository monitorRepository,
            HealthCheckRepository healthCheckRepository) {
        this.userRepository = userRepository;
        this.monitorRepository = monitorRepository;
        this.healthCheckRepository = healthCheckRepository;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<Map<String, Object>> getStatusPage(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Status page not found"));

        List<Monitor> monitors = monitorRepository.findByUserId(userId).stream()
                .filter(Monitor::getIsActive)
                .collect(Collectors.toList());

        OffsetDateTime since30d = OffsetDateTime.now().minusDays(30);

        List<Map<String, Object>> monitorStatuses = monitors.stream().map(monitor -> {
            var latestCheck = healthCheckRepository
                    .findFirstByMonitorIdOrderByCheckedAtDesc(monitor.getId());

            long total = healthCheckRepository.countTotalChecks(monitor.getId(), since30d);
            long up = healthCheckRepository.countUpChecks(monitor.getId(), since30d);
            double uptime = total > 0 ? (up * 100.0 / total) : 100.0;

            return Map.<String, Object>of(
                    "name", monitor.getName(),
                    "isUp", latestCheck.map(hc -> hc.getIsUp()).orElse(true),
                    "uptimePercent", Math.round(uptime * 100.0) / 100.0);
        }).collect(Collectors.toList());

        return ResponseEntity.ok(Map.of(
                "owner", user.getName(),
                "monitors", monitorStatuses));
    }
}
