import { roleColumnMapping, UpdateRoleInput } from '../../types/role';

export const buildPatchRoleQuery = (id: string, input: UpdateRoleInput) => {
  const fields: string[] = [];
  const values: any[] = [];
  let counter = 1;

  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined && roleColumnMapping[key]) {
      fields.push(`${roleColumnMapping[key]} = $${counter}`);
      values.push(value);
      counter++;
    }
  }

  fields.push('updated_at = CURRENT_TIMESTAMP');

  const text = `
    UPDATE roles
    SET ${fields.join(', ')}
    WHERE id = $${counter}
    RETURNING *;
  `;
  values.push(id);

  return { text, values };
};
