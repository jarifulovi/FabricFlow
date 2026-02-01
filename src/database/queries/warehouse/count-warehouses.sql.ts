export const baseCountWarehousesSQL = `
SELECT COUNT(*) as count
FROM warehouses
`;

export const buildCountWarehousesQuery = (filters?: {
  isActive?: boolean;
  search?: string;
}) => {
  let text = baseCountWarehousesSQL;
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

  return { text, values };
};
