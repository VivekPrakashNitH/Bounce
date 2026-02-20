-- PingBoard Schema v1
-- Flyway migration: V1__init.sql

CREATE TABLE users (
    id              BIGSERIAL PRIMARY KEY,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    name            VARCHAR(100) NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE monitors (
    id               BIGSERIAL PRIMARY KEY,
    user_id          BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name             VARCHAR(100) NOT NULL,
    url              VARCHAR(2048) NOT NULL,
    method           VARCHAR(10) NOT NULL DEFAULT 'GET',
    interval_seconds INT NOT NULL DEFAULT 60 CHECK (interval_seconds >= 30),
    timeout_ms       INT NOT NULL DEFAULT 10000 CHECK (timeout_ms >= 1000 AND timeout_ms <= 30000),
    expected_status  INT NOT NULL DEFAULT 200,
    is_active        BOOLEAN NOT NULL DEFAULT TRUE,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE health_checks (
    id               BIGSERIAL PRIMARY KEY,
    monitor_id       BIGINT NOT NULL REFERENCES monitors(id) ON DELETE CASCADE,
    status_code      INT,
    response_time_ms INT NOT NULL,
    is_up            BOOLEAN NOT NULL,
    error_message    TEXT,
    checked_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE incidents (
    id              BIGSERIAL PRIMARY KEY,
    monitor_id      BIGINT NOT NULL REFERENCES monitors(id) ON DELETE CASCADE,
    started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at     TIMESTAMPTZ,
    cause           TEXT
);

CREATE TABLE alert_channels (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    channel_type    VARCHAR(20) NOT NULL CHECK (channel_type IN ('email', 'webhook', 'slack')),
    config          JSONB NOT NULL DEFAULT '{}',
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX idx_health_checks_monitor_time ON health_checks(monitor_id, checked_at DESC);
CREATE INDEX idx_monitors_user ON monitors(user_id);
CREATE INDEX idx_monitors_active ON monitors(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_incidents_open ON incidents(monitor_id) WHERE resolved_at IS NULL;
CREATE INDEX idx_alert_channels_user ON alert_channels(user_id);
