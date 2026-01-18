export const baseCategoriesSQL = `
SELECT *
FROM categories
`;

export const buildSelectCategoriesQuery = (filters?: {
  search?: string; // search by name
  sortBy?: 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}) => {
  let text = baseCategoriesSQL;
  const values: string[] = [];
  let counter = 1;

  if (filters?.search) {
    text += ` WHERE name ILIKE $${counter}`;
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
