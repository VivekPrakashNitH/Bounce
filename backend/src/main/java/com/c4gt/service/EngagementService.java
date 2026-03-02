package com.c4gt.service;

import com.c4gt.dto.*;
import com.c4gt.entity.EngagementEvent;
import com.c4gt.repository.EngagementEventRepository;
import com.c4gt.repository.PageTimeTrackingRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;

/**
 * Engagement tracking service.
 * Event writes are async to avoid adding latency to user-facing requests.
 */
@Service
public class EngagementService {

    private static final Logger log = LoggerFactory.getLogger(EngagementService.class);
    private static final long MAX_EVENT_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

    @Autowired
    private EngagementEventRepository eventRepository;
    @Autowired
    private PageTimeTrackingRepository pageTimeRepository;
    @Autowired
    private JdbcTemplate jdbcTemplate;
    @Autowired
    private ObjectMapper objectMapper;

    /**
     * Process a batch of engagement events. Validates and persists asynchronously.
     */
    @Async
    @Transactional
    public void processBatch(Long userId, EngagementBatchRequest request) {
        int accepted = 0;
        int rejected = 0;

        for (EngagementEventDTO dto : request.getEvents()) {
            if (!isValidEvent(dto)) {
                rejected++;
                continue;
            }

            try {
                EngagementEvent event = new EngagementEvent();
                event.setUserId(userId);
                event.setSessionId(request.getSessionId() != null ? request.getSessionId() : "unknown");
                event.setEventType(dto.getEventType());
                event.setPageId(dto.getPageId());
                event.setSectionId(dto.getSectionId());
                event.setDurationMs(dto.getDuration());
                event.setScrollDepth(dto.getScrollDepth() != null ? dto.getScrollDepth().shortValue() : null);
                event.setClientVersion(request.getClientVersion());
                event.setClientTs(LocalDateTime.ofInstant(
                        Instant.ofEpochMilli(dto.getTimestamp()), ZoneOffset.UTC));

                if (dto.getMetadata() != null) {
                    event.setMetadata(objectMapper.writeValueAsString(dto.getMetadata()));
                }

                eventRepository.save(event);
                accepted++;
            } catch (Exception e) {
                log.warn("Failed to process event: {}", e.getMessage());
                rejected++;
            }
        }

        log.info("Batch processed for user {}: accepted={}, rejected={}", userId, accepted, rejected);
    }

    /**
     * Upsert page time tracking.
     */
    @Transactional
    public void upsertPageTime(Long userId, PageTimeRequest request) {
        if (request.getActiveTimeMs() > request.getTotalTimeMs()) {
            throw new IllegalArgumentException("activeTimeMs cannot exceed totalTimeMs");
        }
        if (request.getTotalTimeMs() > 86_400_000) { // 24h
            throw new IllegalArgumentException("totalTimeMs exceeds 24-hour maximum");
        }

        pageTimeRepository.upsertPageTime(
                userId,
                request.getPageId(),
                request.getActiveTimeMs(),
                request.getTotalTimeMs(),
                request.getTabSwitches());
    }

    /**
     * Record section time.
     */
    @Transactional
    public void recordSectionTime(Long userId, SectionTimeRequest request) {
        jdbcTemplate.update(
                """
                        INSERT INTO section_time_tracking (user_id, page_id, section_id, active_time_ms, visibility_percent, visit_count, created_at, updated_at)
                        VALUES (?, ?, ?, ?, ?, 1, NOW(), NOW())
                        ON CONFLICT (user_id, page_id, section_id) DO UPDATE SET
                            active_time_ms = GREATEST(section_time_tracking.active_time_ms, ?),
                            visibility_percent = ?,
                            visit_count = section_time_tracking.visit_count + 1,
                            updated_at = NOW()
                        """,
                userId, request.getPageId(), request.getSectionId(),
                request.getActiveTimeMs(), request.getVisibilityPercent(),
                request.getActiveTimeMs(), request.getVisibilityPercent());
    }

    /**
     * Record a drop-off event.
     */
    @Transactional
    public void recordDropoff(Long userId, DropoffRequest request) {
        jdbcTemplate.update(
                """
                        INSERT INTO dropoff_events (user_id, page_id, last_section_seen, scroll_depth_pct, time_spent_ms, referrer, created_at)
                        VALUES (?, ?, ?, ?, ?, ?, NOW())
                        """,
                userId, request.getPageId(), request.getLastSectionSeen(),
                request.getScrollDepthPercent(), request.getTimeSpentMs(), request.getReferrer());
    }

    /**
     * Record a retry event.
     */
    @Transactional
    public void recordRetry(Long userId, RetryRequest request) {
        jdbcTemplate.update(
                """
                        INSERT INTO retry_events (user_id, page_id, section_id, quiz_id, attempt_number, previous_result, created_at)
                        VALUES (?, ?, ?, ?, ?, ?, NOW())
                        """,
                userId, request.getPageId(), request.getSectionId(),
                request.getQuizId(), request.getAttemptNumber(), request.getPreviousResult());
    }

    /**
     * Get engagement summary for a user.
     */
    @Transactional(readOnly = true)
    public EngagementSummaryDTO getSummary(Long userId) {
        EngagementSummaryDTO summary = new EngagementSummaryDTO();

        // Total pages visited
        Integer pages = jdbcTemplate.queryForObject(
                "SELECT COUNT(DISTINCT page_id) FROM page_time_tracking WHERE user_id = ?",
                Integer.class, userId);
        summary.setTotalPagesVisited(pages != null ? pages : 0);

        // Total active time
        Long activeMs = jdbcTemplate.queryForObject(
                "SELECT COALESCE(SUM(active_time_ms), 0) FROM page_time_tracking WHERE user_id = ?",
                Long.class, userId);
        summary.setTotalActiveTimeMs(activeMs != null ? activeMs : 0L);

        // Average scroll depth (from recent events)
        Integer avgScroll = jdbcTemplate.queryForObject(
                "SELECT COALESCE(AVG(scroll_depth), 0) FROM engagement_events WHERE user_id = ? AND scroll_depth IS NOT NULL",
                Integer.class, userId);
        summary.setAverageScrollDepth(avgScroll != null ? avgScroll : 0);

        // Drop-off count
        Integer dropoffs = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM dropoff_events WHERE user_id = ?",
                Integer.class, userId);
        summary.setDropoffCount(dropoffs != null ? dropoffs : 0);

        // Retry count
        Integer retries = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM retry_events WHERE user_id = ?",
                Integer.class, userId);
        summary.setRetryCount(retries != null ? retries : 0);

        return summary;
    }

    // --- Validation ---

    private boolean isValidEvent(EngagementEventDTO dto) {
        if (dto.getTimestamp() == null)
            return false;

        long now = System.currentTimeMillis();
        // Reject events from the future
        if (dto.getTimestamp() > now + 60_000)
            return false;
        // Reject events older than 24h
        if (dto.getTimestamp() < now - MAX_EVENT_AGE_MS)
            return false;
        // Reject impossible scroll depth
        if (dto.getScrollDepth() != null && (dto.getScrollDepth() < 0 || dto.getScrollDepth() > 100))
            return false;
        // Reject negative duration
        if (dto.getDuration() != null && dto.getDuration() < 0)
            return false;

        return true;
    }
}
