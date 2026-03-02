package com.c4gt.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

/**
 * JWT token blacklisting via Redis.
 * Stores blacklisted JTI (JWT ID) with TTL matching token expiry.
 * Fail-open: if Redis is down, tokens are accepted (with alert).
 */
@Service
public class TokenBlacklistService {

    private static final Logger log = LoggerFactory.getLogger(TokenBlacklistService.class);
    private static final String KEY_PREFIX = "jwt:blacklist:";

    @Autowired
    private StringRedisTemplate redisTemplate;

    /**
     * Blacklist a token (on logout or security event).
     * 
     * @param jti   JWT ID
     * @param ttlMs remaining time until token expires
     */
    public void blacklist(String jti, long ttlMs) {
        try {
            String key = KEY_PREFIX + jti;
            redisTemplate.opsForValue().set(key, "1", Duration.ofMillis(ttlMs));
            log.info("Token blacklisted: jti={}", jti);
        } catch (Exception e) {
            log.error("Failed to blacklist token: jti={}", jti, e);
        }
    }

    /**
     * Check if a token is blacklisted.
     * 
     * @return true if blacklisted, false otherwise
     */
    public boolean isBlacklisted(String jti) {
        if (jti == null)
            return false;
        try {
            return Boolean.TRUE.equals(redisTemplate.hasKey(KEY_PREFIX + jti));
        } catch (Exception e) {
            // Fail-open: Redis failure = allow (prevent total lockout)
            log.error("Redis blacklist check failed, allowing token: jti={}", jti, e);
            return false;
        }
    }
}
