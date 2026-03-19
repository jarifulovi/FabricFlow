export const bulkDeleteUsersSQL = `
DELETE FROM users
WHERE id = ANY($1::uuid[])
RETURNING *;
`;

export const buildBulkDeleteUsersQuery = (ids: string[]) => ({
  text: bulkDeleteUsersSQL,
  values: [ids],
});
