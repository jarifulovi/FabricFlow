import { userColumnMapping, UpdateUserInput } from '../../types/user';

export const buildPatchUserQuery = (id: string, input: UpdateUserInput) => {
  const fields: string[] = [];
  const values: any[] = [];
  let counter = 1;

  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined && userColumnMapping[key]) {
      fields.push(`${userColumnMapping[key]} = $${counter}`);
      values.push(value);
      counter++;
    }
  }

  fields.push('updated_at = CURRENT_TIMESTAMP');
  const text = `
    UPDATE users
    SET ${fields.join(', ')}
    WHERE id = $${counter}
    RETURNING *;
  `;
  values.push(id);

  return { text, values };
};
