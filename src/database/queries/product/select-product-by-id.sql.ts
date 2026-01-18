export const selectProductByIdSQL = `
SELECT *
FROM products
WHERE id = $1
  AND is_deleted = false;
`;

export const selectProductByIdIncludedDeletedSQL = `
SELECT *
FROM products
WHERE id = $1;
`;

/**
 * Builds the parameterized query to fetch a product by ID.
 */
export const buildSelectProductByIdQuery = (id: string) => ({
  text: selectProductByIdSQL,
  values: [id],
});

/**
 * Builds the parameterized query to fetch a product by ID, including deleted products.
 */
export const buildSelectProductByIdIncludedDeletedQuery = (id: string) => ({
  text: selectProductByIdIncludedDeletedSQL,
  values: [id],
});