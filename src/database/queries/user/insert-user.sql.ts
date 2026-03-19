import { CreateUserInput } from '../../types/user';

export const insertUserSQL = `
INSERT INTO users
  (external_id, email, name, role_id, is_active)
VALUES
  ($1, $2, $3, $4, $5)
RETURNING *;
`;

export const buildInsertUserQuery = (input: CreateUserInput) => {
  const {
    externalId,
    email,
    name = null,
    roleId = null,
    isActive = true,
  } = input;

  return {
    text: insertUserSQL,
    values: [externalId, email, name, roleId, isActive],
  };
};
