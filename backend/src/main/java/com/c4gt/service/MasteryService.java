package com.c4gt.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Concept mastery scoring.
 *
 * Score = quiz (40%) + time (20%) + project stage (30%) + retry (10%)
 * Range: 0-100
 */
@Service
public class MasteryService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Calculate mastery score for a user on a specific concept.
     */
    public Map<String, Object> getMastery(Long userId, String conceptId) {
        // Quiz score component (40%)
        int quizScore = getQuizComponent(userId, conceptId);

        // Time investment component (20%) — more time = higher score, capped
        int timeScore = getTimeComponent(userId, conceptId);

        // Project stage component (30%)
        int projectScore = getProjectComponent(userId, conceptId);

        // Retry pattern component (10%) — fewer retries = higher mastery
        int retryScore = getRetryComponent(userId, conceptId);

        int total = Math.min(100,
                (int) (quizScore * 0.4 + timeScore * 0.2 + projectScore * 0.3 + retryScore * 0.1));

        String tier = total >= 90 ? "master" : total >= 70 ? "proficient" : total >= 40 ? "developing" : "beginner";

        return Map.of(
                "conceptId", conceptId,
                "totalScore", total,
                "tier", tier,
                "breakdown", Map.of(
                        "quiz", quizScore,
                        "timeInvestment", timeScore,
                        "projectProgress", projectScore,
                        "retryEfficiency", retryScore));
    }

    private int getQuizComponent(Long userId, String conceptId) {
        try {
            Integer score = jdbcTemplate.queryForObject(
                    "SELECT COALESCE(MAX(score), 0) FROM user_progress WHERE user_id = ? AND level_id LIKE ?",
                    Integer.class, userId, "%" + conceptId + "%");
            return Math.min(100, score != null ? score : 0);
        } catch (Exception e) {
            return 0;
        }
    }

    private int getTimeComponent(Long userId, String conceptId) {
        try {
            Long timeMs = jdbcTemplate.queryForObject(
                    "SELECT COALESCE(SUM(active_time_ms), 0) FROM page_time_tracking WHERE user_id = ? AND page_id LIKE ?",
                    Long.class, userId, "%" + conceptId + "%");
            if (timeMs == null)
                return 0;
            // 10 min = 50%, 30 min = 100%
            return Math.min(100, (int) (timeMs / 18_000)); // 30min = 1,800,000ms / 18,000 = 100
        } catch (Exception e) {
            return 0;
        }
    }

    private int getProjectComponent(Long userId, String conceptId) {
        try {
            Boolean completed = jdbcTemplate.queryForObject(
                    "SELECT EXISTS(SELECT 1 FROM project_stages ps JOIN user_projects up ON ps.project_id = up.id WHERE up.user_id = ? AND ps.stage_id LIKE ? AND ps.status = 'completed')",
                    Boolean.class, userId, "%" + conceptId + "%");
            return Boolean.TRUE.equals(completed) ? 100 : 0;
        } catch (Exception e) {
            return 0;
        }
    }

    private int getRetryComponent(Long userId, String conceptId) {
        try {
            Integer retries = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM retry_events WHERE user_id = ? AND page_id LIKE ?",
                    Integer.class, userId, "%" + conceptId + "%");
            if (retries == null || retries == 0)
                return 100; // No retries = mastered on first try
            if (retries <= 2)
                return 80;
            if (retries <= 5)
                return 50;
            return 20; // Many retries = still learning
        } catch (Exception e) {
            return 50;
        }
    }
}
