import pool, { Pool, PoolClient } from './../connection';

import {
  buildInsertReceivingSlipQuery,
  buildPatchReceivingSlipQuery,
  buildDeleteReceivingSlipsQuery,
  buildSelectReceivingSlipsQuery,
  buildSelectReceivingSlipByIdQuery,
  buildSelectReceivingSlipByNumberQuery,
} from './../queries/index';
import { 
  ReceivingSlipRow, 
  CreateReceivingSlipInput, 
  UpdateReceivingSlipInput,
  SlipType,
  SlipStatus 
} from './../types/receiving-slip';
import { dbValidator } from '../validators/base.validator';


export const receivingSlipRepo = {
  async create(input: CreateReceivingSlipInput, executor?: Pool | PoolClient): Promise<ReceivingSlipRow> {
    const db = executor || pool;
    if (!dbValidator.isValidString(input.slipNumber)) {
      throw new Error('Invalid slip number');
    }
    if (!dbValidator.isValidUUID(input.warehouseId)) {
      throw new Error('Invalid warehouse ID');
    }
    if (input.createdBy !== undefined && !dbValidator.isValidUUID(input.createdBy)) {
      throw new Error('Invalid created by user ID');
    }
    if (!dbValidator.isValidOptionalString(input.notes)) {
      throw new Error('Invalid notes');
    }
    const { text, values } = buildInsertReceivingSlipQuery(input);
    const result = await db.query<ReceivingSlipRow>(text, values);
    return result.rows[0];
  },

  // Update is a patch is restricted for receiving slips except status, only for testing purposes
  async update(id: string, input: UpdateReceivingSlipInput, executor?: Pool | PoolClient): Promise<ReceivingSlipRow> {
    const db = executor || pool;
    if (!dbValidator.isValidUUID(id)) {
      throw new Error('Invalid receiving slip ID');
    }
    if (input.slipNumber !== undefined && !dbValidator.isValidString(input.slipNumber)) {
      throw new Error('Invalid slip number');
    }
    if (input.warehouseId !== undefined && !dbValidator.isValidUUID(input.warehouseId)) {
      throw new Error('Invalid warehouse ID');
    }
    if (input.createdBy !== undefined && !dbValidator.isValidUUID(input.createdBy)) {
      throw new Error('Invalid created by user ID');
    }
    if (!dbValidator.isValidOptionalString(input.notes)) {
      throw new Error('Invalid notes');
    }
    if (input.status !== undefined && !dbValidator.isValidEnum(input.status, ['draft', 'confirmed', 'cancelled'])) {
      throw new Error('Invalid status');
    }
    const { text, values } = buildPatchReceivingSlipQuery(id, input);
    const result = await db.query<ReceivingSlipRow>(text, values);
    return result.rows[0];
  },

  async findById(id: string, executor?: Pool | PoolClient): Promise<ReceivingSlipRow | null> {
    const db = executor || pool;
    if (!dbValidator.isValidUUID(id)) {
      throw new Error('Invalid receiving slip ID');
    }
    const { text, values } = buildSelectReceivingSlipByIdQuery(id);
    const result = await db.query<ReceivingSlipRow>(text, values);
    return result.rows[0] || null;
  },

  async findBySlipNumber(slipNumber: string, executor?: Pool | PoolClient): Promise<ReceivingSlipRow | null> {
    const db = executor || pool;
    if (!dbValidator.isValidString(slipNumber)) {
      throw new Error('Invalid slip number');
    }
    const { text, values } = buildSelectReceivingSlipByNumberQuery(slipNumber);
    const result = await db.query<ReceivingSlipRow>(text, values);
    return result.rows[0] || null;
  },

  async findAll(filters?: {
    type?: SlipType;
    status?: SlipStatus;
    warehouseId?: string;
    createdBy?: string;
    search?: string;
    sortBy?: 'slipNumber' | 'date' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }, executor?: Pool | PoolClient): Promise<ReceivingSlipRow[]> {
    const db = executor || pool;
    if (filters?.warehouseId && !dbValidator.isValidUUID(filters.warehouseId)) {
      throw new Error('Invalid warehouse ID');
    }
    if (filters?.createdBy && !dbValidator.isValidUUID(filters.createdBy)) {
      throw new Error('Invalid created by user ID');
    }
    const { text, values } = buildSelectReceivingSlipsQuery(filters);
    const result = await db.query<ReceivingSlipRow>(text, values);
    return result.rows;
  },

  // Delete is restricted for receiving slips, only for testing purposes
  async delete(id: string, executor?: Pool | PoolClient): Promise<ReceivingSlipRow> {
    const db = executor || pool;
    if (!dbValidator.isValidUUID(id)) {
      throw new Error('Invalid receiving slip ID');
    }
    const { text, values } = buildDeleteReceivingSlipsQuery([id]);
    const result = await db.query<ReceivingSlipRow>(text, values);
    return result.rows[0];
  },
};
