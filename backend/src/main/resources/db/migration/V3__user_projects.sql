-- V3: User projects — tracks learner progress through the 9-stage evolving project
-- Each user has ONE project that evolves as they complete stages

CREATE TABLE user_projects (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT       NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    current_stage   VARCHAR(50)  NOT NULL DEFAULT 'monolith',
    project_name    VARCHAR(200) NOT NULL DEFAULT 'My Backend Project',
    started_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    last_active_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    is_deleted      BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Tracks completion of each individual stage
CREATE TABLE project_stages (
    id              BIGSERIAL PRIMARY KEY,
    project_id      BIGINT       NOT NULL REFERENCES user_projects(id) ON DELETE CASCADE,
    stage_id        VARCHAR(50)  NOT NULL,  -- e.g. 'monolith', 'structured', 'db-backed'
    status          VARCHAR(20)  NOT NULL DEFAULT 'locked',  -- locked, in_progress, completed
    started_at      TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    UNIQUE (project_id, stage_id)
);

-- Code snapshots submitted per stage
CREATE TABLE project_submissions (
    id              BIGSERIAL PRIMARY KEY,
    project_id      BIGINT       NOT NULL REFERENCES user_projects(id) ON DELETE CASCADE,
    stage_id        VARCHAR(50)  NOT NULL,
    code_content    TEXT,
    notes           TEXT,
    attempt_number  INT          NOT NULL DEFAULT 1,
    submitted_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_user_projects_user      ON user_projects(user_id);
CREATE INDEX idx_user_projects_stage     ON user_projects(current_stage);
CREATE INDEX idx_project_stages_project  ON project_stages(project_id);
CREATE INDEX idx_project_stages_status   ON project_stages(status);
CREATE INDEX idx_submissions_project     ON project_submissions(project_id);
CREATE INDEX idx_submissions_stage       ON project_submissions(project_id, stage_id);
