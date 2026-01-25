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
    variantId,
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

// Bulk insert for creating multiple receiving slip lines at once
export const buildBulkInsertReceivingSlipLineQuery = (inputs: CreateReceivingSlipLineInput[]) => {
  const values: any[] = [];
  const valuePlaceholders: string[] = [];
  let counter = 1;

  inputs.forEach((input) => {
    const {
      slipId,
      lineNumber,
      warehouseId = null,
      variantId,
      vendorSku = null,
      quantity,
      price = null,
      notes = null,
    } = input;

    valuePlaceholders.push(
      `($${counter++}, $${counter++}, $${counter++}, $${counter++}, $${counter++}, $${counter++}, $${counter++}, $${counter++})`
    );

    values.push(slipId, lineNumber, warehouseId, variantId, vendorSku, quantity, price, notes);
  });

  const text = `
    INSERT INTO receiving_slip_lines
      (slip_id, line_number, warehouse_id, variant_id, vendor_sku, quantity, price, notes)
    VALUES
      ${valuePlaceholders.join(',\n      ')}
    RETURNING *;
  `;

  return { text, values };
};
