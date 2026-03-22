import { CreateInvitationInput } from '../../types/invitation';

export const insertInvitationSQL = `
INSERT INTO invitations
  (email, role_id, token_hash, expires_at, created_by)
VALUES
  ($1, $2, $3, $4, $5)
RETURNING *;
`;

export const buildInsertInvitationQuery = (input: CreateInvitationInput) => {
  const { email, roleId, tokenHash, expiresAt, createdBy = null } = input;

  return {
    text: insertInvitationSQL,
    values: [email, roleId, tokenHash, expiresAt, createdBy],
  };
};
