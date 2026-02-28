import { ReceivingSlipExistsFilters } from '../../types/receiving-slip';

export const buildExistsReceivingSlipQuery = (filters?: ReceivingSlipExistsFilters) => {
  let text = `SELECT EXISTS(SELECT 1 FROM receiving_slips WHERE 1=1`;
  const values: string[] = [];
  let counter = 1;

  if (filters) {
    if (filters.id) {
      text += ` AND id = $${counter}`;
      counter++;
      values.push(filters.id);
    }
    if (filters.slipNumber) {
      text += ` AND slip_number = $${counter}`;
      values.push(filters.slipNumber);
      counter++;
    }
    if (filters.type) {
      text += ` AND type = $${counter}`;
      counter++;
      values.push(filters.type);
    }
    if (filters.status) {
      text += ` AND status = $${counter}`;
      counter++;
      values.push(filters.status);
    }
    if (filters.warehouseId) {
      text += ` AND warehouse_id = $${counter}`;
      counter++;
      values.push(filters.warehouseId);
    }
    if (filters.createdBy) {
      text += ` AND created_by = $${counter}`;
      counter++;
      values.push(filters.createdBy);
    }
  }

  text += ') as exists';

  return { text, values };
};
