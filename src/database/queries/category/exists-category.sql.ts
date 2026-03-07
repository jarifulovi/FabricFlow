import { CategoryExistsFilters } from '../../types/category';

export const buildExistsCategoryQuery = (filters?: CategoryExistsFilters) => {
  let text = `SELECT EXISTS(SELECT 1 FROM categories `;
  const values: any[] = [];
  let counter = 1;

  // Add WHERE clause for deleted status - defaults to false for safety
  if (filters?.includeDeleted === true) {
    text += 'WHERE 1=1'; // include all categories
  } else {
    text += 'WHERE is_deleted = false'; // exclude deleted categories by default
  }

  if (filters?.id) {
    text += ` AND id = $${counter}`;
    counter++;
    values.push(filters.id);
  }

  if (filters?.type) {
    text += ` AND type = $${counter}`;
    counter++;
    values.push(filters.type);
  }

  if (filters?.search) {
    text += ` AND name ILIKE $${counter}`;
    counter++;
    values.push(`%${filters.search}%`);
  }

  if (filters?.excludeIds && filters.excludeIds.length > 0) {
    const placeholders = filters.excludeIds.map((_, index) => `$${counter + index}`).join(', ');
    text += ` AND id NOT IN (${placeholders})`;
    values.push(...filters.excludeIds);
    counter += filters.excludeIds.length;
  }

  text += ') as exists';

  return { text, values };
};
