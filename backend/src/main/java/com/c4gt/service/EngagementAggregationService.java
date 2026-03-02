package com.c4gt.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Scheduled aggregation jobs for engagement data.
 * 
 * - Daily: per-user engagement profiles
 * - Weekly: content health scores per page
 */
@Service
public class EngagementAggregationService {

    private static final Logger log = LoggerFactory.getLogger(EngagementAggregationService.class);

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Daily aggregation — runs at 2 AM UTC.
     * Computes per-user engagement summary for the previous day.
     */
    @Scheduled(cron = "0 0 2 * * *")
    @Transactional
    public void aggregateDaily() {
        log.info("Starting daily engagement aggregation...");
        long start = System.currentTimeMillis();

        try {
            jdbcTemplate
                    .update("""
                                INSERT INTO daily_user_engagement (user_id, date, pages_visited, total_active_ms, avg_scroll_depth, events_count, dropoffs, retries, created_at)
                                SELECT
                                    pt.user_id,
                                    CURRENT_DATE - INTERVAL '1 day',
                                    COUNT(DISTINCT pt.page_id),
                                    COALESCE(SUM(pt.active_time_ms), 0),
                                    COALESCE((SELECT AVG(ee.scroll_depth) FROM engagement_events ee
                                              WHERE ee.user_id = pt.user_id AND ee.scroll_depth IS NOT NULL
                                              AND ee.created_at >= CURRENT_DATE - INTERVAL '1 day'
                                              AND ee.created_at < CURRENT_DATE), 0)::SMALLINT,
                                    (SELECT COUNT(*) FROM engagement_events ee2
                                     WHERE ee2.user_id = pt.user_id
                                     AND ee2.created_at >= CURRENT_DATE - INTERVAL '1 day'
                                     AND ee2.created_at < CURRENT_DATE),
                                    (SELECT COUNT(*) FROM dropoff_events de
                                     WHERE de.user_id = pt.user_id
                                     AND de.created_at >= CURRENT_DATE - INTERVAL '1 day'
                                     AND de.created_at < CURRENT_DATE),
                                    (SELECT COUNT(*) FROM retry_events re
                                     WHERE re.user_id = pt.user_id
                                     AND re.created_at >= CURRENT_DATE - INTERVAL '1 day'
                                     AND re.created_at < CURRENT_DATE),
                                    NOW()
                                FROM page_time_tracking pt
                                WHERE pt.last_visited_at >= CURRENT_DATE - INTERVAL '1 day'
                                  AND pt.last_visited_at < CURRENT_DATE
                                GROUP BY pt.user_id
                                ON CONFLICT (user_id, date) DO UPDATE SET
                                    pages_visited = EXCLUDED.pages_visited,
                                    total_active_ms = EXCLUDED.total_active_ms,
                                    avg_scroll_depth = EXCLUDED.avg_scroll_depth,
                                    events_count = EXCLUDED.events_count,
                                    dropoffs = EXCLUDED.dropoffs,
                                    retries = EXCLUDED.retries
                            """);

            long elapsed = System.currentTimeMillis() - start;
            log.info("Daily aggregation completed in {}ms", elapsed);
        } catch (Exception e) {
            log.error("Daily aggregation failed", e);
        }
    }

    /**
     * Weekly aggregation — runs at 3 AM UTC on Mondays.
     * Computes per-page content health scores.
     */
    @Scheduled(cron = "0 0 3 * * MON")
    @Transactional
    public void aggregateWeekly() {
        log.info("Starting weekly content health aggregation...");
        long start = System.currentTimeMillis();

        try {
            jdbcTemplate
                    .update("""
                                INSERT INTO weekly_content_health (page_id, week_start, unique_visitors, avg_time_ms, avg_scroll_depth, dropoff_rate_pct, retry_rate_pct, completion_rate_pct, created_at)
                                SELECT
                                    pt.page_id,
                                    DATE_TRUNC('week', CURRENT_DATE - INTERVAL '7 days')::DATE,
                                    COUNT(DISTINCT pt.user_id),
                                    COALESCE(AVG(pt.active_time_ms), 0),
                                    COALESCE((SELECT AVG(ee.scroll_depth) FROM engagement_events ee
                                              WHERE ee.page_id = pt.page_id AND ee.scroll_depth IS NOT NULL
                                              AND ee.created_at >= CURRENT_DATE - INTERVAL '7 days'), 0)::SMALLINT,
                                    CASE
                                        WHEN COUNT(DISTINCT pt.user_id) > 0
                                        THEN ((SELECT COUNT(*) FROM dropoff_events de WHERE de.page_id = pt.page_id
                                               AND de.created_at >= CURRENT_DATE - INTERVAL '7 days') * 100 / COUNT(DISTINCT pt.user_id))::SMALLINT
                                        ELSE 0
                                    END,
                                    CASE
                                        WHEN COUNT(DISTINCT pt.user_id) > 0
                                        THEN ((SELECT COUNT(DISTINCT re.user_id) FROM retry_events re WHERE re.page_id = pt.page_id
                                               AND re.created_at >= CURRENT_DATE - INTERVAL '7 days') * 100 / COUNT(DISTINCT pt.user_id))::SMALLINT
                                        ELSE 0
                                    END,
                                    0, -- completion_rate calculated separately when progress tracking is wired
                                    NOW()
                                FROM page_time_tracking pt
                                WHERE pt.last_visited_at >= CURRENT_DATE - INTERVAL '7 days'
                                GROUP BY pt.page_id
                                ON CONFLICT (page_id, week_start) DO UPDATE SET
                                    unique_visitors = EXCLUDED.unique_visitors,
                                    avg_time_ms = EXCLUDED.avg_time_ms,
                                    avg_scroll_depth = EXCLUDED.avg_scroll_depth,
                                    dropoff_rate_pct = EXCLUDED.dropoff_rate_pct,
                                    retry_rate_pct = EXCLUDED.retry_rate_pct
                            """);

            long elapsed = System.currentTimeMillis() - start;
            log.info("Weekly aggregation completed in {}ms", elapsed);
        } catch (Exception e) {
            log.error("Weekly aggregation failed", e);
        }
    }
}
