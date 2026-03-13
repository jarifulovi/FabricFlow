// Bulk delete
export const bulkDeleteBrandsSQL = `
DELETE FROM brands
WHERE id = ANY($1::uuid[])
RETURNING *;
`;

export const buildBulkDeleteBrandsQuery = (ids: string[]) => ({
  text: bulkDeleteBrandsSQL,
  values: [ids],
});
