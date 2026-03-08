import { receivingSlipLineColumnMapping, UpdateReceivingSlipLineInput } from '../../types/receiving-slip-line';

export const buildPatchReceivingSlipLineQuery = (id: string, input: UpdateReceivingSlipLineInput) => {
  const fields: string[] = [];
  const values: any[] = [];
  let counter = 1;

  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined && receivingSlipLineColumnMapping[key]) {
      fields.push(`${receivingSlipLineColumnMapping[key]} = $${counter}`);
      values.push(value);
      counter++;
    }
  }


  fields.push(`updated_at = CURRENT_TIMESTAMP`);
  const text = `
    UPDATE receiving_slip_lines
    SET ${fields.join(', ')}
    WHERE id = $${counter}
    RETURNING *;
  `;
  values.push(id);

  return { text, values };
};
