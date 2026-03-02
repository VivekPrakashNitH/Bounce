-- V4: Engagement tracking tables
-- Partitioned by month for efficient time-range queries and data retention

-- Raw engagement events (partitioned)
CREATE TABLE engagement_events (
    id              BIGSERIAL,
    user_id         BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_id      VARCHAR(64)  NOT NULL,
    event_type      VARCHAR(50)  NOT NULL,  -- PAGE_VIEW, SCROLL_DEPTH, SECTION_TIME, etc.
    page_id         VARCHAR(100) NOT NULL,
    section_id      VARCHAR(100),
    duration_ms     INT,
    scroll_depth    SMALLINT,               -- 0-100
    metadata        JSONB        DEFAULT '{}',
    client_version  VARCHAR(20),
    server_ts       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    client_ts       TIMESTAMPTZ  NOT NULL,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- Create partitions for current and next 2 months
CREATE TABLE engagement_events_2026_02 PARTITION OF engagement_events
    FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
CREATE TABLE engagement_events_2026_03 PARTITION OF engagement_events
    FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');
CREATE TABLE engagement_events_2026_04 PARTITION OF engagement_events
    FOR VALUES FROM ('2026-04-01') TO ('2026-05-01');

-- Page time tracking (upsert — one row per user × page)
CREATE TABLE page_time_tracking (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    page_id         VARCHAR(100) NOT NULL,
    active_time_ms  BIGINT       NOT NULL DEFAULT 0,
    total_time_ms   BIGINT       NOT NULL DEFAULT 0,
    tab_switches    INT          NOT NULL DEFAULT 0,
    visit_count     INT          NOT NULL DEFAULT 1,
    last_visited_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, page_id)
);

-- Section time tracking
CREATE TABLE section_time_tracking (
    id                  BIGSERIAL PRIMARY KEY,
    user_id             BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    page_id             VARCHAR(100) NOT NULL,
    section_id          VARCHAR(100) NOT NULL,
    active_time_ms      BIGINT       NOT NULL DEFAULT 0,
    visibility_percent  SMALLINT     NOT NULL DEFAULT 0,
    visit_count         INT          NOT NULL DEFAULT 1,
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, page_id, section_id)
);

-- Drop-off events
CREATE TABLE dropoff_events (
    id                  BIGSERIAL PRIMARY KEY,
    user_id             BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    page_id             VARCHAR(100) NOT NULL,
    last_section_seen   VARCHAR(100),
    scroll_depth_pct    SMALLINT     NOT NULL DEFAULT 0,
    time_spent_ms       INT          NOT NULL DEFAULT 0,
    referrer            VARCHAR(500),
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Retry events
CREATE TABLE retry_events (
    id                  BIGSERIAL PRIMARY KEY,
    user_id             BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    page_id             VARCHAR(100) NOT NULL,
    section_id          VARCHAR(100),
    quiz_id             VARCHAR(100),
    attempt_number      INT          NOT NULL DEFAULT 1,
    previous_result     VARCHAR(50),
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Daily user engagement summary (precomputed)
CREATE TABLE daily_user_engagement (
    id                  BIGSERIAL PRIMARY KEY,
    user_id             BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date                DATE         NOT NULL,
    pages_visited       INT          NOT NULL DEFAULT 0,
    total_active_ms     BIGINT       NOT NULL DEFAULT 0,
    avg_scroll_depth    SMALLINT     NOT NULL DEFAULT 0,
    events_count        INT          NOT NULL DEFAULT 0,
    dropoffs            INT          NOT NULL DEFAULT 0,
    retries             INT          NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, date)
);

-- Weekly content health scores (precomputed)
CREATE TABLE weekly_content_health (
    id                  BIGSERIAL PRIMARY KEY,
    page_id             VARCHAR(100) NOT NULL,
    week_start          DATE         NOT NULL,
    unique_visitors     INT          NOT NULL DEFAULT 0,
    avg_time_ms         BIGINT       NOT NULL DEFAULT 0,
    avg_scroll_depth    SMALLINT     NOT NULL DEFAULT 0,
    dropoff_rate_pct    SMALLINT     NOT NULL DEFAULT 0,
    retry_rate_pct      SMALLINT     NOT NULL DEFAULT 0,
    completion_rate_pct SMALLINT     NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    UNIQUE (page_id, week_start)
);

-- Indexes
CREATE INDEX idx_engagement_events_user     ON engagement_events(user_id, created_at);
CREATE INDEX idx_engagement_events_type     ON engagement_events(event_type, created_at);
CREATE INDEX idx_engagement_events_page     ON engagement_events(page_id, created_at);
CREATE INDEX idx_page_time_user             ON page_time_tracking(user_id);
CREATE INDEX idx_section_time_user          ON section_time_tracking(user_id, page_id);
CREATE INDEX idx_dropoff_page               ON dropoff_events(page_id, created_at);
CREATE INDEX idx_retry_page                 ON retry_events(page_id, created_at);
CREATE INDEX idx_daily_engagement_date      ON daily_user_engagement(date);
CREATE INDEX idx_weekly_health_week         ON weekly_content_health(week_start);
