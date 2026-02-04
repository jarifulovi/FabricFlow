export const selectWarehouseByIdSQL = `
SELECT *
FROM warehouses
WHERE id = $1
`;

export const buildSelectWarehouseByIdQuery = (id: string) => ({
  text: selectWarehouseByIdSQL + ' AND is_deleted = false',
  values: [id],
});

export const buildSelectWarehouseByIdIncludedDeletedQuery = (id: string) => ({
  text: selectWarehouseByIdSQL,
  values: [id],
});
