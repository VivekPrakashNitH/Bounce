-- V5: Materialized views for analytics read path + partition management

-- Daily page engagement view
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_page_engagement_daily AS
SELECT
    pt.page_id,
    DATE(pt.last_visited_at) AS date,
    COUNT(DISTINCT pt.user_id) AS unique_visitors,
    AVG(pt.active_time_ms)::BIGINT AS avg_active_ms,
    AVG(pt.total_time_ms)::BIGINT AS avg_total_ms,
    SUM(pt.visit_count) AS total_visits
FROM page_time_tracking pt
GROUP BY pt.page_id, DATE(pt.last_visited_at);

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_page_engagement_daily
    ON mv_page_engagement_daily(page_id, date);

-- User engagement profile view
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_user_engagement_profile AS
SELECT
    pt.user_id,
    COUNT(DISTINCT pt.page_id) AS total_pages,
    SUM(pt.active_time_ms) AS total_active_ms,
    SUM(pt.tab_switches) AS total_tab_switches,
    SUM(pt.visit_count) AS total_visits,
    MAX(pt.last_visited_at) AS last_active_at,
    (SELECT COUNT(*) FROM dropoff_events de WHERE de.user_id = pt.user_id) AS total_dropoffs,
    (SELECT COUNT(*) FROM retry_events re WHERE re.user_id = pt.user_id) AS total_retries
FROM page_time_tracking pt
GROUP BY pt.user_id;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_user_engagement_profile
    ON mv_user_engagement_profile(user_id);

-- Content health overview (per page, all time — refreshed weekly)
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_content_health AS
SELECT
    pt.page_id,
    COUNT(DISTINCT pt.user_id) AS total_visitors,
    AVG(pt.active_time_ms)::BIGINT AS avg_active_ms,
    (SELECT COUNT(*) FROM dropoff_events de WHERE de.page_id = pt.page_id) AS total_dropoffs,
    (SELECT COUNT(DISTINCT re.user_id) FROM retry_events re WHERE re.page_id = pt.page_id) AS users_retried,
    CASE
        WHEN COUNT(DISTINCT pt.user_id) > 0
        THEN ((SELECT COUNT(*) FROM dropoff_events de2 WHERE de2.page_id = pt.page_id) * 100 / COUNT(DISTINCT pt.user_id))
        ELSE 0
    END AS dropoff_rate_pct
FROM page_time_tracking pt
GROUP BY pt.page_id;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_content_health
    ON mv_content_health(page_id);
