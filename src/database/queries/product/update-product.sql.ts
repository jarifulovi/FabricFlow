import { UpdateProductInput } from '../../types/product';

export const updateProductSQL = `
UPDATE products
SET sku = $1,
    name = $2,
    description = $3,
    brand_id = $4,
    category_id = $5,
    status = $6,
    unit = $7,
    tags = $8,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $9
RETURNING *;
`;

/**
 * Builds a parameterized query for full product update.
 */
export const buildUpdateProductQuery = (id: string, input: UpdateProductInput) => {
  const {
    sku,
    name,
    description = null,
    brandId = null,
    categoryId,
    status,
    unit,
    tags = null,
  } = input;

  return {
    text: updateProductSQL,
    values: [sku, name, description, brandId, categoryId, status, unit, tags, id],
  };
};
