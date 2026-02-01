-- ============================================================
-- Migration: Create Categories Table
-- Description: Categories table for product classification

-- ============================================================
-- Categories table
-- ============================================================

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,       -- Shirt, Pant, Jacket, etc.
  description TEXT,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Trigger function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_categories_updated_at();

-- Indexes
CREATE INDEX idx_categories_is_deleted ON categories(is_deleted) WHERE is_deleted = false;
CREATE UNIQUE INDEX idx_categories_name_unique ON categories(name) WHERE is_deleted = false;

-- Comments
COMMENT ON TABLE categories IS 'Product categories (e.g., Shirt, Pant, Jacket)';
COMMENT ON COLUMN categories.name IS 'Category name';