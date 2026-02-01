export const buildExistsCategoryQuery = (filters?: {
  id?: string;
  search?: string;
  includeDeleted?: boolean;
}) => {
  let text = `SELECT EXISTS(SELECT 1 FROM categories `;
  const values: string[] = [];
  let counter = 1;

  // Add WHERE clause for deleted status - defaults to false for safety
  if (filters?.includeDeleted === true) {
    text += 'WHERE 1=1'; // include all categories
  } else {
    text += 'WHERE is_deleted = false'; // exclude deleted categories by default
  }

  if (filters?.id) {
    text += ` AND id = $${counter}`;
    values.push(filters.id);
    counter++;
  }

  if (filters?.search) {
    text += ` AND name ILIKE $${counter}`;
    values.push(`%${filters.search}%`);
    counter++;
  }

  text += ') as exists';

  return { text, values };
};
