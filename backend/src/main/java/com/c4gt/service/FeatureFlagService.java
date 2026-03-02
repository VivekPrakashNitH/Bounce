package com.c4gt.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Simple feature flags backed by Redis.
 * Flags stored as key-value pairs: flag:{name} → "on" | "off" | percentage
 * (0-100)
 * 
 * Default: all flags OFF unless explicitly set.
 */
@Service
public class FeatureFlagService {

    private static final String KEY_PREFIX = "flag:";

    @Autowired
    private StringRedisTemplate redisTemplate;

    /**
     * Check if a feature is enabled for a given user.
     * Supports: "on", "off", or percentage-based rollout (e.g., "25" = 25% of
     * users).
     */
    public boolean isEnabled(String flagName, Long userId) {
        try {
            String value = redisTemplate.opsForValue().get(KEY_PREFIX + flagName);
            if (value == null || "off".equalsIgnoreCase(value))
                return false;
            if ("on".equalsIgnoreCase(value))
                return true;

            // Percentage rollout: deterministic per user (same user always gets same
            // result)
            int percentage = Integer.parseInt(value);
            return (userId % 100) < percentage;
        } catch (Exception e) {
            return false; // Default OFF on error
        }
    }

    /**
     * Get all feature flags.
     */
    public Map<String, Boolean> getAllFlags(Long userId) {
        return Map.of(
                "engagement_tracking", isEnabled("engagement_tracking", userId),
                "learning_engine", isEnabled("learning_engine", userId),
                "mastery_scoring", isEnabled("mastery_scoring", userId),
                "guided_implementation", isEnabled("guided_implementation", userId));
    }

    /**
     * Set a feature flag (admin only).
     */
    public void setFlag(String flagName, String value) {
        redisTemplate.opsForValue().set(KEY_PREFIX + flagName, value);
    }
}
