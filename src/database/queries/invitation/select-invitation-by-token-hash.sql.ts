export const selectInvitationByTokenHashSQL = `
SELECT *
FROM invitations
WHERE token_hash = $1
  AND accepted_at IS NULL
  AND expires_at > CURRENT_TIMESTAMP
LIMIT 1;
`;

export const buildSelectInvitationByTokenHashQuery = (tokenHash: string) => ({
  text: selectInvitationByTokenHashSQL,
  values: [tokenHash],
});
