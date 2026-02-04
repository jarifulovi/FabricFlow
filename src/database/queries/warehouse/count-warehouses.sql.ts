export const baseCountWarehousesSQL = `
SELECT COUNT(*) as count
FROM warehouses
`;

export const buildCountWarehousesQuery = (filters?: {
  isActive?: boolean;
  search?: string;
  includeDeleted?: boolean;
}) => {
  let text = baseCountWarehousesSQL;
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

  return { text, values };
};
