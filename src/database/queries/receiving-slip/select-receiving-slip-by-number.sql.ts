export const selectReceivingSlipByNumberSQL = `
SELECT *
FROM receiving_slips
WHERE slip_number = $1;
`;

export const buildSelectReceivingSlipByNumberQuery = (slipNumber: string) => ({
  text: selectReceivingSlipByNumberSQL,
  values: [slipNumber],
});
