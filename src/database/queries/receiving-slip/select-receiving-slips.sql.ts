import { ReceivingSlipFindAllFilters, receivingSlipColumnMapping } from '../../types/receiving-slip';

export const baseReceivingSlipsSQL = `
SELECT *
FROM receiving_slips
`;

export const buildSelectReceivingSlipsQuery = (filters?: ReceivingSlipFindAllFilters) => {
  let text = baseReceivingSlipsSQL;
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
    if (filters.search) {
      text += ` AND slip_number ILIKE $${counter}`;
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
