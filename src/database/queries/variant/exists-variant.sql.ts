export const buildExistsVariantQuery = (filters?: {
  id?: string; // check if this id exists
  sku?: string; // check if this sku exists
  productId?: string;
  color?: string;
  size?: string;
  gender?: string;
  season?: string;
  fit?: string;
  search?: string;
  includeDeleted?: boolean;
  excludeIds?: string[];
}) => {
  let text = `SELECT EXISTS(SELECT 1 FROM product_variants v `;
  const values: string[] = [];
  let counter = 1;

  // Add WHERE clause for deleted status - defaults to false for safety
  if (filters?.includeDeleted === true) {
    text += 'WHERE 1=1'; // include all variants
  } else {
    text += 'WHERE v.is_deleted = false'; // exclude deleted variants by default
  }

  if (filters?.id) {
    text += ` AND v.id = $${counter++}`;
    values.push(filters.id);
  }
  if (filters?.sku) {
    text += ` AND v.sku = $${counter++}`;
    values.push(filters.sku);
  }
  if (filters?.productId) {
    text += ` AND v.product_id = $${counter++}`;
    values.push(filters.productId);
  }
  if (filters?.color) {
    text += ` AND v.color = $${counter++}`;
    values.push(filters.color);
  }
  if (filters?.size) {
    text += ` AND v.size = $${counter++}`;
    values.push(filters.size);
  }
  if (filters?.gender) {
    text += ` AND v.gender = $${counter++}`;
    values.push(filters.gender);
  }
  if (filters?.season) {
    text += ` AND v.season = $${counter++}`;
    values.push(filters.season);
  }
  if (filters?.fit) {
    text += ` AND v.fit = $${counter++}`;
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

  text += ') as exists';

  return { text, values };
};
