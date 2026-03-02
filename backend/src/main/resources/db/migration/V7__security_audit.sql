-- V7: Security audit log + session tracking

CREATE TABLE security_audit_log (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT,      -- nullable for failed login attempts on non-existent users
    event_type      VARCHAR(50)  NOT NULL,  -- LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT, OTP_SENT, PASSWORD_CHANGE, SESSION_CREATED, ADMIN_ACTION
    ip_address      VARCHAR(45),
    user_agent      VARCHAR(500),
    details         JSONB        DEFAULT '{}',
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_user     ON security_audit_log(user_id, created_at);
CREATE INDEX idx_audit_type     ON security_audit_log(event_type, created_at);
CREATE INDEX idx_audit_ip       ON security_audit_log(ip_address, created_at);

-- User sessions tracking
CREATE TABLE user_sessions (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token   VARCHAR(128) NOT NULL UNIQUE,
    device_info     VARCHAR(500),
    ip_address      VARCHAR(45),
    last_active_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    expires_at      TIMESTAMPTZ  NOT NULL,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    revoked         BOOLEAN      NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_sessions_user  ON user_sessions(user_id, revoked);
CREATE INDEX idx_sessions_token ON user_sessions(session_token);
