import { UserRoleLookupInput } from '../../types/auth';


const selectActiveUserRoleByIdSQL = `
SELECT
  users.id AS user_id,
  users.external_id,
  users.email,
  roles.name AS role_name
FROM users
INNER JOIN roles ON roles.id = users.role_id
WHERE users.is_active = true
  AND users.id = $1
LIMIT 1
`;

const selectActiveUserRoleByExternalIdSQL = `
SELECT
  users.id AS user_id,
  users.external_id,
  users.email,
  roles.name AS role_name
FROM users
INNER JOIN roles ON roles.id = users.role_id
WHERE users.is_active = true
  AND users.external_id = $1
LIMIT 1
`;

const selectActiveUserRoleByEmailSQL = `
SELECT
  users.id AS user_id,
  users.external_id,
  users.email,
  roles.name AS role_name
FROM users
INNER JOIN roles ON roles.id = users.role_id
WHERE users.is_active = true
  AND users.email = $1
LIMIT 1
`;

export const buildSelectActiveUserRoleQuery = (input: UserRoleLookupInput) => {
  if (input.userId) {
    return {
      text: selectActiveUserRoleByIdSQL,
      values: [input.userId],
    };
  }

  if (input.externalId) {
    return {
      text: selectActiveUserRoleByExternalIdSQL,
      values: [input.externalId],
    };
  }

  if (input.email) {
    return {
      text: selectActiveUserRoleByEmailSQL,
      values: [input.email],
    };
  }

  return {
    text: '',
    values: [],
  };
};
