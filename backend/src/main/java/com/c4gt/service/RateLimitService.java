package com.c4gt.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

/**
 * Redis-based sliding window rate limiter.
 * Uses INCR + EXPIRE to count requests per key within a time window.
 */
@Service
public class RateLimitService {

    private static final Logger log = LoggerFactory.getLogger(RateLimitService.class);

    @Autowired
    private StringRedisTemplate redisTemplate;

    /**
     * Check if the given key has exceeded the rate limit.
     *
     * @param key         unique key (e.g., "rate:login:192.168.1.1" or
     *                    "rate:api:userId:42")
     * @param maxRequests maximum requests allowed in the window
     * @param window      time window duration
     * @return true if request is ALLOWED, false if rate limited
     */
    public boolean isAllowed(String key, int maxRequests, Duration window) {
        try {
            String redisKey = "ratelimit:" + key;
            Long count = redisTemplate.opsForValue().increment(redisKey);
            if (count == null)
                return true;

            if (count == 1) {
                redisTemplate.expire(redisKey, window);
            }

            if (count > maxRequests) {
                log.warn("Rate limit exceeded for key={}, count={}, max={}", key, count, maxRequests);
                return false;
            }
            return true;
        } catch (Exception e) {
            // Redis failure = fail open (allow the request)
            log.error("Redis rate limit check failed, allowing request", e);
            return true;
        }
    }

    /**
     * Get remaining requests for a key.
     */
    public int getRemaining(String key, int maxRequests) {
        try {
            String val = redisTemplate.opsForValue().get("ratelimit:" + key);
            if (val == null)
                return maxRequests;
            return Math.max(0, maxRequests - Integer.parseInt(val));
        } catch (Exception e) {
            return maxRequests;
        }
    }
}
