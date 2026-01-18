export const selectCategoryByIdSQL = `
SELECT *
FROM categories
WHERE id = $1;
`;

export const buildSelectCategoryByIdQuery = (id: string) => ({
  text: selectCategoryByIdSQL,
  values: [id],
});
