import pool, { Pool, PoolClient } from './../connection';
import { mapRowToCamel, mapRowsToCamel } from './../utils/row-mapper.js';

import {
  buildInsertReceivingSlipQuery,
  buildPatchReceivingSlipQuery,
  buildDeleteReceivingSlipsQuery,
  buildSelectReceivingSlipsQuery,
  buildSelectReceivingSlipByIdQuery,
  buildSelectReceivingSlipByNumberQuery,
  buildCountReceivingSlipsQuery,
  buildExistsReceivingSlipQuery,
} from './../queries/index';
import { 
  ReceivingSlipRow, 
  CreateReceivingSlipInput, 
  UpdateReceivingSlipInput,
  ReceivingSlipFindAllFilters,
  ReceivingSlipCountFilters,
  ReceivingSlipExistsFilters,
} from './../types/receiving-slip';


export const receivingSlipRepo = {
  async create(input: CreateReceivingSlipInput, executor?: Pool | PoolClient): Promise<ReceivingSlipRow> {
    const db = executor || pool;
    const { text, values } = buildInsertReceivingSlipQuery(input);
    const result = await db.query(text, values);
    return mapRowToCamel<ReceivingSlipRow>(result.rows[0]);
  },

  async update(id: string, input: UpdateReceivingSlipInput, executor?: Pool | PoolClient): Promise<ReceivingSlipRow> {
    const db = executor || pool;
    const { text, values } = buildPatchReceivingSlipQuery(id, input);
    const result = await db.query(text, values);
    return mapRowToCamel<ReceivingSlipRow>(result.rows[0]);
  },

  async findById(id: string, executor?: Pool | PoolClient): Promise<ReceivingSlipRow | null> {
    const db = executor || pool;
    const { text, values } = buildSelectReceivingSlipByIdQuery(id);
    const result = await db.query(text, values);
    return result.rows[0] ? mapRowToCamel<ReceivingSlipRow>(result.rows[0]) : null;
  },

  async findBySlipNumber(slipNumber: string, executor?: Pool | PoolClient): Promise<ReceivingSlipRow | null> {
    const db = executor || pool;
    const { text, values } = buildSelectReceivingSlipByNumberQuery(slipNumber);
    const result = await db.query(text, values);
    return result.rows[0] ? mapRowToCamel<ReceivingSlipRow>(result.rows[0]) : null;
  },

  async findAll(filters?: ReceivingSlipFindAllFilters, executor?: Pool | PoolClient): Promise<ReceivingSlipRow[]> {
    const db = executor || pool;
    const { text, values } = buildSelectReceivingSlipsQuery(filters);
    const result = await db.query(text, values);
    return mapRowsToCamel<ReceivingSlipRow>(result.rows);
  },

  async delete(id: string, executor?: Pool | PoolClient): Promise<ReceivingSlipRow> {
    const db = executor || pool;
    const { text, values } = buildDeleteReceivingSlipsQuery([id]);
    const result = await db.query(text, values);
    return mapRowToCamel<ReceivingSlipRow>(result.rows[0]);
  },

  async count(filters?: ReceivingSlipCountFilters, executor?: Pool | PoolClient): Promise<number> {
    const db = executor || pool;
    const { text, values } = buildCountReceivingSlipsQuery(filters);
    const result = await db.query<{ count: string }>(text, values);
    return parseInt(result.rows[0].count, 10);
  },

  async exists(filters?: ReceivingSlipExistsFilters, executor?: Pool | PoolClient): Promise<boolean> {
    const db = executor || pool;
    const { text, values } = buildExistsReceivingSlipQuery(filters);
    const result = await db.query<{ exists: boolean }>(text, values);
    return result.rows[0].exists;
  },
};
