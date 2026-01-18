import { productColumnMapping } from "../../types/product";

export const baseSelectProductsSQL = `
SELECT *
FROM products
WHERE is_deleted = false
`;

/**
 * Builds a query for selecting products with optional filters.
 */
export const buildSelectProductsQuery = (filters?: {
  categoryId?: string;  // UUID
  status?: 'active' | 'inactive' | 'discontinued';
  tag?: string; // search by single tag
  search?: string; // search by name or SKU
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}) => {
  let text = baseSelectProductsSQL;
  const values: (string | number)[] = [];
  let counter = 1;

  if (filters) {
    if (filters.categoryId !== undefined) {
      text += ` AND category_id = $${counter++}`;
      values.push(filters.categoryId);
    }
    if (filters.status) {
      text += ` AND status = $${counter++}`;
      values.push(filters.status);
    }
    if (filters.tag) {
      text += ` AND $${counter++} = ANY(tags)`;
      values.push(filters.tag);
    }
    if (filters.search) {
      text += ` AND (name ILIKE $${counter} OR sku ILIKE $${counter})`;
      values.push(`%${filters.search}%`);
      counter++;
    }
  }

  if (filters?.sortBy) {
    const sortColumn = productColumnMapping[filters.sortBy] || 'created_at';
    const sortOrder = filters.sortOrder === 'asc' ? 'ASC' : 'DESC';
    text += ` ORDER BY ${sortColumn} ${sortOrder}`;
  } else {
    text += ` ORDER BY created_at DESC`; // default ordering
  }

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
