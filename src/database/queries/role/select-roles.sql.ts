export const selectRolesSQL = `
SELECT
  r.*
FROM roles r
ORDER BY r.name ASC;
`;

export const buildSelectRolesQuery = () => ({
  text: selectRolesSQL,
  values: [],
});
