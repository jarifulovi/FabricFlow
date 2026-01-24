import { CreateProductVariantInput } from '../../types/variant';

export const insertProductVariantSQL = `
INSERT INTO product_variants
  (product_id, sku, vendor_sku, color, size, gender, season, fit, price, reorder_level, is_deleted)
VALUES
  ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
RETURNING *;
`;

export const buildInsertProductVariantQuery = (input: CreateProductVariantInput) => {
  const {
    productId,
    sku,
    vendorSku = null,
    color = null,
    size = null,
    gender = null,
    season = null,
    fit = null,
    price = null,
    reorderLevel = null,
  } = input;

  return {
    text: insertProductVariantSQL,
    values: [
      productId,
      sku,
      vendorSku,
      color,
      size,
      gender,
      season,
      fit,
      price,
      reorderLevel,
      false, // is_deleted defaults to false
    ],
  };
};
