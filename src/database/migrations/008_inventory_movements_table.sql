--- ============================================================
-- Migration: 007_inventory_movements_table.sql
-- Description: Create inventory_movements table for tracking all item movements
-- Notes: Movements will be created after receiving invoices
--        Transaction will be used on the whole slip+movement to ensure consistency
--        General flow is to create invoice, create line items, create movements, finalize invoice

-- ============================================================
-- Inventory Movements table
-- ============================================================


-- ENUM types
CREATE TYPE movement_type AS ENUM ('IN', 'OUT', 'ADJUSTMENT');
CREATE TYPE item_type AS ENUM ('product_variant', 'raw_material');
CREATE TYPE movement_source AS ENUM (
  'receiving_slip_purchase',
  'receiving_slip_production',
  'purchase_order',
  'sale_order',
  'manual_adjustment'
);

-- Inventory Movements table
CREATE TABLE inventory_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL,                   -- Generic reference to product variant or raw material
  warehouse_id UUID NOT NULL REFERENCES warehouses(id),
  quantity NUMERIC(15,3) NOT NULL,         -- Positive = IN, Negative = OUT (optional if using movement_type)
  movement_type movement_type NOT NULL,    -- IN, OUT, ADJUSTMENT
  item_type item_type NOT NULL,            -- Type of item being moved
  source_type movement_source NOT NULL,    -- Type of document causing movement
  source_id UUID NOT NULL,                 -- FK to the source document (slip, PO, sale, etc.)
  batch_id UUID,                           -- Optional batch reference for raw materials
  price NUMERIC(12,2),                     -- Optional unit cost
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_inventory_movements_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_inventory_movements_updated_at
  BEFORE UPDATE ON inventory_movements
  FOR EACH ROW
  EXECUTE FUNCTION update_inventory_movements_updated_at();

-- Indexes for fast queries
CREATE INDEX idx_inventory_movements_item_id ON inventory_movements(item_id);
CREATE INDEX idx_inventory_movements_warehouse_id ON inventory_movements(warehouse_id);
CREATE INDEX idx_inventory_movements_source ON inventory_movements(source_type, source_id);

-- Comments
COMMENT ON TABLE inventory_movements IS 'Generic inventory movements table for all items (variants, raw materials, etc.)';
COMMENT ON COLUMN inventory_movements.item_id IS 'Reference to the item being moved (variant or raw material)';
COMMENT ON COLUMN inventory_movements.warehouse_id IS 'Warehouse where the movement occurs';
COMMENT ON COLUMN inventory_movements.quantity IS 'Quantity moved (positive for IN, negative for OUT)';
COMMENT ON COLUMN inventory_movements.movement_type IS 'Type of movement: IN, OUT, ADJUSTMENT';
COMMENT ON COLUMN inventory_movements.item_type IS 'Type of item being moved: product_variant, raw_material';
COMMENT ON COLUMN inventory_movements.source_type IS 'Type of source document triggering this movement';
COMMENT ON COLUMN inventory_movements.source_id IS 'ID of the source document';
COMMENT ON COLUMN inventory_movements.price IS 'Optional cost per unit';
COMMENT ON COLUMN inventory_movements.batch_id IS 'Optional batch reference for raw materials';
