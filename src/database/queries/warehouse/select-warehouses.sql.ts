export const baseWarehousesSQL = `
SELECT *
FROM warehouses
`;

export const buildSelectWarehousesQuery = (filters?: {
  isActive?: boolean;
  search?: string; // search by name or location
  includeDeleted?: boolean; // include soft-deleted warehouses
  sortBy?: 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}) => {
  let text = baseWarehousesSQL;
  const values: (string | boolean)[] = [];
  let counter = 1;

  // Add WHERE clause for deleted status - defaults to false for safety
  if (filters?.includeDeleted === true) {
    text += 'WHERE 1=1'; // include all warehouses
  } else {
    text += 'WHERE is_deleted = false'; // exclude deleted warehouses by default
  }

  if (filters?.isActive !== undefined) {
    text += ` AND is_active = $${counter++}`;
    values.push(filters.isActive);
  }

  if (filters?.search) {
    text += ` AND (name ILIKE $${counter} OR location ILIKE $${counter})`;
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
