export const baseCountCategoriesSQL = `
SELECT COUNT(*) as count
FROM categories
`;

export const buildCountCategoriesQuery = (filters?: {
  search?: string;
  includeDeleted?: boolean;
}) => {
  let text = baseCountCategoriesSQL;
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

  return { text, values };
};
