import { SlipStatus, SlipType } from '../../types/receiving-slip';

export const baseCountReceivingSlipsSQL = `
SELECT COUNT(*) as count
FROM receiving_slips
`;

export const buildCountReceivingSlipsQuery = (filters?: {
  type?: SlipType;
  status?: SlipStatus;
  warehouseId?: string;
  createdBy?: string;
  search?: string;
}) => {
  let text = baseCountReceivingSlipsSQL;
  const values: string[] = [];
  let counter = 1;
  let whereAdded = false;

  if (filters) {
    if (filters.type) {
      text += ` WHERE type = $${counter++}`;
      values.push(filters.type);
      whereAdded = true;
    }
    if (filters.status) {
      text += whereAdded ? ' AND' : ' WHERE';
      text += ` status = $${counter++}`;
      values.push(filters.status);
      whereAdded = true;
    }
    if (filters.warehouseId) {
      text += whereAdded ? ' AND' : ' WHERE';
      text += ` warehouse_id = $${counter++}`;
      values.push(filters.warehouseId);
      whereAdded = true;
    }
    if (filters.createdBy) {
      text += whereAdded ? ' AND' : ' WHERE';
      text += ` created_by = $${counter++}`;
      values.push(filters.createdBy);
      whereAdded = true;
    }
    if (filters.search) {
      text += whereAdded ? ' AND' : ' WHERE';
      text += ` slip_number ILIKE $${counter}`;
      values.push(`%${filters.search}%`);
      counter++;
    }
  }

  return { text, values };
};
