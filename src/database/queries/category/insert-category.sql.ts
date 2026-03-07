import { CreateCategoryInput } from '../../types/category';

export const insertCategorySQL = `
INSERT INTO categories
  (type, name, description)
VALUES
  ($1, $2, $3)
RETURNING *;
`;

export const buildInsertCategoryQuery = (input: CreateCategoryInput) => {
  const { type, name, description = null } = input;

  return {
    text: insertCategorySQL,
    values: [type, name, description],
  };
};
