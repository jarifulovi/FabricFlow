export const deleteCategoriesSQL = `
DELETE FROM categories
WHERE id = ANY($1::uuid[])
RETURNING *;
`;

export const buildDeleteCategoriesQuery = (ids: string[]) => ({
  text: deleteCategoriesSQL,
  values: [ids],
});