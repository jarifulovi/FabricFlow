import { InventoryMovementCountFilters } from '../../types/inventory-movement';

export const baseCountInventoryMovementsSQL = `
SELECT COUNT(*) as count
FROM inventory_movements
`;

export const buildCountInventoryMovementsQuery = (filters?: InventoryMovementCountFilters) => {
  let text = baseCountInventoryMovementsSQL;
  const values: string[] = [];
  let counter = 1;

  text += 'WHERE 1=1';

  if (filters) {
    if (filters.itemId) {
      text += ` AND item_id = $${counter}`;
      counter++;
      values.push(filters.itemId);
    }
    if (filters.warehouseId) {
      text += ` AND warehouse_id = $${counter}`;
      counter++;
      values.push(filters.warehouseId);
    }
    if (filters.movementType) {
      text += ` AND movement_type = $${counter}`;
      counter++;
      values.push(filters.movementType);
    }
    if (filters.itemType) {
      text += ` AND item_type = $${counter}`;
      counter++;
      values.push(filters.itemType);
    }
    if (filters.sourceType) {
      text += ` AND source_type = $${counter}`;
      counter++;
      values.push(filters.sourceType);
    }
    if (filters.sourceId) {
      text += ` AND source_id = $${counter}`;
      counter++;
      values.push(filters.sourceId);
    }
    if (filters.batchId) {
      text += ` AND batch_id = $${counter}`;
      counter++;
      values.push(filters.batchId);
    }
  }

  return { text, values };
};
