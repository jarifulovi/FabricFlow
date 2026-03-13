import { BrandCountFilters } from '../../types/brand';

export const baseCountBrandsSQL = `
SELECT COUNT(*) AS count
FROM brands b
`;

export const buildCountBrandsQuery = (filters?: BrandCountFilters) => {
  let text = baseCountBrandsSQL;
  const values: string[] = [];
  let counter = 1;

  text += 'WHERE 1=1';

  if (filters?.country) {
    text += ` AND b.country ILIKE $${counter}`;
    values.push(filters.country);
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

  return { text, values };
};
