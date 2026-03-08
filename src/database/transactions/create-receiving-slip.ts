// Create receiving_slip + line_items in a single transaction
import pool from './../connection';
import { receivingSlipRepo } from './../repositories/receiving-slip.repo';
import { receivingSlipLineRepo } from './../repositories/receiving-slip-line.repo';
import { variantRepo } from './../repositories/variant.repo';
import {
  CreateReceivingSlipInput,
  ReceivingSlipRow,
} from './../types/receiving-slip';
import { CreateReceivingSlipLineInput,
} from './../types/receiving-slip-line';
import { NotFoundError, BadRequestError } from '../../utils/errors';

export interface CreateReceivingSlipWithLinesInput {
  slip: CreateReceivingSlipInput;
  lineItems: Omit<CreateReceivingSlipLineInput, 'slipId'>[];
}

export const createReceivingSlipTransaction = async (
  input: CreateReceivingSlipWithLinesInput,
): Promise<ReceivingSlipRow> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Validate line items
    if (!input.lineItems || input.lineItems.length === 0) {
      throw new BadRequestError('At least one line item is required');
    }

    // Check product status for each variant — draft cannot contain discontinued product variants
    const variantIds = input.lineItems.map(li => li.variantId);
    const variants = await variantRepo.findAll({ ids: variantIds }, client);

    if (variants.length !== variantIds.length) {
      throw new NotFoundError('One or more variants were not found');
    }
    for (const variant of variants) {
      if (variant.productStatus === 'discontinued') {
        throw new BadRequestError(`Cannot add variant of a discontinued product to a receiving slip`);
      }
    }

    // Create the receiving slip
    const createdSlip = await receivingSlipRepo.create(input.slip, client);

    // Prepare line items with the created slip ID
    const lineItemsWithSlipId: CreateReceivingSlipLineInput[] = input.lineItems.map(lineItem => ({
      ...lineItem,
      slipId: createdSlip.id,
    }));

    // Bulk create line items
    await receivingSlipLineRepo.bulkCreate(lineItemsWithSlipId, client);

    await client.query('COMMIT');
    return createdSlip;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};
