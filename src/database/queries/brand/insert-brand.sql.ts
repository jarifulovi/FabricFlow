import { CreateBrandInput } from '../../types/brand';

export const insertBrandSQL = `
INSERT INTO brands
  (name, code, description, country, website)
VALUES
  ($1, $2, $3, $4, $5)
RETURNING *;
`;

export const buildInsertBrandQuery = (input: CreateBrandInput) => {
  const {
    name,
    code = null,
    description = null,
    country = null,
    website = null,
  } = input;

  return {
    text: insertBrandSQL,
    values: [name, code, description, country, website],
  };
};
