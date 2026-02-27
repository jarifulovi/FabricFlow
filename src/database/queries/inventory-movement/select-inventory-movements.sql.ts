import { InventoryMovementFindAllFilters, inventoryMovementColumnMapping } from '../../types/inventory-movement';

export const baseInventoryMovementsSQL = `
SELECT *
FROM inventory_movements
`;

export const buildSelectInventoryMovementsQuery = (filters?: InventoryMovementFindAllFilters) => {
  let text = baseInventoryMovementsSQL;
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

  // Sorting
  if (filters?.sortBy) {
    const sortColumn = inventoryMovementColumnMapping[filters.sortBy] || 'created_at';
    const sortOrder = filters.sortOrder === 'asc' ? 'ASC' : 'DESC';
    text += ` ORDER BY ${sortColumn} ${sortOrder}`;
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
