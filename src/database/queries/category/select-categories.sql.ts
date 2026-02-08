export const baseCategoriesSQL = `
SELECT *
FROM categories
`;

export const buildSelectCategoriesQuery = (filters?: {
  search?: string; // search by name
  includeDeleted?: boolean; // include soft-deleted categories
  excludeIds?: string[]; // exclude specific category IDs
  sortBy?: 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}) => {
  let text = baseCategoriesSQL;
  const values: string[] = [];
  let counter = 1;

  // Add WHERE clause for deleted status - defaults to false for safety
  if (filters?.includeDeleted === true) {
    text += 'WHERE 1=1'; // include all categories
  } else {
    text += 'WHERE is_deleted = false'; // exclude deleted categories by default
  }

  if (filters?.search) {
    text += ` AND name ILIKE $${counter}`;
    values.push(`%${filters.search}%`);
    counter++;
  }

  if (filters?.excludeIds && filters.excludeIds.length > 0) {
    const placeholders = filters.excludeIds.map((_, index) => `$${counter + index}`).join(', ');
    text += ` AND id NOT IN (${placeholders})`;
    values.push(...filters.excludeIds);
    counter += filters.excludeIds.length;
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
