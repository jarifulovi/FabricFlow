import pool, { Pool, PoolClient } from './../connection';
import { mapRowToCamel, mapRowsToCamel } from './../utils/row-mapper.js';
import {
  buildInsertBrandQuery,
  buildPatchBrandQuery,
  buildDeleteBrandQuery,
  buildSelectBrandsQuery,
  buildSelectBrandByIdQuery,
  buildCountBrandsQuery,
  buildExistsBrandQuery,
} from './../queries/index';
import {
  BrandRow,
  CreateBrandInput,
  UpdateBrandInput,
  BrandFindAllFilters,
  BrandCountFilters,
  BrandExistsFilters,
} from './../types/brand';

export const brandRepo = {
  async create(input: CreateBrandInput, executor?: Pool | PoolClient): Promise<BrandRow> {
    const db = executor || pool;
    const { text, values } = buildInsertBrandQuery(input);
    const result = await db.query(text, values);
    return mapRowToCamel<BrandRow>({ ...result.rows[0], products_count: 0 });
  },

  async update(id: string, input: UpdateBrandInput, executor?: Pool | PoolClient): Promise<BrandRow> {
    const db = executor || pool;
    const { text, values } = buildPatchBrandQuery(id, input);
    const result = await db.query(text, values);
    const updated = result.rows[0];
    return mapRowToCamel<BrandRow>({ ...updated, products_count: 0 });
  },

  async findById(id: string, executor?: Pool | PoolClient): Promise<BrandRow | null> {
    const db = executor || pool;
    const { text, values } = buildSelectBrandByIdQuery(id);
    const result = await db.query(text, values);
    return result.rows[0] ? mapRowToCamel<BrandRow>(result.rows[0]) : null;
  },

  async findAll(filters?: BrandFindAllFilters, executor?: Pool | PoolClient): Promise<BrandRow[]> {
    const db = executor || pool;
    const { text, values } = buildSelectBrandsQuery(filters);
    const result = await db.query(text, values);
    return mapRowsToCamel<BrandRow>(result.rows);
  },

  async delete(id: string, executor?: Pool | PoolClient): Promise<BrandRow> {
    const db = executor || pool;
    const { text, values } = buildDeleteBrandQuery(id);
    const result = await db.query(text, values);
    return mapRowToCamel<BrandRow>({ ...result.rows[0], products_count: 0 });
  },

  async count(filters?: BrandCountFilters, executor?: Pool | PoolClient): Promise<number> {
    const db = executor || pool;
    const { text, values } = buildCountBrandsQuery(filters);
    const result = await db.query<{ count: string }>(text, values);
    return parseInt(result.rows[0].count, 10);
  },

  async exists(filters?: BrandExistsFilters, executor?: Pool | PoolClient): Promise<boolean> {
    const db = executor || pool;
    const { text, values } = buildExistsBrandQuery(filters);
    const result = await db.query<{ exists: boolean }>(text, values);
    return result.rows[0].exists;
  },
};
