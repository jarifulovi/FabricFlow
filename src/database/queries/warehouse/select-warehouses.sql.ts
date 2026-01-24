export const baseWarehousesSQL = `
SELECT *
FROM warehouses
`;

export const buildSelectWarehousesQuery = (filters?: {
  isActive?: boolean;
  search?: string; // search by name or location
  sortBy?: 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}) => {
  let text = baseWarehousesSQL;
  const values: (string | boolean)[] = [];
  let counter = 1;
  let whereAdded = false;

  if (filters?.isActive !== undefined) {
    text += ` WHERE is_active = $${counter++}`;
    values.push(filters.isActive);
    whereAdded = true;
  }

  if (filters?.search) {
    text += whereAdded ? ' AND' : ' WHERE';
    text += ` (name ILIKE $${counter} OR location ILIKE $${counter})`;
    values.push(`%${filters.search}%`);
    counter++;
  }

  // Sorting
  if (filters?.sortBy) {
    const sortColumn = filters.sortBy === 'createdAt' ? 'created_at' : 'name';
    const sortOrder = filters.sortOrder === 'asc' ? 'ASC' : 'DESC';
    text += ` ORDER BY ${sortColumn} ${sortOrder}`;
  } else {
    text += ` ORDER BY name ASC`; // default ordering
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
