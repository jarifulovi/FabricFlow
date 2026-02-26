import { receivingSlipColumnMapping, SlipStatus, SlipType } from '../../types/receiving-slip';

export const baseReceivingSlipsSQL = `
SELECT *
FROM receiving_slips
`;

export const buildSelectReceivingSlipsQuery = (filters?: {
  type?: SlipType;
  status?: SlipStatus;
  warehouseId?: string;
  createdBy?: string;
  search?: string; // search by slip_number
  sortBy?: 'slipNumber' | 'date' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}) => {
  let text = baseReceivingSlipsSQL;
  const values: string[] = [];
  let counter = 1;
  let whereAdded = false;

  if (filters) {
    if (filters.type) {
      text += ` WHERE type = $${counter}`;
      counter++;
      values.push(filters.type);
      whereAdded = true;
    }
    if (filters.status) {
      text += whereAdded ? ' AND' : ' WHERE';
      text += ` status = $${counter}`;
      counter++;
      values.push(filters.status);
      whereAdded = true;
    }
    if (filters.warehouseId) {
      text += whereAdded ? ' AND' : ' WHERE';
      text += ` warehouse_id = $${counter}`;
      counter++;
      values.push(filters.warehouseId);
      whereAdded = true;
    }
    if (filters.createdBy) {
      text += whereAdded ? ' AND' : ' WHERE';
      text += ` created_by = $${counter}`;
      counter++;
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

  // Sorting
  if (filters?.sortBy) {
    const sortColumn = receivingSlipColumnMapping[filters.sortBy] || 'created_at';
    const sortOrder = filters.sortOrder === 'asc' ? 'ASC' : 'DESC';
    text += ` ORDER BY ${sortColumn} ${sortOrder}`;
  } else {
    text += ` ORDER BY created_at DESC`; // default ordering
  }

  // Pagination
  if (filters?.limit !== undefined) {
    text += ` LIMIT $${counter}`;
    counter++;
    values.push(filters.limit.toString());
  }
  if (filters?.offset !== undefined) {
    text += ` OFFSET $${counter}`;
    counter++;
    values.push(filters.offset.toString());
  }

  return { text, values };
};
