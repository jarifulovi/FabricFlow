import { CreateReceivingSlipInput } from '../../types/receiving-slip';

export const insertReceivingSlipSQL = `
INSERT INTO receiving_slips
  (slip_number, type, status, date, warehouse_id, created_by, notes)
VALUES
  ($1, $2, $3, $4, $5, $6, $7)
RETURNING *;
`;

export const buildInsertReceivingSlipQuery = (input: CreateReceivingSlipInput) => {
  const {
    slipNumber,
    type,
    date,
    warehouseId,
    createdBy = null,
    notes = null,
  } = input;

  return {
    text: insertReceivingSlipSQL,
    values: [
      slipNumber,
      type,
      'draft', // status defaults to 'draft'
      date,
      warehouseId,
      createdBy,
      notes,
    ],
  };
};
