package com.c4gt.config;

import io.github.resilience4j.circuitbreaker.CircuitBreaker;
import io.github.resilience4j.circuitbreaker.CircuitBreakerConfig;
import io.github.resilience4j.circuitbreaker.CircuitBreakerRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

/**
 * Circuit breaker configuration for external dependencies.
 * 
 * States: CLOSED → OPEN (after 5 failures in 60s) → HALF_OPEN (try 1 request
 * after 30s)
 * 
 * Breakers:
 * - Email service (Brevo) — sends OTP, notifications
 * - Redis — cache, rate limiting, session, feature flags
 * - Analytics DB queries — materialized view reads (non-critical)
 */
@Configuration
public class CircuitBreakerConfiguration {

    @Bean
    public CircuitBreakerRegistry circuitBreakerRegistry() {
        return CircuitBreakerRegistry.of(defaultConfig());
    }

    @Bean
    public CircuitBreaker emailCircuitBreaker(CircuitBreakerRegistry registry) {
        return registry.circuitBreaker("email", CircuitBreakerConfig.custom()
                .failureRateThreshold(50)
                .minimumNumberOfCalls(5)
                .slidingWindowSize(10)
                .waitDurationInOpenState(Duration.ofSeconds(60)) // Email retry after 60s
                .permittedNumberOfCallsInHalfOpenState(1)
                .build());
    }

    @Bean
    public CircuitBreaker redisCircuitBreaker(CircuitBreakerRegistry registry) {
        return registry.circuitBreaker("redis", CircuitBreakerConfig.custom()
                .failureRateThreshold(50)
                .minimumNumberOfCalls(5)
                .slidingWindowSize(10)
                .waitDurationInOpenState(Duration.ofSeconds(30)) // Redis recover fast
                .permittedNumberOfCallsInHalfOpenState(2)
                .build());
    }

    @Bean
    public CircuitBreaker analyticsCircuitBreaker(CircuitBreakerRegistry registry) {
        return registry.circuitBreaker("analytics", CircuitBreakerConfig.custom()
                .failureRateThreshold(60)
                .minimumNumberOfCalls(3)
                .slidingWindowSize(10)
                .waitDurationInOpenState(Duration.ofSeconds(30))
                .permittedNumberOfCallsInHalfOpenState(1)
                .build());
    }

    private CircuitBreakerConfig defaultConfig() {
        return CircuitBreakerConfig.custom()
                .failureRateThreshold(50)
                .minimumNumberOfCalls(5)
                .slidingWindowSize(10)
                .waitDurationInOpenState(Duration.ofSeconds(30))
                .permittedNumberOfCallsInHalfOpenState(1)
                .recordExceptions(Exception.class)
                .build();
    }
}
