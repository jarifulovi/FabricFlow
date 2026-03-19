export const selectRoleByIdSQL = `
SELECT
  r.*
FROM roles r
WHERE r.id = $1
LIMIT 1;
`;

export const buildSelectRoleByIdQuery = (id: string) => ({
  text: selectRoleByIdSQL,
  values: [id],
});
