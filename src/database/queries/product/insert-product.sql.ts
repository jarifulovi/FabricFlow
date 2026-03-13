import { CreateProductInput } from '../../types/product';

export const insertProduct = `
INSERT INTO products
  (sku, name, description, brand_id, category_id, status, unit, is_deleted, tags)
VALUES
  ($1, $2, $3, $4, $5, $6, $7, $8, $9)
RETURNING *;
`;


export const buildInsertProductQuery = (input: CreateProductInput) => {
  const {
    sku,
    name,
    description = null,
    brandId = null,
    categoryId,
    status = 'active',
    unit,
    tags = null,
  } = input;

  return {
    text: insertProduct,
    values: [
      sku,
      name,
      description,
      brandId,
      categoryId,
      status,
      unit,
      false, // is_deleted defaults to false
      tags,
    ],
  };
};
