export const bulkDeleteReceivingSlipLinesSQL = `
DELETE FROM receiving_slip_lines
WHERE id = ANY($1::uuid[])
RETURNING *;
`;

export const buildDeleteReceivingSlipLinesQuery = (ids: string[]) => ({
  text: bulkDeleteReceivingSlipLinesSQL,
  values: [ids],
});
