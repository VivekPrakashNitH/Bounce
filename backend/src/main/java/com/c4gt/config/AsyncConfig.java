package com.c4gt.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

/**
 * Async and scheduling configuration.
 * Bounded thread pool prevents OOM under load.
 */
@Configuration
@EnableAsync
@EnableScheduling
public class AsyncConfig {

    @Bean(name = "engagementExecutor")
    public Executor engagementExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(4);
        executor.setMaxPoolSize(8);
        executor.setQueueCapacity(1000);
        executor.setThreadNamePrefix("engagement-");
        executor.setRejectedExecutionHandler((r, e) -> {
            // Log rejected tasks instead of throwing
            org.slf4j.LoggerFactory.getLogger(AsyncConfig.class)
                    .warn("Engagement task rejected — queue full. Consider scaling.");
        });
        executor.initialize();
        return executor;
    }
}
