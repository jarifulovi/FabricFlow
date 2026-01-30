import pool, { Pool, PoolClient } from './../connection';

import {
  buildInsertReceivingSlipLineQuery,
  buildBulkInsertReceivingSlipLineQuery,
  buildPatchReceivingSlipLineQuery,
  buildDeleteReceivingSlipLinesQuery,
  buildSelectReceivingSlipLinesQuery,
  buildSelectReceivingSlipLineByIdQuery,
} from './../queries/index';
import { 
  ReceivingSlipLineRow, 
  CreateReceivingSlipLineInput, 
  UpdateReceivingSlipLineInput 
} from './../types/receiving-slip-line';
import { dbValidator } from '../validators/base.validator';


export const receivingSlipLineRepo = {
  async create(input: CreateReceivingSlipLineInput, executor?: Pool | PoolClient): Promise<ReceivingSlipLineRow> {
    const db = executor || pool;
    if (!dbValidator.isValidUUID(input.slipId)) {
      throw new Error('Invalid slip ID');
    }
    if (typeof input.lineNumber !== 'number' || input.lineNumber < 1) {
      throw new Error('Line number must be a positive integer');
    }
    if (!dbValidator.isValidUUID(input.warehouseId, true)) {
      throw new Error('Invalid warehouse ID');
    }
    if (!dbValidator.isValidUUID(input.variantId)) {
      throw new Error('Invalid variant ID');
    }
    if (!dbValidator.isValidString(input.vendorSku, 500, true)) {
      throw new Error('Invalid vendor SKU');
    }
    if (typeof input.quantity !== 'number' || input.quantity <= 0) {
      throw new Error('Quantity must be a positive number');
    }
    if (!dbValidator.isValidString(input.notes, 500, true)) {
      throw new Error('Invalid notes');
    }
    const { text, values } = buildInsertReceivingSlipLineQuery(input);
    const result = await db.query<ReceivingSlipLineRow>(text, values);
    return result.rows[0];
  },

  async bulkCreate(inputs: CreateReceivingSlipLineInput[], executor?: Pool | PoolClient): Promise<ReceivingSlipLineRow[]> {
    const db = executor || pool;
    if (!Array.isArray(inputs) || inputs.length === 0) {
      throw new Error('At least one receiving slip line input is required');
    }

    // Validate all inputs
    inputs.forEach((input, index) => {
      if (!dbValidator.isValidUUID(input.slipId)) {
        throw new Error(`Invalid slip ID at index ${index}`);
      }
      if (typeof input.lineNumber !== 'number' || input.lineNumber < 1) {
        throw new Error(`Line number must be a positive integer at index ${index}`);
      }
      if (!dbValidator.isValidUUID(input.warehouseId, true)) {
        throw new Error(`Invalid warehouse ID at index ${index}`);
      }
      if (!dbValidator.isValidUUID(input.variantId)) {
        throw new Error(`Invalid variant ID at index ${index}`);
      }
      if (!dbValidator.isValidString(input.vendorSku, 500, true)) {
        throw new Error(`Invalid vendor SKU at index ${index}`);
      }
      if (typeof input.quantity !== 'number' || input.quantity <= 0) {
        throw new Error(`Quantity must be a positive number at index ${index}`);
      }
      if (!dbValidator.isValidString(input.notes, 500, true)) {
        throw new Error(`Invalid notes at index ${index}`);
      }
    });

    const { text, values } = buildBulkInsertReceivingSlipLineQuery(inputs);
    const result = await db.query<ReceivingSlipLineRow>(text, values);
    return result.rows;
  },

  // Update/patch is restricted for receiving slip lines, only for testing purposes
  async update(id: string, input: UpdateReceivingSlipLineInput, executor?: Pool | PoolClient): Promise<ReceivingSlipLineRow> {
    const db = executor || pool;
    if (!dbValidator.isValidUUID(id)) {
      throw new Error('Invalid receiving slip line ID');
    }
    if (!dbValidator.isValidUUID(input.slipId, true)) {
      throw new Error('Invalid slip ID');
    }
    if (input.lineNumber !== undefined && (typeof input.lineNumber !== 'number' || input.lineNumber < 1)) {
      throw new Error('Line number must be a positive integer');
    }
    if (!dbValidator.isValidUUID(input.warehouseId, true)) {
      throw new Error('Invalid warehouse ID');
    }
    if (!dbValidator.isValidUUID(input.variantId, true)) {
      throw new Error('Invalid variant ID');
    }
    if (!dbValidator.isValidString(input.vendorSku, 500, true)) {
      throw new Error('Invalid vendor SKU');
    }
    if (input.quantity !== undefined && (typeof input.quantity !== 'number' || input.quantity <= 0)) {
      throw new Error('Quantity must be a positive number');
    }
    if (!dbValidator.isValidString(input.notes, 500, true)) {
      throw new Error('Invalid notes');
    }
    const { text, values } = buildPatchReceivingSlipLineQuery(id, input);
    const result = await db.query<ReceivingSlipLineRow>(text, values);
    return result.rows[0];
  },

  async findById(id: string, executor?: Pool | PoolClient): Promise<ReceivingSlipLineRow | null> {
    const db = executor || pool;
    if (!dbValidator.isValidUUID(id)) {
      throw new Error('Invalid receiving slip line ID');
    }
    const { text, values } = buildSelectReceivingSlipLineByIdQuery(id);
    const result = await db.query<ReceivingSlipLineRow>(text, values);
    return result.rows[0] || null;
  },

  async findAll(filters?: {
    slipId?: string;
    warehouseId?: string;
    variantId?: string;
    sortBy?: 'createdAt';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }, executor?: Pool | PoolClient): Promise<ReceivingSlipLineRow[]> {
    const db = executor || pool;
    if (filters?.slipId && !dbValidator.isValidUUID(filters.slipId)) {
      throw new Error('Invalid slip ID');
    }
    if (filters?.warehouseId && !dbValidator.isValidUUID(filters.warehouseId)) {
      throw new Error('Invalid warehouse ID');
    }
    if (filters?.variantId && !dbValidator.isValidUUID(filters.variantId)) {
      throw new Error('Invalid variant ID');
    }
    const { text, values } = buildSelectReceivingSlipLinesQuery(filters);
    const result = await db.query<ReceivingSlipLineRow>(text, values);
    return result.rows;
  },

  // Delete is restricted for receiving slip lines, only for testing purposes
  async delete(id: string, executor?: Pool | PoolClient): Promise<ReceivingSlipLineRow> {
    const db = executor || pool;
    if (!dbValidator.isValidUUID(id)) {
      throw new Error('Invalid receiving slip line ID');
    }
    const { text, values } = buildDeleteReceivingSlipLinesQuery([id]);
    const result = await db.query<ReceivingSlipLineRow>(text, values);
    return result.rows[0];
  },
};
