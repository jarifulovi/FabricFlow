export const bulkDeleteReceivingSlipsSQL = `
DELETE FROM receiving_slips
WHERE id = ANY($1::uuid[])
RETURNING *;
`;

export const buildDeleteReceivingSlipsQuery = (ids: string[]) => ({
  text: bulkDeleteReceivingSlipsSQL,
  values: [ids],
});
