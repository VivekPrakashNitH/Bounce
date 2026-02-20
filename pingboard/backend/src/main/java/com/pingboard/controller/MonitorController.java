package com.pingboard.controller;

import com.pingboard.dto.CreateMonitorRequest;
import com.pingboard.dto.MonitorResponse;
import com.pingboard.service.MonitorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/monitors")
public class MonitorController {

    private final MonitorService monitorService;

    public MonitorController(MonitorService monitorService) {
        this.monitorService = monitorService;
    }

    @GetMapping
    public ResponseEntity<List<MonitorResponse>> getMonitors(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(monitorService.getMonitorsByUser(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MonitorResponse> getMonitor(@PathVariable Long id, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(monitorService.getMonitorById(id, userId));
    }

    @PostMapping
    public ResponseEntity<MonitorResponse> createMonitor(
            @Valid @RequestBody CreateMonitorRequest request, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        MonitorResponse response = monitorService.createMonitor(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MonitorResponse> updateMonitor(
            @PathVariable Long id,
            @Valid @RequestBody CreateMonitorRequest request,
            Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(monitorService.updateMonitor(id, request, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMonitor(@PathVariable Long id, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        monitorService.deleteMonitor(id, userId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<MonitorResponse> toggleMonitor(@PathVariable Long id, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(monitorService.toggleMonitor(id, userId));
    }
}
