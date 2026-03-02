package com.c4gt.controller;

import com.c4gt.dto.*;
import com.c4gt.service.EngagementService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/engagement")
public class EngagementController {

    @Autowired
    private EngagementService engagementService;

    /**
     * Batch event ingestion — accepts up to 50 events.
     * Events are validated synchronously, persisted asynchronously.
     */
    @PostMapping("/batch")
    public ResponseEntity<Void> submitBatch(
            Authentication auth,
            @Valid @RequestBody EngagementBatchRequest request) {
        Long userId = (Long) auth.getPrincipal();
        engagementService.processBatch(userId, request);
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }

    /**
     * Page time upsert.
     */
    @PostMapping("/page-time")
    public ResponseEntity<Void> submitPageTime(
            Authentication auth,
            @Valid @RequestBody PageTimeRequest request) {
        Long userId = (Long) auth.getPrincipal();
        engagementService.upsertPageTime(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    /**
     * Section time tracking.
     */
    @PostMapping("/section-time")
    public ResponseEntity<Void> submitSectionTime(
            Authentication auth,
            @Valid @RequestBody SectionTimeRequest request) {
        Long userId = (Long) auth.getPrincipal();
        engagementService.recordSectionTime(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    /**
     * Drop-off event recording.
     */
    @PostMapping("/dropoff")
    public ResponseEntity<Void> submitDropoff(
            Authentication auth,
            @Valid @RequestBody DropoffRequest request) {
        Long userId = (Long) auth.getPrincipal();
        engagementService.recordDropoff(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    /**
     * Retry event recording.
     */
    @PostMapping("/retry")
    public ResponseEntity<Void> submitRetry(
            Authentication auth,
            @Valid @RequestBody RetryRequest request) {
        Long userId = (Long) auth.getPrincipal();
        engagementService.recordRetry(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    /**
     * Get engagement summary for the authenticated user.
     */
    @GetMapping("/summary")
    public ResponseEntity<EngagementSummaryDTO> getSummary(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        EngagementSummaryDTO summary = engagementService.getSummary(userId);
        return ResponseEntity.ok(summary);
    }
}
