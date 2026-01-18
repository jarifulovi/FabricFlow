import { CreateProductInput } from '../../types/product';

export const insertProduct = `
INSERT INTO products
  (sku, name, description, brand_name, brand_code, category_id, status, unit, is_deleted, tags)
VALUES
  ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
RETURNING *;
`;


export const buildInsertProductQuery = (input: CreateProductInput) => {
  const {
    sku,
    name,
    description = null,
    brandName = null,
    brandCode = null,
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
      brandName,
      brandCode,
      categoryId,
      status,
      unit,
      false, // is_deleted defaults to false
      tags,
    ],
  };
};
