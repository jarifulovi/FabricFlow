export const selectReceivingSlipLineByIdSQL = `
SELECT *
FROM receiving_slip_lines
WHERE id = $1;
`;

export const buildSelectReceivingSlipLineByIdQuery = (id: string) => ({
  text: selectReceivingSlipLineByIdSQL,
  values: [id],
});
