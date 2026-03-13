--- ============================================================
-- Migration: 004_create_warehouses_table.sql
-- Description: Create warehouses table to manage storage locations

-- ============================================================
-- Warehouses table
-- ============================================================


CREATE TABLE warehouses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  location TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Trigger function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_warehouses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_warehouses_updated_at
  BEFORE UPDATE ON warehouses
  FOR EACH ROW
  EXECUTE FUNCTION update_warehouses_updated_at();

-- Indexes
CREATE INDEX idx_warehouses_is_deleted ON warehouses(is_deleted) WHERE is_deleted = false;
CREATE UNIQUE INDEX idx_warehouses_name_unique ON warehouses(name) WHERE is_deleted = false;

-- Comments
COMMENT ON TABLE warehouses IS 'Table to store warehouse information.';
COMMENT ON COLUMN warehouses.name IS 'Name of the warehouse.';
COMMENT ON COLUMN warehouses.location IS 'Physical location or address of the warehouse.';
COMMENT ON COLUMN warehouses.is_active IS 'Indicates if the warehouse is currently active.';
