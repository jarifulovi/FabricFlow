import { ProductCountFilters } from "../../types/product";

export const baseCountProductsSQL = `
SELECT COUNT(*) as count
FROM products p
`;

export const buildCountProductsQuery = (filters?: ProductCountFilters) => {
  let text = baseCountProductsSQL;
  const values: (string | number)[] = [];
  let counter = 1;

  // Add WHERE clause for deleted status - defaults to false for safety
  if (filters?.includeDeleted === true) {
    text += 'WHERE 1=1'; // include all products
  } else {
    text += 'WHERE p.is_deleted = false'; // exclude deleted products by default
  }

  if (filters) {
    if (filters.categoryId !== undefined) {
      text += ` AND p.category_id = $${counter++}`;
      values.push(filters.categoryId);
    }
    if (filters.status) {
      text += ` AND p.status = $${counter++}`;
      values.push(filters.status);
    }
    if (filters.tag) {
      text += ` AND $${counter++} = ANY(p.tags)`;
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

  return { text, values };
};
