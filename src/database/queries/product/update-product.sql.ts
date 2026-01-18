import { UpdateProductInput } from '../../types/product';

export const updateProductSQL = `
UPDATE products
SET sku = $1,
    name = $2,
    description = $3,
    brand_name = $4,
    brand_code = $5,
    category_id = $6,
    status = $7,
    unit = $8,
    tags = $9,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $10
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
    brandName = null,
    brandCode = null,
    categoryId,
    status,
    unit,
    tags = null,
  } = input;

  return {
    text: updateProductSQL,
    values: [sku, name, description, brandName, brandCode, categoryId, status, unit, tags, id],
  };
};
