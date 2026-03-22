export const selectInvitationByEmailSQL = `
SELECT *
FROM invitations
WHERE email = $1
  AND accepted_at IS NULL
  AND expires_at > CURRENT_TIMESTAMP
LIMIT 1;
`;

export const buildSelectInvitationByEmailQuery = (email: string) => ({
  text: selectInvitationByEmailSQL,
  values: [email],
});
