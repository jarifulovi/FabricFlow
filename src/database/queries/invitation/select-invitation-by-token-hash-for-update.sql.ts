export const selectInvitationByTokenHashForUpdateSQL = `
SELECT *
FROM invitations
WHERE token_hash = $1
  AND accepted_at IS NULL
  AND expires_at > CURRENT_TIMESTAMP
LIMIT 1
FOR UPDATE;
`;

export const buildSelectInvitationByTokenHashForUpdateQuery = (tokenHash: string) => ({
  text: selectInvitationByTokenHashForUpdateSQL,
  values: [tokenHash],
});