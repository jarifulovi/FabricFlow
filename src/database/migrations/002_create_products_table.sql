--- ============================================================
-- Migration: Create products table for garments/fabric management
-- Description: Products table for storing fabric and garment inventory items

-- ============================================================
-- Product table
-- ============================================================

-- ENUM types
CREATE TYPE product_status AS ENUM ('active', 'inactive', 'discontinued');
CREATE TYPE unit_of_measure AS ENUM ('meter', 'yard', 'kilogram', 'piece', 'roll', 'bundle');


CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku VARCHAR(100) UNIQUE NOT NULL,                  -- Stock Keeping Unit
  name VARCHAR(255) NOT NULL,                        -- Product name
  description TEXT,
  brand_name VARCHAR(100),
  brand_code VARCHAR(50),
  category_id UUID NOT NULL REFERENCES categories(id), -- FK to categories
  status product_status DEFAULT 'active' NOT NULL,   -- Lifecycle status
  unit unit_of_measure NOT NULL,                     -- Unit of measure
  is_deleted BOOLEAN DEFAULT FALSE,
  tags TEXT[],                                       -- Optional tags
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Trigger function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_products_updated_at();

-- Indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_is_deleted ON products(is_deleted) WHERE is_deleted = false;

-- Table comment
COMMENT ON TABLE products IS 'Stores garment product definitions. Variants, pricing, and stock are handled in other tables.';
-- Column comments
COMMENT ON COLUMN products.sku IS 'Unique product-level SKU (not variant-specific).';
COMMENT ON COLUMN products.category_id IS 'Product category such as Shirt, Pant, Jacket.';
COMMENT ON COLUMN products.status IS 'Product availability state (active, inactive, discontinued).';
COMMENT ON COLUMN products.unit IS 'Base unit used for this product, shared by all variants.';
COMMENT ON COLUMN products.tags IS 'Optional labels for search and filtering.';