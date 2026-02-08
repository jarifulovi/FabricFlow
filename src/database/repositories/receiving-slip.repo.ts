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
  SlipStatus,
  ReceivingSlipFindAllFilters
} from './../types/receiving-slip';


export const receivingSlipRepo = {
  async create(input: CreateReceivingSlipInput, executor?: Pool | PoolClient): Promise<ReceivingSlipRow> {
    const db = executor || pool;
    const { text, values } = buildInsertReceivingSlipQuery(input);
    const result = await db.query<ReceivingSlipRow>(text, values);
    return result.rows[0];
  },

  // Update is a patch is restricted for receiving slips except status, only for testing purposes
  async update(id: string, input: UpdateReceivingSlipInput, executor?: Pool | PoolClient): Promise<ReceivingSlipRow> {
    const db = executor || pool;
    const { text, values } = buildPatchReceivingSlipQuery(id, input);
    const result = await db.query<ReceivingSlipRow>(text, values);
    return result.rows[0];
  },

  async findById(id: string, executor?: Pool | PoolClient): Promise<ReceivingSlipRow | null> {
    const db = executor || pool;
    const { text, values } = buildSelectReceivingSlipByIdQuery(id);
    const result = await db.query<ReceivingSlipRow>(text, values);
    return result.rows[0] || null;
  },

  async findBySlipNumber(slipNumber: string, executor?: Pool | PoolClient): Promise<ReceivingSlipRow | null> {
    const db = executor || pool;
    const { text, values } = buildSelectReceivingSlipByNumberQuery(slipNumber);
    const result = await db.query<ReceivingSlipRow>(text, values);
    return result.rows[0] || null;
  },

  async findAll(filters?: ReceivingSlipFindAllFilters, executor?: Pool | PoolClient): Promise<ReceivingSlipRow[]> {
    const db = executor || pool;
    const { text, values } = buildSelectReceivingSlipsQuery(filters);
    const result = await db.query<ReceivingSlipRow>(text, values);
    return result.rows;
  },

  // Delete is restricted for receiving slips, only for testing purposes
  async delete(id: string, executor?: Pool | PoolClient): Promise<ReceivingSlipRow> {
    const db = executor || pool;
    const { text, values } = buildDeleteReceivingSlipsQuery([id]);
    const result = await db.query<ReceivingSlipRow>(text, values);
    return result.rows[0];
  },
};
