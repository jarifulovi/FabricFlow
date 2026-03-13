import { brandColumnMapping, UpdateBrandInput } from '../../types/brand';

export const buildPatchBrandQuery = (id: string, input: UpdateBrandInput) => {
  const fields: string[] = [];
  const values: any[] = [];
  let counter = 1;

  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined && brandColumnMapping[key]) {
      fields.push(`${brandColumnMapping[key]} = $${counter}`);
      values.push(value);
      counter++;
    }
  }

  fields.push('updated_at = CURRENT_TIMESTAMP');
  const text = `
    UPDATE brands
    SET ${fields.join(', ')}
    WHERE id = $${counter}
    RETURNING *;
  `;
  values.push(id);

  return { text, values };
};
