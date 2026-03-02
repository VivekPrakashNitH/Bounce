package com.c4gt.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

/**
 * Refreshes materialized views and manages data retention.
 *
 * Views:
 * - mv_page_engagement_daily — refreshed every 15 min
 * - mv_user_engagement_profile — refreshed hourly
 * - mv_content_health — refreshed daily
 *
 * Retention:
 * - Raw engagement_events older than 90 days — partition dropped
 * - Aggregated data (daily/weekly tables) — kept indefinitely
 */
@Service
public class DataMaintenanceService {

    private static final Logger log = LoggerFactory.getLogger(DataMaintenanceService.class);

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Refresh page engagement view every 15 minutes.
     * CONCURRENTLY allows reads during refresh.
     */
    @Scheduled(fixedRate = 15 * 60 * 1000, initialDelay = 60_000)
    public void refreshPageEngagement() {
        try {
            long start = System.currentTimeMillis();
            jdbcTemplate.execute("REFRESH MATERIALIZED VIEW CONCURRENTLY mv_page_engagement_daily");
            log.info("Refreshed mv_page_engagement_daily in {}ms", System.currentTimeMillis() - start);
        } catch (Exception e) {
            log.error("Failed to refresh mv_page_engagement_daily", e);
        }
    }

    /**
     * Refresh user profiles every hour.
     */
    @Scheduled(fixedRate = 60 * 60 * 1000, initialDelay = 120_000)
    public void refreshUserProfiles() {
        try {
            long start = System.currentTimeMillis();
            jdbcTemplate.execute("REFRESH MATERIALIZED VIEW CONCURRENTLY mv_user_engagement_profile");
            log.info("Refreshed mv_user_engagement_profile in {}ms", System.currentTimeMillis() - start);
        } catch (Exception e) {
            log.error("Failed to refresh mv_user_engagement_profile", e);
        }
    }

    /**
     * Refresh content health daily at 4 AM UTC.
     */
    @Scheduled(cron = "0 0 4 * * *")
    public void refreshContentHealth() {
        try {
            long start = System.currentTimeMillis();
            jdbcTemplate.execute("REFRESH MATERIALIZED VIEW CONCURRENTLY mv_content_health");
            log.info("Refreshed mv_content_health in {}ms", System.currentTimeMillis() - start);
        } catch (Exception e) {
            log.error("Failed to refresh mv_content_health", e);
        }
    }

    /**
     * Data retention: drop engagement_events partitions older than 90 days.
     * Runs weekly on Sunday at 5 AM UTC.
     */
    @Scheduled(cron = "0 0 5 * * SUN")
    public void purgeOldPartitions() {
        log.info("Starting data retention check...");
        try {
            // Find partitions older than 90 days
            var partitions = jdbcTemplate.queryForList("""
                        SELECT inhrelid::regclass::text AS partition_name
                        FROM pg_inherits
                        WHERE inhparent = 'engagement_events'::regclass
                        ORDER BY inhrelid::regclass::text
                    """);

            for (var row : partitions) {
                String partName = (String) row.get("partition_name");
                // Extract date from partition name: engagement_events_YYYY_MM
                String[] parts = partName.split("_");
                if (parts.length >= 4) {
                    try {
                        int year = Integer.parseInt(parts[2]);
                        int month = Integer.parseInt(parts[3]);
                        java.time.YearMonth partMonth = java.time.YearMonth.of(year, month);
                        java.time.YearMonth cutoff = java.time.YearMonth.now().minusMonths(3);

                        if (partMonth.isBefore(cutoff)) {
                            log.warn("Dropping old partition: {}", partName);
                            jdbcTemplate.execute("DROP TABLE IF EXISTS " + partName);
                            log.info("Dropped partition: {}", partName);
                        }
                    } catch (NumberFormatException ignored) {
                        // Not a date-based partition name — skip
                    }
                }
            }

            log.info("Data retention check completed");
        } catch (Exception e) {
            log.error("Data retention failed", e);
        }
    }
}
