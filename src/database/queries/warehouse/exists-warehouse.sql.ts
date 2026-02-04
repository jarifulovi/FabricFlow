export const buildExistsWarehouseQuery = (filters?: {
  id?: string; // check if this id exists
  isActive?: boolean;
  search?: string;
  includeDeleted?: boolean;
}) => {
  let text = `SELECT EXISTS(SELECT 1 FROM warehouses `;
  const values: (string | boolean)[] = [];
  let counter = 1;

  // Add WHERE clause for deleted status - defaults to false for safety
  if (filters?.includeDeleted === true) {
    text += 'WHERE 1=1'; // include all warehouses
  } else {
    text += 'WHERE is_deleted = false'; // exclude deleted warehouses by default
  }

  if (filters?.id) {
    text += ` AND id = $${counter++}`;
    values.push(filters.id);
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

  text += ') as exists';

  return { text, values };
};
