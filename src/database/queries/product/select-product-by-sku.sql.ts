export const selectProductBySkuSQL = `
SELECT *
FROM products
WHERE sku = $1
  AND is_deleted = false;
`;

export const selectProductBySkuIncludedDeletedSQL = `
SELECT *
FROM products
WHERE sku = $1;
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
