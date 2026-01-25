import { MovementSource } from '../../types/inventory-movement';

export const selectInventoryMovementsBySourceSQL = `
SELECT *
FROM inventory_movements
WHERE source_type = $1 AND source_id = $2
ORDER BY created_at ASC;
`;

export const buildSelectInventoryMovementsBySourceQuery = (sourceType: MovementSource, sourceId: string) => ({
  text: selectInventoryMovementsBySourceSQL,
  values: [sourceType, sourceId],
});
