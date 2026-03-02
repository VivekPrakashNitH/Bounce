package com.c4gt.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;
import java.util.Map;

/**
 * Redis caching configuration with per-cache TTLs.
 * 
 * Cache strategy:
 * - userProfile: 15 min (invalidated on update)
 * - courseContent: 1 hour (static content, rarely changes)
 * - engagementSummary: 5 min (frequently updated)
 * - commentCounts: 10 min (moderate update frequency)
 * - recommendations: 30 min (recomputed on progress update)
 */
@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(15))
                .serializeKeysWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(new GenericJackson2JsonRedisSerializer()))
                .disableCachingNullValues();

        Map<String, RedisCacheConfiguration> perCacheConfig = Map.of(
                "userProfile", defaultConfig.entryTtl(Duration.ofMinutes(15)),
                "courseContent", defaultConfig.entryTtl(Duration.ofHours(1)),
                "engagementSummary", defaultConfig.entryTtl(Duration.ofMinutes(5)),
                "commentCounts", defaultConfig.entryTtl(Duration.ofMinutes(10)),
                "recommendations", defaultConfig.entryTtl(Duration.ofMinutes(30)));

        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(defaultConfig)
                .withInitialCacheConfigurations(perCacheConfig)
                .transactionAware()
                .build();
    }
}
