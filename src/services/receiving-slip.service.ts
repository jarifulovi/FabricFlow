import { receivingSlipRepo } from '../database/repositories/index';
import {
  createReceivingSlipTransaction,
  confirmReceivingSlipTransaction,
  updateDraftReceivingSlipTransaction,
  CreateReceivingSlipWithLinesInput,
} from '../database/transactions/index';
import {
  ReceivingSlipRow,
  ReceivingSlipFindAllFilters,
} from '../database/types/receiving-slip';
import { ReceivingSlipApiQuery, UpdateReceivingSlipBody } from '../types/receiving-slip.types';

export const receivingSlipService = {
  async create(input: CreateReceivingSlipWithLinesInput): Promise<ReceivingSlipRow> {
    // Check if already exists
    const exists = await receivingSlipRepo.exists({ slipNumber: input.slip.slipNumber });
    if (exists) {
      throw new Error('Receiving slip with this slip number already exists');
    }
    return await createReceivingSlipTransaction(input);
  },

  async confirm(slipId: string): Promise<void> {
    // Transaction handles all validation and business logic
    await confirmReceivingSlipTransaction(slipId);
  },

  async cancel(slipId: string): Promise<void> {
    // TODO: Needs to implement cancel receiving slip feature
  },

  // Allows updating subtle fields (notes, date, createdBy) on confirmed slips.
  // For draft slips: allows full update of header fields (excl. warehouseId) + line item replacement (delete-recreate).
  // Status changes are blocked here, handled via confirm/cancel transactions.
  async update(id: string, input: UpdateReceivingSlipBody): Promise<ReceivingSlipRow> {
    const existing = await receivingSlipRepo.findById(id);
    if (!existing) {
      throw new Error('Receiving slip not found');
    }

    // Status changes are handled by transactions, not direct updates
    if (input.status !== undefined) {
      throw new Error('Status cannot be updated directly. Use confirm or cancel operations');
    }
    if (existing.status === 'cancelled') {
      throw new Error('Cannot update a cancelled receiving slip');
    }

    if (existing.status === 'confirmed') {
      // Only subtle header fields allowed on confirmed slips
      const { notes, date, createdBy } = input;
      return await receivingSlipRepo.update(id, { notes, date, createdBy });
    }

    if (existing.status === 'draft') {
      // Full update: all header fields (excl. status) + optional line item replacement
      const { notes, date, createdBy, slipNumber, type, warehouseId, lineItems } = input;
      return await updateDraftReceivingSlipTransaction(id, {
        slip: { notes, date, createdBy, slipNumber, type, warehouseId },
        lineItems,
      });
    }

    // Fallback (should not be reached given the exhaustive status checks above)
    throw new Error('Unexpected slip status');
  },

  // TODO: Needs to add a filter for retrieving with slips lines or without lines
  async findById(id: string): Promise<ReceivingSlipRow> {
    const slip = await receivingSlipRepo.findById(id);
    if (!slip) {
      throw new Error('Receiving slip not found');
    }
    return slip;
  },

  // TODO: Needs to add a filter for retrieving with slips lines or without lines
  async findBySlipNumber(slipNumber: string): Promise<ReceivingSlipRow> {
    const slip = await receivingSlipRepo.findBySlipNumber(slipNumber);
    if (!slip) {
      throw new Error('Receiving slip not found');
    }
    return slip;
  },

  async findAll(filters?: ReceivingSlipApiQuery): Promise<ReceivingSlipRow[]> {
    const { page, pageSize, ...rest } = filters || {};
    
    // Convert API params to database filters
    const dbFilters: ReceivingSlipFindAllFilters = {
      ...rest,
      limit: pageSize,
      offset: page && pageSize ? (page - 1) * pageSize : undefined
    };
    
    return await receivingSlipRepo.findAll(dbFilters);
  },

  // Needs pagination params in filter
  async findAllDefault(): Promise<ReceivingSlipRow[]> {
    const dbFilters: ReceivingSlipFindAllFilters = {
      sortBy: 'date',
      sortOrder: 'desc'
    };
    
    return await receivingSlipRepo.findAll(dbFilters);
  },
};
