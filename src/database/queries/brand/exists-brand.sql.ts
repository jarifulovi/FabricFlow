import { BrandExistsFilters } from '../../types/brand';

export const buildExistsBrandQuery = (filters?: BrandExistsFilters) => {
  let text = 'SELECT EXISTS(SELECT 1 FROM brands b WHERE 1=1';
  const values: string[] = [];
  let counter = 1;

  if (filters?.id) {
    text += ` AND b.id = $${counter}`;
    values.push(filters.id);
    counter++;
  }

  if (filters?.name) {
    text += ` AND b.name ILIKE $${counter}`;
    values.push(filters.name);
    counter++;
  }

  if (filters?.code) {
    text += ` AND b.code ILIKE $${counter}`;
    values.push(filters.code);
    counter++;
  }

  if (filters?.search) {
    text += ` AND (b.name ILIKE $${counter} OR b.code ILIKE $${counter})`;
    values.push(`%${filters.search}%`);
    counter++;
  }

  if (filters?.excludeIds && filters.excludeIds.length > 0) {
    const placeholders = filters.excludeIds.map((_, index) => `$${counter + index}`).join(', ');
    text += ` AND b.id NOT IN (${placeholders})`;
    values.push(...filters.excludeIds);
    counter += filters.excludeIds.length;
  }

  text += ') AS exists';
  return { text, values };
};
