// update receiving_slip to (confirmed) + get line_items + movement
import pool from './../connection';
import { receivingSlipRepo } from './../repositories/receiving-slip.repo';
import { receivingSlipLineRepo } from './../repositories/receiving-slip-line.repo';
import { inventoryMovementRepo } from './../repositories/inventory-movement.repo';
import {
  CreateInventoryMovementInput,
} from './../types/inventory-movement';



export const confirmReceivingSlipTransaction = async (
  slipId: string,
) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Retrieve the receiving slip
    const slip = await receivingSlipRepo.findById(slipId, client);
    if (!slip) {
      throw new Error('Receiving slip not found');
    }
    if (slip.status !== 'draft') {
      throw new Error('Only draft receiving slips can be confirmed');
    }

    // Retrieve line items
    const lineItems = await receivingSlipLineRepo.findAll({ slipId }, client);
    if (lineItems.length === 0) {
      throw new Error('No line items found for this receiving slip');
    }

    // Update receiving slip status to CONFIRMED
    await receivingSlipRepo.update(slipId, { status: 'confirmed' }, client);

    // Create inventory movements for all line items in bulk
    const movementInputs: CreateInventoryMovementInput[] = lineItems.map(lineItem => ({
      itemId: lineItem.variantId,
      warehouseId: lineItem.warehouseId || slip.warehouseId,
      quantity: lineItem.quantity,
      movementType: 'IN',
      itemType: 'product_variant',
      sourceType: slip.type === 'purchase' ? 'receiving_slip_purchase' : 'receiving_slip_production',
      sourceId: slipId,
      price: lineItem.price,
    }));
    await inventoryMovementRepo.bulkCreate(movementInputs, client);

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};