-- ============================================================
-- Migration: Create brands table
-- Description: Brands table for product brand management

-- ============================================================
-- Brands table
-- ============================================================

CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,                 -- Brand name, must be unique
  code VARCHAR(50) UNIQUE,                           -- Optional short brand code/identifier
  description TEXT,                                  -- Optional brand description
  country VARCHAR(100),                              -- Country of origin
  website VARCHAR(255),                              -- Brand website URL
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_brands_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_brands_updated_at
  BEFORE UPDATE ON brands
  FOR EACH ROW
  EXECUTE FUNCTION update_brands_updated_at();

-- Comments
COMMENT ON TABLE brands IS 'Stores brand definitions for products.';
COMMENT ON COLUMN brands.name IS 'Unique brand name.';
COMMENT ON COLUMN brands.code IS 'Optional short code or identifier for the brand.';
COMMENT ON COLUMN brands.description IS 'Optional brand description.';
COMMENT ON COLUMN brands.country IS 'Country of origin for the brand.';
COMMENT ON COLUMN brands.website IS 'Official brand website URL.';
