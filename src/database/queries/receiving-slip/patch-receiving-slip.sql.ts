import { receivingSlipColumnMapping, UpdateReceivingSlipInput } from '../../types/receiving-slip';


export const buildPatchReceivingSlipQuery = (id: string, input: UpdateReceivingSlipInput) => {
  const fields: string[] = [];
  const values: any[] = [];
  let counter = 1;

  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined && receivingSlipColumnMapping[key]) {
      fields.push(`${receivingSlipColumnMapping[key]} = $${counter}`);
      values.push(value);
      counter++;
    }
  }

  if (fields.length === 0) throw new Error('No fields provided for patch');

  fields.push(`updated_at = CURRENT_TIMESTAMP`);
  const text = `
    UPDATE receiving_slips
    SET ${fields.join(', ')}
    WHERE id = $${counter}
    RETURNING *;
  `;
  values.push(id);

  return { text, values };
};
