package com.c4gt.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * Admin analytics endpoints.
 * Reads from materialized views for fast response times.
 * All endpoints require JWT authentication.
 */
@RestController
@RequestMapping("/api/v1/admin/analytics")
public class AdminAnalyticsController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Platform overview — high-level engagement stats.
     */
    @GetMapping("/overview")
    public ResponseEntity<?> getOverview(Authentication auth) {
        try {
            Map<String, Object> overview = Map.of(
                    "totalUsers", queryScalar("SELECT COUNT(*) FROM users", 0L),
                    "totalPageViews", queryScalar(
                            "SELECT COALESCE(SUM(total_visits), 0) FROM mv_user_engagement_profile", 0L),
                    "totalActiveTimeHours", queryScalar(
                            "SELECT COALESCE(SUM(total_active_ms) / 3600000, 0) FROM mv_user_engagement_profile", 0L),
                    "totalDropoffs", queryScalar(
                            "SELECT COALESCE(SUM(total_dropoffs), 0) FROM mv_user_engagement_profile", 0L),
                    "avgPagesPerUser", queryScalar(
                            "SELECT COALESCE(AVG(total_pages), 0) FROM mv_user_engagement_profile", 0L));
            return ResponseEntity.ok(overview);
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                    "totalUsers", 0, "totalPageViews", 0,
                    "totalActiveTimeHours", 0, "totalDropoffs", 0, "avgPagesPerUser", 0,
                    "note", "Materialized views may not be populated yet"));
        }
    }

    /**
     * Content health scores — per-page engagement metrics.
     */
    @GetMapping("/content-health")
    public ResponseEntity<?> getContentHealth(Authentication auth) {
        try {
            List<Map<String, Object>> health = jdbcTemplate.queryForList("""
                        SELECT page_id, total_visitors, avg_active_ms,
                               total_dropoffs, users_retried, dropoff_rate_pct
                        FROM mv_content_health
                        ORDER BY total_visitors DESC
                        LIMIT 50
                    """);
            return ResponseEntity.ok(health);
        } catch (Exception e) {
            return ResponseEntity.ok(List.of());
        }
    }

    /**
     * Drop-off funnel — pages sorted by drop-off rate.
     */
    @GetMapping("/dropoff-funnel")
    public ResponseEntity<?> getDropoffFunnel(Authentication auth) {
        try {
            List<Map<String, Object>> funnel = jdbcTemplate.queryForList("""
                        SELECT page_id, total_visitors, dropoff_rate_pct,
                               avg_active_ms, total_dropoffs
                        FROM mv_content_health
                        WHERE total_visitors > 0
                        ORDER BY dropoff_rate_pct DESC
                        LIMIT 20
                    """);
            return ResponseEntity.ok(funnel);
        } catch (Exception e) {
            return ResponseEntity.ok(List.of());
        }
    }

    /**
     * Top engaged pages — pages with highest average active time.
     */
    @GetMapping("/top-pages")
    public ResponseEntity<?> getTopPages(Authentication auth) {
        try {
            List<Map<String, Object>> pages = jdbcTemplate.queryForList("""
                        SELECT page_id, date, unique_visitors, avg_active_ms, total_visits
                        FROM mv_page_engagement_daily
                        ORDER BY date DESC, unique_visitors DESC
                        LIMIT 30
                    """);
            return ResponseEntity.ok(pages);
        } catch (Exception e) {
            return ResponseEntity.ok(List.of());
        }
    }

    private Long queryScalar(String sql, Long defaultValue) {
        try {
            Long result = jdbcTemplate.queryForObject(sql, Long.class);
            return result != null ? result : defaultValue;
        } catch (Exception e) {
            return defaultValue;
        }
    }
}
