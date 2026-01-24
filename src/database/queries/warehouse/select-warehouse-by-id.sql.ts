export const selectWarehouseByIdSQL = `
SELECT *
FROM warehouses
WHERE id = $1;
`;

export const buildSelectWarehouseByIdQuery = (id: string) => ({
  text: selectWarehouseByIdSQL,
  values: [id],
});
