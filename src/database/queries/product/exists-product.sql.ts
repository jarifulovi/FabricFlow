import { ProductExistsFilters } from "../../types/product";



export const buildExistsProductQuery = (filters?: ProductExistsFilters) => {
  let text = `SELECT EXISTS(SELECT 1 FROM products p `;
  const values: (string | number)[] = [];
  let counter = 1;

  // Add WHERE clause for deleted status - defaults to false for safety
  if (filters?.includeDeleted === true) {
    text += 'WHERE 1=1'; // include all products
  } else {
    text += 'WHERE p.is_deleted = false'; // exclude deleted products by default
  }

  if (filters) {
    if (filters.id) {
      text += ` AND p.id = $${counter}`;
      counter++;
      values.push(filters.id);
    }
    if (filters.sku) {
      text += ` AND p.sku = $${counter}`;
      counter++;
      values.push(filters.sku);
    }
    if (filters.categoryId !== undefined) {
      text += ` AND p.category_id = $${counter}`;
      counter++;
      values.push(filters.categoryId);
    }
    if (filters.brandId !== undefined) {
      text += ` AND p.brand_id = $${counter}`;
      counter++;
      values.push(filters.brandId);
    }
    if (filters.status) {
      text += ` AND p.status = $${counter}`;
      counter++;
      values.push(filters.status);
    }
    if (filters.tag) {
      text += ` AND $${counter} = ANY(p.tags)`;
      counter++;
      values.push(filters.tag);
    }
    if (filters.search) {
      text += ` AND (p.name ILIKE $${counter} OR p.sku ILIKE $${counter})`;
      values.push(`%${filters.search}%`);
      counter++;
    }
    if (filters.excludeIds && filters.excludeIds.length > 0) {
      const placeholders = filters.excludeIds.map((_, index) => `$${counter + index}`).join(', ');
      text += ` AND p.id NOT IN (${placeholders})`;
      values.push(...filters.excludeIds);
      counter += filters.excludeIds.length;
    }
  }

  text += ') as exists';

  return { text, values };
};
