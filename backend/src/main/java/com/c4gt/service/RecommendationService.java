package com.c4gt.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Simple rules engine for recommending the next level.
 *
 * Rules:
 * 1. If user has incomplete levels, suggest the earliest one
 * 2. If caching was struggled with (low score), suggest DB internals first
 * 3. If all basics done, suggest advanced topics
 */
@Service
public class RecommendationService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Ordered prerequisite chains
    private static final List<String> LEARNING_PATH = List.of(
            "WELCOME", "WHAT_IS_BACKEND", "LOAD_BALANCER_DEMO",
            "CACHING_DEMO", "DB_DEMO", "RATE_LIMITER_DEMO",
            "URL_SHORTENER_DEMO", "API_GATEWAY_DEMO",
            "MESSAGE_QUEUE_DEMO", "CONSENSUS_DEMO",
            "AUTO_SCALING_DEMO", "DOCKER_DEMO",
            "CI_CD_DEMO", "OBSERVABILITY_DEMO");

    private static final Map<String, List<String>> PREREQUISITES = Map.of(
            "DB_SHARDING_DEMO", List.of("DB_DEMO", "CACHING_DEMO"),
            "MICROSERVICES_DEMO", List.of("DOCKER_DEMO", "API_GATEWAY_DEMO"),
            "CONSENSUS_DEMO", List.of("LOAD_BALANCER_DEMO"));

    /**
     * Get the next recommended level for a user.
     */
    public Map<String, Object> getNextRecommendation(Long userId) {
        // Get completed levels
        List<String> completed = jdbcTemplate.queryForList(
                "SELECT level_id FROM user_progress WHERE user_id = ? AND completed = true",
                String.class, userId);

        // Find first incomplete level in the learning path
        for (String level : LEARNING_PATH) {
            if (!completed.contains(level)) {
                // Check prerequisites
                List<String> prereqs = PREREQUISITES.getOrDefault(level, List.of());
                boolean prereqsMet = completed.containsAll(prereqs);

                if (prereqsMet) {
                    return Map.of(
                            "nextLevel", level,
                            "reason", "Next in your learning path",
                            "prerequisitesMet", true);
                } else {
                    // Suggest the unmet prerequisite instead
                    String missingPrereq = prereqs.stream()
                            .filter(p -> !completed.contains(p))
                            .findFirst().orElse(level);

                    return Map.of(
                            "nextLevel", missingPrereq,
                            "reason", "Prerequisite for " + level,
                            "prerequisitesMet", false);
                }
            }
        }

        // All levels completed
        return Map.of(
                "nextLevel", "COMPLETED_ALL",
                "reason", "You've completed all available levels!",
                "prerequisitesMet", true);
    }
}
