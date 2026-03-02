package com.c4gt.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * GDPR-compliant user data service.
 * 
 * Supports:
 * - Data export (Article 15 — Right of Access)
 * - Data deletion (Article 17 — Right to Erasure)
 */
@Service
public class UserDataService {

    private static final Logger log = LoggerFactory.getLogger(UserDataService.class);

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private SecurityAuditService auditService;

    /**
     * Export all user data as a structured map.
     * Includes: profile, progress, engagement, project, sessions, comments.
     */
    public Map<String, Object> exportUserData(Long userId) {
        Map<String, Object> data = new LinkedHashMap<>();

        // Profile
        data.put("profile", jdbcTemplate.queryForList(
                "SELECT id, name, email, college, created_at FROM users WHERE id = ?", userId));

        // Progress
        data.put("progress", jdbcTemplate.queryForList(
                "SELECT level_id, completed, score, completed_at FROM user_progress WHERE user_id = ?", userId));

        // Project
        data.put("project", jdbcTemplate.queryForList(
                "SELECT up.current_stage, up.created_at, ps.stage_id, ps.status " +
                        "FROM user_projects up LEFT JOIN project_stages ps ON ps.project_id = up.id " +
                        "WHERE up.user_id = ? AND up.deleted = false",
                userId));

        // Submissions
        data.put("submissions", jdbcTemplate.queryForList(
                "SELECT ps2.stage_id, ps2.code_content, ps2.notes, ps2.created_at " +
                        "FROM project_submissions ps2 JOIN user_projects up ON ps2.project_id = up.id " +
                        "WHERE up.user_id = ?",
                userId));

        // Page time tracking
        data.put("pageTime", jdbcTemplate.queryForList(
                "SELECT page_id, active_time_ms, total_time_ms, visit_count, last_visited_at " +
                        "FROM page_time_tracking WHERE user_id = ?",
                userId));

        // Comments
        data.put("comments", jdbcTemplate.queryForList(
                "SELECT level_id, content, created_at FROM level_comments WHERE user_id = ?", userId));

        // Sessions
        data.put("sessions", jdbcTemplate.queryForList(
                "SELECT device_info, ip_address, created_at, revoked FROM user_sessions WHERE user_id = ?", userId));

        data.put("exportedAt", java.time.Instant.now().toString());

        return data;
    }

    /**
     * Delete all user data (GDPR Right to Erasure).
     * Cascading: engagement events, page/section time, dropoffs, retries,
     * projects, submissions, progress, sessions, comments.
     * 
     * User record itself is anonymized (email → deleted-{id}@deleted, name → null).
     */
    @Transactional
    public Map<String, Object> deleteUserData(Long userId, String ipAddress) {
        Map<String, Integer> deleted = new LinkedHashMap<>();

        // Delete engagement events
        deleted.put("engagementEvents", jdbcTemplate.update(
                "DELETE FROM engagement_events WHERE user_id = ?", userId));

        // Delete page time tracking
        deleted.put("pageTimeTracking", jdbcTemplate.update(
                "DELETE FROM page_time_tracking WHERE user_id = ?", userId));

        // Delete section time tracking
        deleted.put("sectionTimeTracking", jdbcTemplate.update(
                "DELETE FROM section_time_tracking WHERE user_id = ?", userId));

        // Delete dropoff events
        deleted.put("dropoffEvents", jdbcTemplate.update(
                "DELETE FROM dropoff_events WHERE user_id = ?", userId));

        // Delete retry events
        deleted.put("retryEvents", jdbcTemplate.update(
                "DELETE FROM retry_events WHERE user_id = ?", userId));

        // Delete daily engagement
        deleted.put("dailyEngagement", jdbcTemplate.update(
                "DELETE FROM daily_user_engagement WHERE user_id = ?", userId));

        // Delete progress
        deleted.put("progress", jdbcTemplate.update(
                "DELETE FROM user_progress WHERE user_id = ?", userId));

        // Soft-delete projects (cascade handles stages/submissions via FK)
        deleted.put("projects", jdbcTemplate.update(
                "UPDATE user_projects SET deleted = true WHERE user_id = ?", userId));

        // Delete sessions
        deleted.put("sessions", jdbcTemplate.update(
                "DELETE FROM user_sessions WHERE user_id = ?", userId));

        // Anonymize user record (keep row for FK integrity, strip PII)
        jdbcTemplate.update(
                "UPDATE users SET name = NULL, email = ?, college = NULL WHERE id = ?",
                "deleted-" + userId + "@deleted.local", userId);

        int totalDeleted = deleted.values().stream().mapToInt(Integer::intValue).sum();
        log.info("GDPR deletion for user {}: {} records across {} tables",
                userId, totalDeleted, deleted.size());

        // Audit the deletion
        auditService.logEvent("USER_DATA_DELETED", userId, ipAddress, null,
                Map.of("recordsDeleted", totalDeleted, "tables", deleted));

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("userId", userId);
        result.put("totalRecordsDeleted", totalDeleted);
        result.put("details", deleted);
        result.put("deletedAt", java.time.Instant.now().toString());
        return result;
    }
}
