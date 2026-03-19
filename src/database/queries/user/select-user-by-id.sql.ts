export const selectUserByIdSQL = `
SELECT
  u.*,
  r.name AS role_name
FROM users u
LEFT JOIN roles r ON r.id = u.role_id
WHERE u.id = $1
LIMIT 1;
`;

export const buildSelectUserByIdQuery = (id: string) => ({
  text: selectUserByIdSQL,
  values: [id],
});
