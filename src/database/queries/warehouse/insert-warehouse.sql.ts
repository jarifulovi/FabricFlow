import { CreateWarehouseInput } from '../../types/warehouse';

export const insertWarehouseSQL = `
INSERT INTO warehouses
  (name, location, is_active)
VALUES
  ($1, $2, $3)
RETURNING *;
`;

export const buildInsertWarehouseQuery = (input: CreateWarehouseInput) => {
  const { name, location = null } = input;

  return {
    text: insertWarehouseSQL,
    values: [name, location, true], // is_active defaults to true
  };
};
