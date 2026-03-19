import { CreateRoleInput } from '../../types/role';

export const insertRoleSQL = `
INSERT INTO roles
  (name, description, is_system)
VALUES
  ($1, $2, $3)
RETURNING *;
`;

export const buildInsertRoleQuery = (input: CreateRoleInput) => {
  const { name, description = null } = input;

  return {
    text: insertRoleSQL,
    values: [name, description, false],
  };
};
