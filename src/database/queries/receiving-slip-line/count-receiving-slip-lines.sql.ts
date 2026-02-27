import { ReceivingSlipLineCountFilters } from '../../types/receiving-slip-line';

export const baseCountReceivingSlipLinesSQL = `
SELECT COUNT(*) as count
FROM receiving_slip_lines
`;

export const buildCountReceivingSlipLinesQuery = (filters?: ReceivingSlipLineCountFilters) => {
  let text = baseCountReceivingSlipLinesSQL;
  const values: string[] = [];
  let counter = 1;

  text += 'WHERE 1=1';

  if (filters) {
    if (filters.slipId) {
      text += ` AND slip_id = $${counter}`;
      counter++;
      values.push(filters.slipId);
    }
    if (filters.warehouseId) {
      text += ` AND warehouse_id = $${counter}`;
      counter++;
      values.push(filters.warehouseId);
    }
    if (filters.variantId) {
      text += ` AND variant_id = $${counter}`;
      counter++;
      values.push(filters.variantId);
    }
  }

  return { text, values };
};
