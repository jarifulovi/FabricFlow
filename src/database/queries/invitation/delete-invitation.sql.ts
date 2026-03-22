export const bulkDeleteInvitationsSQL = `
DELETE FROM invitations
WHERE id = ANY($1::uuid[])
RETURNING *;
`;

export const buildBulkDeleteInvitationsQuery = (ids: string[]) => ({
  text: bulkDeleteInvitationsSQL,
  values: [ids],
});
