import { receivingSlipRepo } from '../database/repositories/index';
import {
  createReceivingSlipTransaction,
  confirmReceivingSlipTransaction,
  CreateReceivingSlipWithLinesInput,
} from '../database/transactions/index';
import {
  UpdateReceivingSlipInput,
  ReceivingSlipRow,
} from '../database/types/receiving-slip';

export const receivingSlipService = {
  async create(input: CreateReceivingSlipWithLinesInput): Promise<ReceivingSlipRow> {
    // Business validation
    if (!input.slip.slipNumber || input.slip.slipNumber.trim().length === 0) {
      throw new Error('Slip number is required');
    }
    if (!input.lineItems || input.lineItems.length === 0) {
      throw new Error('At least one line item is required');
    }

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

  async findAll(filters?: {
    type?: 'purchase' | 'production';
    status?: 'draft' | 'confirmed' | 'cancelled';
    warehouseId?: string;
    sortBy?: 'slipNumber' | 'date' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
  }): Promise<ReceivingSlipRow[]> {
    const { page, pageSize, ...rest } = filters || {};
    const limit = pageSize;
    const offset = page && pageSize ? (page - 1) * pageSize : undefined;
    
    return await receivingSlipRepo.findAll({ ...rest, limit, offset });
  },

  async findAllDefault(): Promise<ReceivingSlipRow[]> {
    return await receivingSlipRepo.findAll({
      sortBy: 'date',
      sortOrder: 'desc',
    });
  },
};
