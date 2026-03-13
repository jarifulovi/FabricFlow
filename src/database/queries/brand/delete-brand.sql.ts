export const deleteBrandSQL = `
DELETE FROM brands
WHERE id = $1
RETURNING *;
`;

export const buildDeleteBrandQuery = (id: string) => ({
  text: deleteBrandSQL,
  values: [id],
});
