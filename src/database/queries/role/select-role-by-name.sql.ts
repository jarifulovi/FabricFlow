export const selectRoleByNameSQL = `
SELECT
  r.*
FROM roles r
WHERE LOWER(r.name) = LOWER($1)
LIMIT 1;
`;

export const buildSelectRoleByNameQuery = (name: string) => ({
  text: selectRoleByNameSQL,
  values: [name],
});
