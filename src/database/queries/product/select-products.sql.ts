import { productColumnMapping } from "../../types/product";

export const baseSelectProductsSQL = `
SELECT 
  p.*,
  c.name AS category_name
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
`;

/**
 * Builds a query for selecting products with optional filters.
 */
export const buildSelectProductsQuery = (filters?: {
  categoryId?: string;  // UUID
  status?: 'active' | 'inactive' | 'discontinued';
  tag?: string; // search by single tag
  search?: string; // search by name or SKU
  includeDeleted?: boolean; // include soft-deleted products
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}) => {
  let text = baseSelectProductsSQL;
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
  }

  if (filters?.sortBy) {
    const sortColumn = productColumnMapping[filters.sortBy] || 'created_at';
    const sortOrder = filters.sortOrder === 'asc' ? 'ASC' : 'DESC';
    text += ` ORDER BY p.${sortColumn} ${sortOrder}`;
  } else {
    text += ` ORDER BY p.created_at DESC`; // default ordering
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
