export const selectUserByExternalIdSQL = `
SELECT
  u.*,
  r.name AS role_name
FROM users u
LEFT JOIN roles r ON r.id = u.role_id
WHERE u.external_id = $1
LIMIT 1;
`;

export const buildSelectUserByExternalIdQuery = (externalId: string) => ({
  text: selectUserByExternalIdSQL,
  values: [externalId],
});
