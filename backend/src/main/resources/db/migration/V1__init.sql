-- V1: Initial schema for Bounce learning platform
-- Migrated from H2 ddl-auto=update to Flyway-managed PostgreSQL

CREATE TABLE users (
    id              BIGSERIAL PRIMARY KEY,
    email           VARCHAR(255) NOT NULL UNIQUE,
    name            VARCHAR(255) NOT NULL,
    password        VARCHAR(255),
    avatar          VARCHAR(512),
    google_id       VARCHAR(255),
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE discussions (
    id              BIGSERIAL PRIMARY KEY,
    title           VARCHAR(200) NOT NULL,
    content         TEXT         NOT NULL,
    author          VARCHAR(255) NOT NULL,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE comments (
    id              BIGSERIAL PRIMARY KEY,
    content         TEXT         NOT NULL,
    author          VARCHAR(255) NOT NULL,
    author_email    VARCHAR(255),
    author_avatar   VARCHAR(512),
    discussion_id   BIGINT       REFERENCES discussions(id) ON DELETE CASCADE,
    level_id        VARCHAR(100),
    user_id         BIGINT       REFERENCES users(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE level_comments (
    id              BIGSERIAL PRIMARY KEY,
    content         TEXT         NOT NULL,
    level_id        VARCHAR(100) NOT NULL,
    author          VARCHAR(255) NOT NULL,
    author_email    VARCHAR(255),
    author_avatar   VARCHAR(512),
    user_id         BIGINT       REFERENCES users(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX idx_users_email           ON users(email);
CREATE INDEX idx_comments_discussion   ON comments(discussion_id);
CREATE INDEX idx_comments_level        ON comments(level_id);
CREATE INDEX idx_comments_user         ON comments(user_id);
CREATE INDEX idx_level_comments_level  ON level_comments(level_id);
CREATE INDEX idx_level_comments_user   ON level_comments(user_id);
