import { VariantFindAllFilters } from '../../types/variant';

export const baseSelectVariantsSQL = `
SELECT 
  v.*,
  p.sku AS product_sku,
  p.name AS product_name,
  p.status AS product_status,
  c.name AS category_name
FROM product_variants v
INNER JOIN products p ON v.product_id = p.id
LEFT JOIN categories c ON p.category_id = c.id
`;

export const buildSelectVariantsQuery = (filters?: VariantFindAllFilters) => {
  let text = baseSelectVariantsSQL;
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
  if (filters?.ids && filters.ids.length > 0) {
    const placeholders = filters.ids.map((_, index) => `$${counter + index}`).join(', ');
    text += ` AND v.id IN (${placeholders})`;
    values.push(...filters.ids);
    counter += filters.ids.length;
  }

  // Sorting
  if (filters?.sortBy) {
    const sortColumn = filters.sortBy === 'createdAt' ? 'created_at' : filters.sortBy;
    const sortOrder = filters.sortOrder === 'asc' ? 'ASC' : 'DESC';
    text += ` ORDER BY v.${sortColumn} ${sortOrder}`;
  } else {
    text += ` ORDER BY v.created_at DESC`; // default ordering
  }

  // Pagination
  if (filters?.limit !== undefined) {
    text += ` LIMIT $${counter}`;
    counter++;
    values.push(filters.limit.toString());
  }
  if (filters?.offset !== undefined) {
    text += ` OFFSET $${counter}`;
    counter++;
    values.push(filters.offset.toString());
  }

  return { text, values };
};
