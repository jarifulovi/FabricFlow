-- ============================================================
-- Migration: Create Product Variants Table
-- Description: Product Variants table for specific product versions

-- ============================================================
-- Product Variants table
-- ============================================================


CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id),          -- Link to master product
  sku VARCHAR(100) NOT NULL,                                 -- Variant-specific SKU
  vendor_sku VARCHAR(100),                                   -- Optional vendor SKU
  color VARCHAR(50),
  size VARCHAR(20),
  gender VARCHAR(10),                                        -- Men, Women, Kids
  season VARCHAR(20),                                        -- Summer, Winter, All-season
  fit VARCHAR(20),                                           -- Slim, Regular, Loose
  price NUMERIC(12,2),                                       -- Optional variant-specific price
  reorder_level NUMERIC(15,3),                               -- Optional, used for stock alerts
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Trigger function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_product_variants_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_product_variants_updated_at
  BEFORE UPDATE ON product_variants
  FOR EACH ROW
  EXECUTE FUNCTION update_product_variants_updated_at();

-- Indexes for faster lookups
CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_product_variants_is_deleted ON product_variants(is_deleted) WHERE is_deleted = false;
CREATE UNIQUE INDEX idx_product_variants_sku_unique ON product_variants(sku) WHERE is_deleted = false;

-- Comments
COMMENT ON TABLE product_variants IS 'Specific variants of products, used for inventory and sales tracking';
COMMENT ON COLUMN product_variants.sku IS 'Variant-level SKU, unique among non-deleted variants only.';
COMMENT ON COLUMN product_variants.product_id IS 'Foreign key to the master product';
COMMENT ON COLUMN product_variants.price IS 'Optional variant-specific selling price';
COMMENT ON COLUMN product_variants.reorder_level IS 'Quantity threshold to trigger reorder alerts';
COMMENT ON COLUMN product_variants.vendor_sku IS 'Optional vendor-specific SKU for the variant';   