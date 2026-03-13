-- ============================================================
-- Migration: 005_receiving_slips.sql
-- Description: Create receiving_slips table to track inventory intake

-- ============================================================
-- Receiving Slips table
-- ============================================================


CREATE TYPE slip_type AS ENUM ('purchase', 'production');
CREATE TYPE slip_status AS ENUM ('draft', 'confirmed', 'cancelled');

CREATE TABLE receiving_slips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slip_number VARCHAR(50) UNIQUE NOT NULL,
  type slip_type NOT NULL,
  status slip_status DEFAULT 'draft',
  date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  warehouse_id UUID NOT NULL REFERENCES warehouses(id),
  created_by UUID,                                          -- optional for user tracking
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_receiving_slips_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_receiving_slips_updated_at
  BEFORE UPDATE ON receiving_slips
  FOR EACH ROW
  EXECUTE FUNCTION update_receiving_slips_updated_at();

-- Comments
COMMENT ON TABLE receiving_slips IS 'Records of receiving slips for inventory intake.';
COMMENT ON COLUMN receiving_slips.slip_number IS 'Unique identifier for the receiving slip.';
COMMENT ON COLUMN receiving_slips.type IS 'Type of receiving slip (purchase, production).';
COMMENT ON COLUMN receiving_slips.status IS 'Current status of the receiving slip.';
COMMENT ON COLUMN receiving_slips.warehouse_id IS 'Link to the warehouse where items are received.';
COMMENT ON COLUMN receiving_slips.created_by IS 'Optional link to the user who created the slip.';

