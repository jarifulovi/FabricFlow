import { CreateInventoryMovementInput } from '../../types/inventory-movement';

export const insertInventoryMovementSQL = `
INSERT INTO inventory_movements
  (item_id, warehouse_id, quantity, movement_type, item_type, source_type, source_id, batch_id, price)
VALUES
  ($1, $2, $3, $4, $5, $6, $7, $8, $9)
RETURNING *;
`;

export const buildInsertInventoryMovementQuery = (input: CreateInventoryMovementInput) => {
  const {
    itemId,
    warehouseId,
    quantity,
    movementType,
    itemType,
    sourceType,
    sourceId,
    batchId = null,
    price = null,
  } = input;

  return {
    text: insertInventoryMovementSQL,
    values: [itemId, warehouseId, quantity, movementType, itemType, sourceType, sourceId, batchId, price],
  };
};

// Bulk insert for creating multiple movements at once
export const buildBulkInsertInventoryMovementQuery = (inputs: CreateInventoryMovementInput[]) => {
  const values: any[] = [];
  const valuePlaceholders: string[] = [];
  let counter = 1;

  inputs.forEach((input) => {
    const {
      itemId,
      warehouseId,
      quantity,
      movementType,
      itemType,
      sourceType,
      sourceId,
      batchId = null,
      price = null,
    } = input;

    valuePlaceholders.push(
      `($${counter++}, $${counter++}, $${counter++}, $${counter++}, $${counter++}, $${counter++}, $${counter++}, $${counter++}, $${counter++})`
    );

    values.push(itemId, warehouseId, quantity, movementType, itemType, sourceType, sourceId, batchId, price);
  });

  const text = `
    INSERT INTO inventory_movements
      (item_id, warehouse_id, quantity, movement_type, item_type, source_type, source_id, batch_id, price)
    VALUES
      ${valuePlaceholders.join(',\n      ')}
    RETURNING *;
  `;

  return { text, values };
};
