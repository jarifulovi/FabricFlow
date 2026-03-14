-- ============================================================
-- Migration: 010_create_users_table.sql
-- Description: Create users table for application users (external auth)

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id VARCHAR(100) NOT NULL UNIQUE, -- ID from external auth provider
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(100),
  role_id UUID REFERENCES roles(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_users_updated_at();

-- Comments
COMMENT ON TABLE users IS 'Stores application users, mapped to external auth.';
COMMENT ON COLUMN users.external_id IS 'ID from external authentication provider.';
COMMENT ON COLUMN users.role_id IS 'Role assigned to the user.';
COMMENT ON COLUMN users.is_active IS 'Indicates if the user is active.';
