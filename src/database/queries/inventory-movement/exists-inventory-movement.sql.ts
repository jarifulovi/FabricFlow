import { InventoryMovementExistsFilters } from '../../types/inventory-movement';

export const buildExistsInventoryMovementQuery = (filters?: InventoryMovementExistsFilters) => {
  let text = `SELECT EXISTS(SELECT 1 FROM inventory_movements WHERE 1=1`;
  const values: string[] = [];
  let counter = 1;

  if (filters) {
    if (filters.id) {
      text += ` AND id = $${counter}`;
      counter++;
      values.push(filters.id);
    }
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

  text += ') as exists';

  return { text, values };
};
