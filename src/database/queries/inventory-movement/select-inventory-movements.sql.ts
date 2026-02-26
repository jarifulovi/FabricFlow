import { MovementType, MovementSource, ItemType } from '../../types/inventory-movement';

export const baseInventoryMovementsSQL = `
SELECT *
FROM inventory_movements
`;

export const buildSelectInventoryMovementsQuery = (filters?: {
  itemId?: string;
  warehouseId?: string;
  movementType?: MovementType;
  itemType?: ItemType;
  sourceType?: MovementSource;
  sourceId?: string;
  batchId?: string;
  sortBy?: 'createdAt';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}) => {
  let text = baseInventoryMovementsSQL;
  const values: string[] = [];
  let counter = 1;
  let whereAdded = false;

  if (filters) {
    if (filters.itemId) {
      text += ` WHERE item_id = $${counter}`;
      counter++;
      values.push(filters.itemId);
      whereAdded = true;
    }
    if (filters.warehouseId) {
      text += whereAdded ? ' AND' : ' WHERE';
      text += ` warehouse_id = $${counter}`;
      counter++;
      values.push(filters.warehouseId);
      whereAdded = true;
    }
    if (filters.movementType) {
      text += whereAdded ? ' AND' : ' WHERE';
      text += ` movement_type = $${counter}`;
      counter++;
      values.push(filters.movementType);
      whereAdded = true;
    }
    if (filters.itemType) {
      text += whereAdded ? ' AND' : ' WHERE';
      text += ` item_type = $${counter}`;
      counter++;
      values.push(filters.itemType);
      whereAdded = true;
    }
    if (filters.sourceType) {
      text += whereAdded ? ' AND' : ' WHERE';
      text += ` source_type = $${counter}`;
      counter++;
      values.push(filters.sourceType);
      whereAdded = true;
    }
    if (filters.sourceId) {
      text += whereAdded ? ' AND' : ' WHERE';
      text += ` source_id = $${counter}`;
      counter++;
      values.push(filters.sourceId);
      whereAdded = true;
    }
    if (filters.batchId) {
      text += whereAdded ? ' AND' : ' WHERE';
      text += ` batch_id = $${counter}`;
      counter++;
      values.push(filters.batchId);
    }
  }

  // Sorting
  if (filters?.sortBy) {
    const sortOrder = filters.sortOrder === 'asc' ? 'ASC' : 'DESC';
    text += ` ORDER BY created_at ${sortOrder}`;
  } else {
    text += ` ORDER BY created_at DESC`; // default ordering
  }

  // Pagination
  if (filters?.limit !== undefined) {
    text += ` LIMIT $${counter}`;
    counter++;
    values.push(filters.limit.toString());
  }
  if (filters?.offset !== undefined) {
    text += ` OFFSET $${counter}`;
    counter++;
    values.push(filters.offset.toString());
  }

  return { text, values };
};
