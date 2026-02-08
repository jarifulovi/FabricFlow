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


export const receivingSlipLineRepo = {
  async create(input: CreateReceivingSlipLineInput, executor?: Pool | PoolClient): Promise<ReceivingSlipLineRow> {
    const db = executor || pool;
    const { text, values } = buildInsertReceivingSlipLineQuery(input);
    const result = await db.query<ReceivingSlipLineRow>(text, values);
    return result.rows[0];
  },

  async bulkCreate(inputs: CreateReceivingSlipLineInput[], executor?: Pool | PoolClient): Promise<ReceivingSlipLineRow[]> {
    const db = executor || pool;
    const { text, values } = buildBulkInsertReceivingSlipLineQuery(inputs);
    const result = await db.query<ReceivingSlipLineRow>(text, values);
    return result.rows;
  },

  // Update/patch is restricted for receiving slip lines, only for testing purposes
  async update(id: string, input: UpdateReceivingSlipLineInput, executor?: Pool | PoolClient): Promise<ReceivingSlipLineRow> {
    const db = executor || pool;
    const { text, values } = buildPatchReceivingSlipLineQuery(id, input);
    const result = await db.query<ReceivingSlipLineRow>(text, values);
    return result.rows[0];
  },

  async findById(id: string, executor?: Pool | PoolClient): Promise<ReceivingSlipLineRow | null> {
    const db = executor || pool;
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
    const { text, values } = buildSelectReceivingSlipLinesQuery(filters);
    const result = await db.query<ReceivingSlipLineRow>(text, values);
    return result.rows;
  },

  // Delete is restricted for receiving slip lines, only for testing purposes
  async delete(id: string, executor?: Pool | PoolClient): Promise<ReceivingSlipLineRow> {
    const db = executor || pool;
    const { text, values } = buildDeleteReceivingSlipLinesQuery([id]);
    const result = await db.query<ReceivingSlipLineRow>(text, values);
    return result.rows[0];
  },
};
