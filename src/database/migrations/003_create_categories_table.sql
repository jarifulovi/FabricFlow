-- ============================================================
-- Migration: Create Categories Table
-- Description: Categories table for product/raw material classification

-- ============================================================
-- Enum: category type
-- ============================================================

DROP TYPE IF EXISTS category_type CASCADE;
CREATE TYPE category_type AS ENUM ('product', 'raw_material');

-- ============================================================
-- Categories table
-- ============================================================

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type category_type NOT NULL,                   -- product or raw_material
  name VARCHAR(50) NOT NULL,                     -- Shirt, Pant, Jacket, Button, Zipper etc.
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
CREATE INDEX idx_categories_type ON categories(type);
-- Name must be unique per type (e.g. 'Cotton' can exist as both product and raw_material category)
CREATE UNIQUE INDEX idx_categories_type_name_unique ON categories(type, name) WHERE is_deleted = false;

-- Comments
COMMENT ON TABLE categories IS 'Product/raw material categories (e.g., Shirt, Pant, Jacket, Button, Zipper).';
COMMENT ON COLUMN categories.type IS 'Distinguishes product categories from raw material categories';
COMMENT ON COLUMN categories.name IS 'Category name, unique per type';