-- ============================================================
-- Migration: 009_create_roles_table.sql
-- Description: Create roles table for user role management

CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE, -- e.g., 'admin', 'user', 'manager'
  description TEXT,
  is_system BOOLEAN DEFAULT FALSE, -- TRUE for built-in/system roles, FALSE for custom roles
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_roles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_roles_updated_at
  BEFORE UPDATE ON roles
  FOR EACH ROW
  EXECUTE FUNCTION update_roles_updated_at();

-- Comments
COMMENT ON TABLE roles IS 'Stores user roles for authorization.';
COMMENT ON COLUMN roles.name IS 'Role name, e.g., admin, user, manager.';
COMMENT ON COLUMN roles.description IS 'Optional description of the role.';
COMMENT ON COLUMN roles.is_system IS 'TRUE for system/built-in roles, FALSE for custom roles.';


-- Inserts for default roles
INSERT INTO roles (name, description, is_system) VALUES
('superadmin', 'Super Administrator with unrestricted access to all resources and permissions.', TRUE),
('admin', 'Administrator with full access to all resources.', TRUE),
('manager', 'Manager with elevated permissions but not full admin rights.', TRUE),
('user', 'Regular user with limited access.', TRUE)
ON CONFLICT (name) DO NOTHING; -- Avoid duplicate entries if migration is run multiple times