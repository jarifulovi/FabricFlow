export const baseSelectVariantsSQL = `
SELECT 
  v.*,
  p.sku AS product_sku,
  p.name AS product_name,
  c.name AS category_name
FROM product_variants v
INNER JOIN products p ON v.product_id = p.id
LEFT JOIN categories c ON p.category_id = c.id
WHERE v.is_deleted = false
`;

export const buildSelectVariantsQuery = (filters?: {
  productId?: string;
  color?: string;
  size?: string;
  gender?: string;
  season?: string;
  fit?: string;
  search?: string; // search by sku or vendor_sku
  sortBy?: 'sku' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}) => {
  let text = baseSelectVariantsSQL;
  const values: string[] = [];
  let counter = 1;

  if (filters) {
    if (filters.productId) {
      text += ` AND v.product_id = $${counter++}`;
      values.push(filters.productId);
    }
    if (filters.color) {
      text += ` AND v.color = $${counter++}`;
      values.push(filters.color);
    }
    if (filters.size) {
      text += ` AND v.size = $${counter++}`;
      values.push(filters.size);
    }
    if (filters.gender) {
      text += ` AND v.gender = $${counter++}`;
      values.push(filters.gender);
    }
    if (filters.season) {
      text += ` AND v.season = $${counter++}`;
      values.push(filters.season);
    }
    if (filters.fit) {
      text += ` AND v.fit = $${counter++}`;
      values.push(filters.fit);
    }
    if (filters.search) {
      text += ` AND (v.sku ILIKE $${counter} OR v.vendor_sku ILIKE $${counter})`;
      values.push(`%${filters.search}%`);
      counter++;
    }
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
    text += ` LIMIT $${counter++}`;
    values.push(filters.limit.toString());
  }
  if (filters?.offset !== undefined) {
    text += ` OFFSET $${counter++}`;
    values.push(filters.offset.toString());
  }

  return { text, values };
};
