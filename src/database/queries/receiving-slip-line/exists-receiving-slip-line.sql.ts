import { ReceivingSlipLineExistsFilters } from '../../types/receiving-slip-line';

export const buildExistsReceivingSlipLineQuery = (filters?: ReceivingSlipLineExistsFilters) => {
  let text = `SELECT EXISTS(SELECT 1 FROM receiving_slip_lines WHERE 1=1`;
  const values: string[] = [];
  let counter = 1;

  if (filters) {
    if (filters.id) {
      text += ` AND id = $${counter}`;
      counter++;
      values.push(filters.id);
    }
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

  text += ') as exists';

  return { text, values };
};
