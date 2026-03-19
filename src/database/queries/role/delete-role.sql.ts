export const bulkDeleteRolesSQL = `
DELETE FROM roles
WHERE id = ANY($1::uuid[])
RETURNING *;
`;

export const buildBulkDeleteRolesQuery = (ids: string[]) => ({
  text: bulkDeleteRolesSQL,
  values: [ids],
});
