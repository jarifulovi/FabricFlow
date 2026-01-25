export const selectInventoryMovementByIdSQL = `
SELECT *
FROM inventory_movements
WHERE id = $1;
`;

export const buildSelectInventoryMovementByIdQuery = (id: string) => ({
  text: selectInventoryMovementByIdSQL,
  values: [id],
});