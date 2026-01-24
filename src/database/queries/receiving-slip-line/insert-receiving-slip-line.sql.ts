import { CreateReceivingSlipLineInput } from '../../types/receiving-slip-line';

export const insertReceivingSlipLineSQL = `
INSERT INTO receiving_slip_lines
  (slip_id, line_number, warehouse_id, variant_id, vendor_sku, quantity, price, notes)
VALUES
  ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING *;
`;

export const buildInsertReceivingSlipLineQuery = (input: CreateReceivingSlipLineInput) => {
  const {
    slipId,
    lineNumber,
    warehouseId = null,
    variantId = null,
    vendorSku = null,
    quantity,
    price = null,
    notes = null,
  } = input;

  return {
    text: insertReceivingSlipLineSQL,
    values: [slipId, lineNumber, warehouseId, variantId, vendorSku, quantity, price, notes],
  };
};
