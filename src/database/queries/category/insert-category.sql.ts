import { CreateCategoryInput } from '../../types/category';

export const insertCategorySQL = `
INSERT INTO categories
  (name, description)
VALUES
  ($1, $2)
RETURNING *;
`;

export const buildInsertCategoryQuery = (input: CreateCategoryInput) => {
  const { name, description = null } = input;

  return {
    text: insertCategorySQL,
    values: [name, description],
  };
};
