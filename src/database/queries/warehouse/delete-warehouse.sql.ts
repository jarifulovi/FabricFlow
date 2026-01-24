export const bulkDeleteWarehousesSQL = `
DELETE FROM warehouses
WHERE id = ANY($1::uuid[])
RETURNING *;
`;

export const buildDeleteWarehousesQuery = (ids: string[]) => ({
  text: bulkDeleteWarehousesSQL,
  values: [ids],
});
