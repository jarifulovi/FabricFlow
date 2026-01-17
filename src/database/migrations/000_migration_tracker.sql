-- ============================================================
-- Migration Tracker Table
-- This table keeps track of which migrations have been executed
-- This Runs FIRST before any other migrations


CREATE TABLE IF NOT EXISTS schema_migrations (
  id SERIAL PRIMARY KEY,
  migration_name VARCHAR(255) UNIQUE NOT NULL,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  execution_time_ms INTEGER,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  checksum VARCHAR(64)
);

-- Index for quick lookup
CREATE INDEX idx_schema_migrations_name ON schema_migrations(migration_name);
CREATE INDEX idx_schema_migrations_executed_at ON schema_migrations(executed_at DESC);

-- Comment
COMMENT ON TABLE schema_migrations IS 'Tracks executed database migrations for version control';
