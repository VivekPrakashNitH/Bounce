-- V2: Additional performance indexes
-- Covers time-range queries and sorting by creation date

-- Sorting discussions by recency
CREATE INDEX IF NOT EXISTS idx_discussions_created_at ON discussions(created_at DESC);

-- Sorting comments by recency within discussions/levels
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_level_comments_created_at ON level_comments(created_at DESC);

-- Composite index for looking up level comments by level + time (most common query)
CREATE INDEX IF NOT EXISTS idx_level_comments_level_created ON level_comments(level_id, created_at DESC);
