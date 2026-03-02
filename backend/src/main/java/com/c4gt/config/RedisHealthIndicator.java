package com.c4gt.config;

import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.stereotype.Component;

/**
 * Custom health indicator for Redis connectivity.
 * Reports UP/DOWN in /actuator/health endpoint.
 */
@Component
public class RedisHealthIndicator implements HealthIndicator {

    private final RedisConnectionFactory connectionFactory;

    public RedisHealthIndicator(RedisConnectionFactory connectionFactory) {
        this.connectionFactory = connectionFactory;
    }

    @Override
    public Health health() {
        try {
            String pong = connectionFactory.getConnection().ping();
            if ("PONG".equalsIgnoreCase(pong)) {
                return Health.up()
                        .withDetail("service", "Redis")
                        .withDetail("status", "connected")
                        .build();
            }
            return Health.down()
                    .withDetail("service", "Redis")
                    .withDetail("reason", "Unexpected ping response: " + pong)
                    .build();
        } catch (Exception e) {
            return Health.down()
                    .withDetail("service", "Redis")
                    .withDetail("reason", e.getMessage())
                    .build();
        }
    }
}
