export const buildExistsWarehouseQuery = (filters?: {
  id?: string; // check if this id exists
  isActive?: boolean;
  search?: string;
}) => {
  let text = `SELECT EXISTS(SELECT 1 FROM warehouses`;
  const values: (string | boolean)[] = [];
  let counter = 1;
  let whereAdded = false;

  if (filters?.isActive !== undefined) {
    text += ` WHERE is_active = $${counter++}`;
    values.push(filters.isActive);
    whereAdded = true;
  }

  if (filters?.id) {
    text += whereAdded ? ' AND' : ' WHERE';
    text += ` id = $${counter++}`;
    values.push(filters.id);
    whereAdded = true;
  }

  if (filters?.search) {
    text += whereAdded ? ' AND' : ' WHERE';
    text += ` (name ILIKE $${counter} OR location ILIKE $${counter})`;
    values.push(`%${filters.search}%`);
    counter++;
  }

  text += ') as exists';

  return { text, values };
};
