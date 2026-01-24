export const bulkDeleteCategoriesSQL = `
DELETE FROM categories
WHERE id = ANY($1::uuid[])
RETURNING *;
`;

export const buildDeleteCategoriesQuery = (ids: string[]) => ({
  text: bulkDeleteCategoriesSQL,
  values: [ids],
});