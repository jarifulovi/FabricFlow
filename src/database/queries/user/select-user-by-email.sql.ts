export const selectUserByEmailSQL = `
SELECT
  u.*,
  r.name AS role_name
FROM users u
LEFT JOIN roles r ON r.id = u.role_id
WHERE u.email = $1
LIMIT 1;
`;

export const buildSelectUserByEmailQuery = (email: string) => ({
  text: selectUserByEmailSQL,
  values: [email],
});
