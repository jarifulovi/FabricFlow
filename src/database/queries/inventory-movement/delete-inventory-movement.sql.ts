export const bulkDeleteInventoryMovementsSQL = `
DELETE FROM inventory_movements
WHERE id = ANY($1::uuid[])
RETURNING *;
`;

export const buildDeleteInventoryMovementsQuery = (ids: string[]) => ({
  text: bulkDeleteInventoryMovementsSQL,
  values: [ids],
});
