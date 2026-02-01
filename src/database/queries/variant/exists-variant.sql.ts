export const buildExistsVariantQuery = (filters?: {
  id?: string; // check if this id exists
  productId?: string;
  color?: string;
  size?: string;
  gender?: string;
  season?: string;
  fit?: string;
  search?: string;
}) => {
  let text = `SELECT EXISTS(SELECT 1 FROM product_variants v WHERE v.is_deleted = false`;
  const values: string[] = [];
  let counter = 1;

  if (filters) {
    if (filters.id) {
      text += ` AND v.id = $${counter++}`;
      values.push(filters.id);
    }
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

  text += ') as exists';

  return { text, values };
};
