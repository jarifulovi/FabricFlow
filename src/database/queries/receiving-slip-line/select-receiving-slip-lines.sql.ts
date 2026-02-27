import { ReceivingSlipLineFindAllFilters, receivingSlipLineColumnMapping } from '../../types/receiving-slip-line';

export const baseReceivingSlipLinesSQL = `
SELECT *
FROM receiving_slip_lines
`;

export const buildSelectReceivingSlipLinesQuery = (filters?: ReceivingSlipLineFindAllFilters) => {
  let text = baseReceivingSlipLinesSQL;
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

  // Sorting
  if (filters?.sortBy) {
    const sortColumn = receivingSlipLineColumnMapping[filters.sortBy] || 'created_at';
    const sortOrder = filters.sortOrder === 'asc' ? 'ASC' : 'DESC';
    text += ` ORDER BY ${sortColumn} ${sortOrder}`;
  } else {
    text += ` ORDER BY created_at ASC`; // default ordering
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
