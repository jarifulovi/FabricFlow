export const consumeInvitationSQL = `
UPDATE invitations
SET accepted_at = CURRENT_TIMESTAMP
WHERE token_hash = $1
  AND email = $2
  AND accepted_at IS NULL
  AND expires_at > CURRENT_TIMESTAMP
RETURNING *;
`;

export const buildConsumeInvitationQuery = (tokenHash: string, oauthEmail: string) => ({
  text: consumeInvitationSQL,
  values: [tokenHash, oauthEmail],
});