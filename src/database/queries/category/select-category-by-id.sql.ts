export const selectCategoryByIdSQL = `
SELECT *
FROM categories
WHERE id = $1
`;

export const buildSelectCategoryByIdQuery = (id: string) => ({
  text: selectCategoryByIdSQL + 'AND is_deleted = false',
  values: [id],
});

export const buildSelectCategoryByIdIncludedDeletedQuery = (id: string) => ({
  text: selectCategoryByIdSQL,
  values: [id],
});
