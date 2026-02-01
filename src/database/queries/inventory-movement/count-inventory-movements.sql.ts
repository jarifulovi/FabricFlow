import { MovementType, MovementSource, ItemType } from '../../types/inventory-movement';

export const baseCountInventoryMovementsSQL = `
SELECT COUNT(*) as count
FROM inventory_movements
`;

export const buildCountInventoryMovementsQuery = (filters?: {
  itemId?: string;
  warehouseId?: string;
  movementType?: MovementType;
  itemType?: ItemType;
  sourceType?: MovementSource;
  sourceId?: string;
  batchId?: string;
}) => {
  let text = baseCountInventoryMovementsSQL;
  const values: string[] = [];
  let counter = 1;
  let whereAdded = false;

  if (filters) {
    if (filters.itemId) {
      text += ` WHERE item_id = $${counter++}`;
      values.push(filters.itemId);
      whereAdded = true;
    }
    if (filters.warehouseId) {
      text += whereAdded ? ' AND' : ' WHERE';
      text += ` warehouse_id = $${counter++}`;
      values.push(filters.warehouseId);
      whereAdded = true;
    }
    if (filters.movementType) {
      text += whereAdded ? ' AND' : ' WHERE';
      text += ` movement_type = $${counter++}`;
      values.push(filters.movementType);
      whereAdded = true;
    }
    if (filters.itemType) {
      text += whereAdded ? ' AND' : ' WHERE';
      text += ` item_type = $${counter++}`;
      values.push(filters.itemType);
      whereAdded = true;
    }
    if (filters.sourceType) {
      text += whereAdded ? ' AND' : ' WHERE';
      text += ` source_type = $${counter++}`;
      values.push(filters.sourceType);
      whereAdded = true;
    }
    if (filters.sourceId) {
      text += whereAdded ? ' AND' : ' WHERE';
      text += ` source_id = $${counter++}`;
      values.push(filters.sourceId);
      whereAdded = true;
    }
    if (filters.batchId) {
      text += whereAdded ? ' AND' : ' WHERE';
      text += ` batch_id = $${counter++}`;
      values.push(filters.batchId);
    }
  }

  return { text, values };
};
