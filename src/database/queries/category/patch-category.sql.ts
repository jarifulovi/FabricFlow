import { categoryColumnMapping, UpdateCategoryInput } from '../../types/category';

export const buildPatchCategoryQuery = (id: string, input: UpdateCategoryInput) => {
  const fields: string[] = [];
  const values: any[] = [];
  let counter = 1;

  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined && categoryColumnMapping[key]) {
      fields.push(`${categoryColumnMapping[key]} = $${counter}`);
      values.push(value);
      counter++;
    }
  }

  if (fields.length === 0) throw new Error('No fields provided for patch');

  fields.push(`updated_at = CURRENT_TIMESTAMP`);
  const text = `
    UPDATE categories
    SET ${fields.join(', ')}
    WHERE id = $${counter}
    RETURNING *;
  `;
  values.push(id);

  return { text, values };
};
