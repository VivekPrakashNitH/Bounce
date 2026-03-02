package com.c4gt.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Server-side progress tracking.
 * Replaces localStorage-only progress with server-backed persistence.
 * localStorage kept as offline fallback — syncs on reconnect.
 */
@RestController
@RequestMapping("/api/v1/progress")
public class ProgressController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Get user's progress.
     */
    @GetMapping("/me")
    public ResponseEntity<?> getProgress(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();

        var rows = jdbcTemplate.queryForList("""
                    SELECT level_id, completed, score, completed_at, metadata
                    FROM user_progress
                    WHERE user_id = ?
                    ORDER BY completed_at DESC
                """, userId);

        return ResponseEntity.ok(Map.of("levels", rows));
    }

    /**
     * Update progress for a level — upsert.
     */
    @PostMapping("/update")
    public ResponseEntity<Void> updateProgress(
            Authentication auth,
            @RequestBody Map<String, Object> body) {
        Long userId = (Long) auth.getPrincipal();
        String levelId = (String) body.get("levelId");
        Boolean completed = (Boolean) body.getOrDefault("completed", false);
        Integer score = (Integer) body.getOrDefault("score", 0);
        String metadata = body.containsKey("metadata")
                ? new com.fasterxml.jackson.databind.ObjectMapper().valueToTree(body.get("metadata")).toString()
                : "{}";

        if (levelId == null || levelId.isBlank()) {
            throw new IllegalArgumentException("levelId is required");
        }

        jdbcTemplate.update("""
                    INSERT INTO user_progress (user_id, level_id, completed, score, metadata, completed_at, updated_at)
                    VALUES (?, ?, ?, ?, ?::JSONB, NOW(), NOW())
                    ON CONFLICT (user_id, level_id) DO UPDATE SET
                        completed = EXCLUDED.completed,
                        score = GREATEST(user_progress.score, EXCLUDED.score),
                        metadata = EXCLUDED.metadata,
                        completed_at = CASE WHEN EXCLUDED.completed THEN NOW() ELSE user_progress.completed_at END,
                        updated_at = NOW()
                """, userId, levelId, completed, score, metadata);

        return ResponseEntity.ok().build();
    }

    /**
     * Bulk sync — client sends all local progress, server merges with
     * last-write-wins.
     */
    @PostMapping("/sync")
    public ResponseEntity<?> syncProgress(
            Authentication auth,
            @RequestBody Map<String, Object> body) {
        Long userId = (Long) auth.getPrincipal();

        @SuppressWarnings("unchecked")
        var levels = (java.util.List<Map<String, Object>>) body.get("levels");
        if (levels == null || levels.isEmpty()) {
            return ResponseEntity.ok(Map.of("synced", 0));
        }

        int synced = 0;
        for (var level : levels) {
            try {
                String levelId = (String) level.get("levelId");
                Boolean completed = (Boolean) level.getOrDefault("completed", false);
                Integer score = level.get("score") != null ? ((Number) level.get("score")).intValue() : 0;

                if (levelId == null)
                    continue;

                jdbcTemplate.update("""
                            INSERT INTO user_progress (user_id, level_id, completed, score, completed_at, updated_at)
                            VALUES (?, ?, ?, ?, NOW(), NOW())
                            ON CONFLICT (user_id, level_id) DO UPDATE SET
                                completed = EXCLUDED.completed OR user_progress.completed,
                                score = GREATEST(user_progress.score, EXCLUDED.score),
                                updated_at = NOW()
                        """, userId, levelId, completed, score);
                synced++;
            } catch (Exception ignored) {
                // Skip invalid entries, continue syncing
            }
        }

        return ResponseEntity.ok(Map.of("synced", synced));
    }
}
