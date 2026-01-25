import pool from './../connection';

import {
  buildInsertReceivingSlipLineQuery,
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
  async create(input: CreateReceivingSlipLineInput): Promise<ReceivingSlipLineRow> {
    if (!dbValidator.isValidUUID(input.slipId)) {
      throw new Error('Invalid slip ID');
    }
    if (typeof input.lineNumber !== 'number' || input.lineNumber < 1) {
      throw new Error('Line number must be a positive integer');
    }
    if (!dbValidator.isValidOptionalUUID(input.warehouseId)) {
      throw new Error('Invalid warehouse ID');
    }
    if (!dbValidator.isValidUUID(input.variantId)) {
      throw new Error('Invalid variant ID');
    }
    if (!dbValidator.isValidOptionalString(input.vendorSku)) {
      throw new Error('Invalid vendor SKU');
    }
    if (typeof input.quantity !== 'number' || input.quantity <= 0) {
      throw new Error('Quantity must be a positive number');
    }
    if (!dbValidator.isValidOptionalString(input.notes)) {
      throw new Error('Invalid notes');
    }
    const { text, values } = buildInsertReceivingSlipLineQuery(input);
    const result = await pool.query<ReceivingSlipLineRow>(text, values);
    return result.rows[0];
  },

  // Update/patch is restricted for receiving slip lines, only for testing purposes
  async update(id: string, input: UpdateReceivingSlipLineInput): Promise<ReceivingSlipLineRow> {
    if (!dbValidator.isValidUUID(id)) {
      throw new Error('Invalid receiving slip line ID');
    }
    if (!dbValidator.isValidOptionalUUID(input.slipId)) {
      throw new Error('Invalid slip ID');
    }
    if (input.lineNumber !== undefined && (typeof input.lineNumber !== 'number' || input.lineNumber < 1)) {
      throw new Error('Line number must be a positive integer');
    }
    if (!dbValidator.isValidOptionalUUID(input.warehouseId)) {
      throw new Error('Invalid warehouse ID');
    }
    if (!dbValidator.isValidOptionalUUID(input.variantId)) {
      throw new Error('Invalid variant ID');
    }
    if (!dbValidator.isValidOptionalString(input.vendorSku)) {
      throw new Error('Invalid vendor SKU');
    }
    if (input.quantity !== undefined && (typeof input.quantity !== 'number' || input.quantity <= 0)) {
      throw new Error('Quantity must be a positive number');
    }
    if (!dbValidator.isValidOptionalString(input.notes)) {
      throw new Error('Invalid notes');
    }
    const { text, values } = buildPatchReceivingSlipLineQuery(id, input);
    const result = await pool.query<ReceivingSlipLineRow>(text, values);
    return result.rows[0];
  },

  async findById(id: string): Promise<ReceivingSlipLineRow | null> {
    if (!dbValidator.isValidUUID(id)) {
      throw new Error('Invalid receiving slip line ID');
    }
    const { text, values } = buildSelectReceivingSlipLineByIdQuery(id);
    const result = await pool.query<ReceivingSlipLineRow>(text, values);
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
  }): Promise<ReceivingSlipLineRow[]> {
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
    const result = await pool.query<ReceivingSlipLineRow>(text, values);
    return result.rows;
  },

  // Delete is restricted for receiving slip lines, only for testing purposes
  async delete(id: string): Promise<ReceivingSlipLineRow> {
    if (!dbValidator.isValidUUID(id)) {
      throw new Error('Invalid receiving slip line ID');
    }
    const { text, values } = buildDeleteReceivingSlipLinesQuery([id]);
    const result = await pool.query<ReceivingSlipLineRow>(text, values);
    return result.rows[0];
  },
};
