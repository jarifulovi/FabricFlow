import { ReceivingSlipCountFilters } from '../../types/receiving-slip';

export const baseCountReceivingSlipsSQL = `
SELECT COUNT(*) as count
FROM receiving_slips
`;

export const buildCountReceivingSlipsQuery = (filters?: ReceivingSlipCountFilters) => {
  let text = baseCountReceivingSlipsSQL;
  const values: string[] = [];
  let counter = 1;

  text += 'WHERE 1=1';

  if (filters) {
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

  return { text, values };
};
