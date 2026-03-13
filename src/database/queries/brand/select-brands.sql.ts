import { BrandFindAllFilters, brandColumnMapping } from '../../types/brand';

export const baseSelectBrandsSQL = `
SELECT
  b.*,
  COALESCE(pc.products_count, 0)::int AS products_count
FROM brands b
LEFT JOIN (
  SELECT brand_id, COUNT(*)::int AS products_count
  FROM products
  WHERE is_deleted = false
  GROUP BY brand_id
) pc ON pc.brand_id = b.id
`;

export const buildSelectBrandsQuery = (filters?: BrandFindAllFilters) => {
  let text = baseSelectBrandsSQL;
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

  if (filters?.sortBy) {
    const sortColumn = brandColumnMapping[filters.sortBy] || 'name';
    const sortOrder = filters.sortOrder === 'desc' ? 'DESC' : 'ASC';
    text += ` ORDER BY ${sortColumn} ${sortOrder}`;
  } else {
    text += ' ORDER BY name ASC';
  }

  if (filters?.limit !== undefined) {
    text += ` LIMIT $${counter}`;
    values.push(filters.limit.toString());
    counter++;
  }
  if (filters?.offset !== undefined) {
    text += ` OFFSET $${counter}`;
    values.push(filters.offset.toString());
    counter++;
  }

  return { text, values };
};
