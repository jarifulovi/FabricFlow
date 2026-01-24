export const baseReceivingSlipLinesSQL = `
SELECT *
FROM receiving_slip_lines
`;

export const buildSelectReceivingSlipLinesQuery = (filters?: {
  slipId?: string;
  warehouseId?: string;
  variantId?: string;
  sortBy?: 'createdAt';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}) => {
  let text = baseReceivingSlipLinesSQL;
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

  // Sorting
  if (filters?.sortBy) {
    const sortOrder = filters.sortOrder === 'asc' ? 'ASC' : 'DESC';
    text += ` ORDER BY created_at ${sortOrder}`;
  } else {
    text += ` ORDER BY created_at ASC`; // default ordering
  }

  // Pagination
  if (filters?.limit !== undefined) {
    text += ` LIMIT $${counter++}`;
    values.push(filters.limit.toString());
  }
  if (filters?.offset !== undefined) {
    text += ` OFFSET $${counter++}`;
    values.push(filters.offset.toString());
  }

  return { text, values };
};
