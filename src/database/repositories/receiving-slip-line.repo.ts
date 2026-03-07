import pool, { Pool, PoolClient } from './../connection';
import { mapRowToCamel, mapRowsToCamel } from './../utils/row-mapper.js';

import {
  buildInsertReceivingSlipLineQuery,
  buildBulkInsertReceivingSlipLineQuery,
  buildPatchReceivingSlipLineQuery,
  buildDeleteReceivingSlipLinesQuery,
  buildSelectReceivingSlipLinesQuery,
  buildSelectReceivingSlipLineByIdQuery,
  buildCountReceivingSlipLinesQuery,
  buildExistsReceivingSlipLineQuery
} from './../queries/index';
import { 
  ReceivingSlipLineRow, 
  CreateReceivingSlipLineInput, 
  UpdateReceivingSlipLineInput,
  ReceivingSlipLineFindAllFilters,
  ReceivingSlipLineCountFilters,
  ReceivingSlipLineExistsFilters
} from './../types/receiving-slip-line';


export const receivingSlipLineRepo = {
  async create(input: CreateReceivingSlipLineInput, executor?: Pool | PoolClient): Promise<ReceivingSlipLineRow> {
    const db = executor || pool;
    const { text, values } = buildInsertReceivingSlipLineQuery(input);
    const result = await db.query(text, values);
    return mapRowToCamel<ReceivingSlipLineRow>(result.rows[0]);
  },

  async bulkCreate(inputs: CreateReceivingSlipLineInput[], executor?: Pool | PoolClient): Promise<ReceivingSlipLineRow[]> {
    const db = executor || pool;
    const { text, values } = buildBulkInsertReceivingSlipLineQuery(inputs);
    const result = await db.query(text, values);
    return mapRowsToCamel<ReceivingSlipLineRow>(result.rows);
  },

  async update(id: string, input: UpdateReceivingSlipLineInput, executor?: Pool | PoolClient): Promise<ReceivingSlipLineRow> {
    const db = executor || pool;
    const { text, values } = buildPatchReceivingSlipLineQuery(id, input);
    const result = await db.query(text, values);
    return mapRowToCamel<ReceivingSlipLineRow>(result.rows[0]);
  },

  async findById(id: string, executor?: Pool | PoolClient): Promise<ReceivingSlipLineRow | null> {
    const db = executor || pool;
    const { text, values } = buildSelectReceivingSlipLineByIdQuery(id);
    const result = await db.query(text, values);
    return result.rows[0] ? mapRowToCamel<ReceivingSlipLineRow>(result.rows[0]) : null;
  },

  async findAll(filters?: ReceivingSlipLineFindAllFilters, executor?: Pool | PoolClient): Promise<ReceivingSlipLineRow[]> {
    const db = executor || pool;
    const { text, values } = buildSelectReceivingSlipLinesQuery(filters);
    const result = await db.query(text, values);
    return mapRowsToCamel<ReceivingSlipLineRow>(result.rows);
  },

  async delete(id: string, executor?: Pool | PoolClient): Promise<ReceivingSlipLineRow> {
    const db = executor || pool;
    const { text, values } = buildDeleteReceivingSlipLinesQuery([id]);
    const result = await db.query(text, values);
    return mapRowToCamel<ReceivingSlipLineRow>(result.rows[0]);
  },

  async bulkDelete(ids: string[], executor?: Pool | PoolClient): Promise<ReceivingSlipLineRow[]> {
    const db = executor || pool;
    const { text, values } = buildDeleteReceivingSlipLinesQuery(ids);
    const result = await db.query(text, values);
    return mapRowsToCamel<ReceivingSlipLineRow>(result.rows);
  },

  async count(filters: ReceivingSlipLineCountFilters, executor?: Pool | PoolClient): Promise<number> {
    const db = executor || pool;
    const { text, values } = buildCountReceivingSlipLinesQuery(filters);
    const result = await db.query(text, values);
    return parseInt(result.rows[0].count, 10);
  },

  async exists(filters: ReceivingSlipLineExistsFilters, executor?: Pool | PoolClient): Promise<boolean> {
    const db = executor || pool;
    const { text, values } = buildExistsReceivingSlipLineQuery(filters);
    const result = await db.query(text, values);
    return result.rows[0].exists;
  },
};
