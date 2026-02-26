import { VariantCountFilters } from '../../types/variant';

export const baseCountVariantsSQL = `
SELECT COUNT(*) as count
FROM product_variants v
`;

export const buildCountVariantsQuery = (filters?: VariantCountFilters) => {
  let text = baseCountVariantsSQL;
  const values: string[] = [];
  let counter = 1;

  // Add WHERE clause for deleted status - defaults to false for safety
  if (filters?.includeDeleted === true) {
    text += 'WHERE 1=1'; // include all variants
  } else {
    text += 'WHERE v.is_deleted = false'; // exclude deleted variants by default
  }

  if (filters?.productId) {
    text += ` AND v.product_id = $${counter}`;
    counter++;
    values.push(filters.productId);
  }
  if (filters?.color) {
    text += ` AND v.color = $${counter}`;
    counter++;
    values.push(filters.color);
  }
  if (filters?.size) {
    text += ` AND v.size = $${counter}`;
    counter++;
    values.push(filters.size);
  }
  if (filters?.gender) {
    text += ` AND v.gender = $${counter}`;
    counter++;
    values.push(filters.gender);
  }
  if (filters?.season) {
    text += ` AND v.season = $${counter}`;
    counter++;
    values.push(filters.season);
  }
  if (filters?.fit) {
    text += ` AND v.fit = $${counter}`;
    counter++;
    values.push(filters.fit);
  }
  if (filters?.search) {
    text += ` AND (v.sku ILIKE $${counter} OR v.vendor_sku ILIKE $${counter})`;
    values.push(`%${filters.search}%`);
    counter++;
  }
  if (filters?.excludeIds && filters.excludeIds.length > 0) {
    const placeholders = filters.excludeIds.map((_, index) => `$${counter + index}`).join(', ');
    text += ` AND v.id NOT IN (${placeholders})`;
    values.push(...filters.excludeIds);
    counter += filters.excludeIds.length;
  }

  return { text, values };
};
