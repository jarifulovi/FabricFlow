import { receivingSlipRepo } from '../database/repositories/index';
import {
  createReceivingSlipTransaction,
  confirmReceivingSlipTransaction,
  CreateReceivingSlipWithLinesInput,
} from '../database/transactions/index';
import {
  UpdateReceivingSlipInput,
  ReceivingSlipRow,
  SlipStatus,
  SlipType,
  ReceivingSlipFindAllFilters,
} from '../database/types/receiving-slip';
import { ReceivingSlipApiQuery } from '../types/receiving-slip.types';

export const receivingSlipService = {
  async create(input: CreateReceivingSlipWithLinesInput): Promise<ReceivingSlipRow> {
    // Check if already exists


    return await createReceivingSlipTransaction(input);
  },

  async confirm(slipId: string): Promise<void> {
    // Transaction handles all validation and business logic
    await confirmReceivingSlipTransaction(slipId);
  },

  async update(id: string, input: UpdateReceivingSlipInput): Promise<ReceivingSlipRow> {
    const existing = await receivingSlipRepo.findById(id);
    if (!existing) {
      throw new Error('Receiving slip not found');
    }

    // Only allow updates on draft slips
    if (existing.status !== 'draft') {
      throw new Error('Only draft receiving slips can be updated');
    }

    // Status changes are handled by transactions, not direct updates
    if (input.status !== undefined) {
      throw new Error('Status cannot be updated directly. Use confirm or cancel operations');
    }

    return await receivingSlipRepo.update(id, input);
  },

  async findById(id: string): Promise<ReceivingSlipRow> {
    const slip = await receivingSlipRepo.findById(id);
    if (!slip) {
      throw new Error('Receiving slip not found');
    }
    return slip;
  },

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

  async findAllDefault(): Promise<ReceivingSlipRow[]> {
    const dbFilters: ReceivingSlipFindAllFilters = {
      sortBy: 'date',
      sortOrder: 'desc'
    };
    
    return await receivingSlipRepo.findAll(dbFilters);
  },
};
