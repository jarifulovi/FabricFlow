// Update header fields and/or replace all line items on a draft receiving slip in a single transaction
import pool from './../connection';
import { receivingSlipRepo } from './../repositories/receiving-slip.repo';
import { receivingSlipLineRepo } from './../repositories/receiving-slip-line.repo';
import { variantRepo } from './../repositories/variant.repo';
import {
  UpdateDraftReceivingSlipSlipInput,
  ReceivingSlipRow,
} from './../types/receiving-slip';
import { CreateReceivingSlipLineInput } from './../types/receiving-slip-line';
import { NotFoundError, BadRequestError } from '../../utils/errors';

export interface UpdateDraftReceivingSlipInput {
  slip?: UpdateDraftReceivingSlipSlipInput;
  lineItems?: Omit<CreateReceivingSlipLineInput, 'slipId'>[];
}

export const updateDraftReceivingSlipTransaction = async (
  id: string,
  input: UpdateDraftReceivingSlipInput,
): Promise<ReceivingSlipRow> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Fetch and verify the slip is still a draft
    const slip = await receivingSlipRepo.findById(id, client);
    if (!slip) {
      throw new NotFoundError('Receiving slip not found');
    }
    if (slip.status !== 'draft') {
      throw new BadRequestError('Only draft slips can be fully updated');
    }

    // Patch slip-level header fields if provided
    let updatedSlip: ReceivingSlipRow = slip;
    if (input.slip && Object.keys(input.slip).length > 0) {
      updatedSlip = await receivingSlipRepo.update(id, input.slip, client);
    }

    // Replace all line items if a new set is provided (delete-recreate approach)
    if (input.lineItems !== undefined) {
      // Validate: no variant from a discontinued product allowed
      if (input.lineItems.length > 0) {
        const variantIds = input.lineItems.map(li => li.variantId);
        const variants = await variantRepo.findAll({ ids: variantIds }, client);

        if (variants.length !== variantIds.length) {
          throw new NotFoundError('One or more variants were not found');
        }
        for (const variant of variants) {
          if (variant.productStatus === 'discontinued') {
            throw new BadRequestError('Cannot add variant of a discontinued product to a receiving slip');
          }
        }
      }

      // Delete all existing lines for this slip
      const existingLines = await receivingSlipLineRepo.findAll({ slipId: id }, client);
      if (existingLines.length > 0) {
        const lineIds = existingLines.map(l => l.id);
        await receivingSlipLineRepo.bulkDelete(lineIds, client);
      }

      // Recreate with the new line items
      if (input.lineItems.length > 0) {
        const lineItemsWithSlipId: CreateReceivingSlipLineInput[] = input.lineItems.map(li => ({
          ...li,
          slipId: id,
        }));
        await receivingSlipLineRepo.bulkCreate(lineItemsWithSlipId, client);
      }
    }

    await client.query('COMMIT');
    return updatedSlip;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};
