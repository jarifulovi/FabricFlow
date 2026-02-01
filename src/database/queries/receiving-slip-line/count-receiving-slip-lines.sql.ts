export const baseCountReceivingSlipLinesSQL = `
SELECT COUNT(*) as count
FROM receiving_slip_lines
`;

export const buildCountReceivingSlipLinesQuery = (filters?: {
  slipId?: string;
  warehouseId?: string;
  variantId?: string;
}) => {
  let text = baseCountReceivingSlipLinesSQL;
  const values: string[] = [];
  let counter = 1;
  let whereAdded = false;

  if (filters) {
    if (filters.slipId) {
      text += ` WHERE slip_id = $${counter++}`;
      values.push(filters.slipId);
      whereAdded = true;
    }
    if (filters.warehouseId) {
      text += whereAdded ? ' AND' : ' WHERE';
      text += ` warehouse_id = $${counter++}`;
      values.push(filters.warehouseId);
      whereAdded = true;
    }
    if (filters.variantId) {
      text += whereAdded ? ' AND' : ' WHERE';
      text += ` variant_id = $${counter++}`;
      values.push(filters.variantId);
    }
  }

  return { text, values };
};
