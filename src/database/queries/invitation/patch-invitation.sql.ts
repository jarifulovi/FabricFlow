import { invitationColumnMapping, UpdateInvitationInput } from '../../types/invitation';

export const buildPatchInvitationQuery = (id: string, input: UpdateInvitationInput) => {
  const fields: string[] = [];
  const values: any[] = [];
  let counter = 1;

  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined && invitationColumnMapping[key]) {
      fields.push(`${invitationColumnMapping[key]} = $${counter}`);
      values.push(value);
      counter++;
    }
  }

  const text = `
    UPDATE invitations
    SET ${fields.join(', ')}
    WHERE id = $${counter}
    RETURNING *;
  `;
  values.push(id);

  return { text, values };
};
