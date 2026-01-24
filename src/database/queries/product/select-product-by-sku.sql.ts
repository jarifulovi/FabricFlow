export const selectProductBySkuSQL = `
SELECT 
  p.*,
  c.name AS category_name
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.sku = $1
  AND p.is_deleted = false;
`;

export const selectProductBySkuIncludedDeletedSQL = `
SELECT 
  p.*,
  c.name AS category_name
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.sku = $1;
`;

/**
 * Builds the parameterized query to fetch a product by SKU.
 */
export const buildSelectProductBySkuQuery = (sku: string) => ({
  text: selectProductBySkuSQL,
  values: [sku],
});

/**
 * Builds the parameterized query to fetch a product by SKU, including deleted products.
 */
export const buildSelectProductBySkuIncludedDeletedQuery = (sku: string) => ({
  text: selectProductBySkuIncludedDeletedSQL,
  values: [sku],
});
