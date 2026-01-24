export const selectProductByIdSQL = `
SELECT 
  p.*,
  c.name AS category_name
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.id = $1
  AND p.is_deleted = false;
`;

export const selectProductByIdIncludedDeletedSQL = `
SELECT 
  p.*,
  c.name AS category_name
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.id = $1;
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