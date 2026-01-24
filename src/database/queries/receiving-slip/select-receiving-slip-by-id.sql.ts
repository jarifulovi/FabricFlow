export const selectReceivingSlipByIdSQL = `
SELECT *
FROM receiving_slips
WHERE id = $1;
`;

export const buildSelectReceivingSlipByIdQuery = (id: string) => ({
  text: selectReceivingSlipByIdSQL,
  values: [id],
});
