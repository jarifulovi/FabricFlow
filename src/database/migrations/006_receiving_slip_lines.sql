-- =================================================================
-- Migration: 006_receiving_slip_lines.sql
-- Description: Create receiving_slip_lines table to detail items in receiving slips

-- ============================================================
-- Receiving Slip Lines table
-- ============================================================


CREATE TABLE receiving_slip_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slip_id UUID NOT NULL REFERENCES receiving_slips(id) ON DELETE CASCADE,
  line_number INT NOT NULL,
  warehouse_id UUID REFERENCES warehouses(id),  -- optional for line item level logic, if null uses slip's warehouse
  variant_id UUID REFERENCES product_variants(id),
  vendor_sku VARCHAR(100),           -- optional for purchase type
  quantity NUMERIC(15,3) NOT NULL,
  price NUMERIC(12,2),               -- optional, cost per unit
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT check_variant_or_vendor CHECK (variant_id IS NOT NULL OR vendor_sku IS NOT NULL)
);


-- Trigger function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_receiving_slip_lines_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_receiving_slip_lines_updated_at
  BEFORE UPDATE ON receiving_slip_lines
  FOR EACH ROW
  EXECUTE FUNCTION update_receiving_slip_lines_updated_at();

-- Indexes
CREATE INDEX idx_receiving_slip_lines_slip_id ON receiving_slip_lines(slip_id);
CREATE INDEX idx_receiving_slip_lines_variant_id ON receiving_slip_lines(variant_id);

-- Comments
COMMENT ON TABLE receiving_slip_lines IS 'Details of items included in receiving slips.';
COMMENT ON COLUMN receiving_slip_lines.slip_id IS 'Reference to the receiving slip.';
COMMENT ON COLUMN receiving_slip_lines.line_number IS 'Line item sequence number within the slip for ordering.';
COMMENT ON COLUMN receiving_slip_lines.warehouse_id IS 'Optional reference to the warehouse for this line item; if null, uses the slip''s warehouse.';
COMMENT ON COLUMN receiving_slip_lines.variant_id IS 'Reference to the product variant being received.';
COMMENT ON COLUMN receiving_slip_lines.vendor_sku IS 'Optional SKU provided by the vendor for purchase slips.';
COMMENT ON COLUMN receiving_slip_lines.quantity IS 'Quantity of the product variant received.';
COMMENT ON COLUMN receiving_slip_lines.price IS 'Optional cost per unit of the product variant received.';