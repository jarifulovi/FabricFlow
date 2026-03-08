import { CreateProductVariantInput } from '../../types/variant';

export const insertProductVariantSQL = `
INSERT INTO product_variants
  (product_id, sku, vendor_sku, barcode, color, size, gender, season, fit, price, reorder_level, attributes, image_urls, is_deleted)
VALUES
  ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
RETURNING *;
`;

export const buildInsertProductVariantQuery = (input: CreateProductVariantInput) => {
  const {
    productId,
    sku,
    vendorSku = null,
    barcode = null,
    color = null,
    size = null,
    gender = null,
    season = null,
    fit = null,
    price,
    reorderLevel = null,
    attributes = null,
    imageUrls = null,
  } = input;

  return {
    text: insertProductVariantSQL,
    values: [
      productId,
      sku,
      vendorSku,
      barcode,
      color,
      size,
      gender,
      season,
      fit,
      price,
      reorderLevel,
      attributes ? JSON.stringify(attributes) : null,
      imageUrls,
      false, // is_deleted defaults to false
    ],
  };
};
