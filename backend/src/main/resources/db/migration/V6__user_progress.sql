-- V6: User progress tracking table (server-side)

CREATE TABLE user_progress (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    level_id        VARCHAR(100) NOT NULL,
    completed       BOOLEAN      NOT NULL DEFAULT FALSE,
    score           INT          NOT NULL DEFAULT 0,
    metadata        JSONB        DEFAULT '{}',
    completed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, level_id)
);

CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_user_progress_completed ON user_progress(user_id, completed);
