export const selectVariantBySkuSQL = `
SELECT 
  v.*,
  p.id AS product_id,
  p.sku AS product_sku,
  p.name AS product_name,
  p.description AS product_description,
  p.brand_name AS product_brand_name,
  p.brand_code AS product_brand_code,
  p.category_id AS product_category_id,
  p.status AS product_status,
  p.unit AS product_unit,
  p.is_deleted AS product_is_deleted,
  p.tags AS product_tags,
  c.name AS category_name
FROM product_variants v
INNER JOIN products p ON v.product_id = p.id
LEFT JOIN categories c ON p.category_id = c.id
WHERE v.sku = $1
  AND v.is_deleted = false;
`;

export const selectVariantBySkuIncludedDeletedSQL = `
SELECT 
  v.*,
  p.id AS product_id,
  p.sku AS product_sku,
  p.name AS product_name,
  p.description AS product_description,
  p.brand_name AS product_brand_name,
  p.brand_code AS product_brand_code,
  p.category_id AS product_category_id,
  p.status AS product_status,
  p.unit AS product_unit,
  p.is_deleted AS product_is_deleted,
  p.tags AS product_tags,
  c.name AS category_name
FROM product_variants v
INNER JOIN products p ON v.product_id = p.id
LEFT JOIN categories c ON p.category_id = c.id
WHERE v.sku = $1;
`;

export const buildSelectVariantBySkuQuery = (sku: string) => ({
  text: selectVariantBySkuSQL,
  values: [sku],
});

export const buildSelectVariantBySkuIncludedDeletedQuery = (sku: string) => ({
  text: selectVariantBySkuIncludedDeletedSQL,
  values: [sku],
});
