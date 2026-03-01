import pool, { Pool, PoolClient } from './../connection';

import {
  buildInsertWarehouseQuery,
  buildPatchWarehouseQuery,
  buildBulkSoftDeleteWarehousesQuery,
  buildBulkHardDeleteWarehousesQuery,
  buildSelectWarehousesQuery,
  buildSelectWarehouseByIdQuery,
  buildSelectWarehouseByIdIncludedDeletedQuery,
  buildCountWarehousesQuery,
  buildExistsWarehouseQuery,
} from './../queries/index';
import { WarehouseRow, CreateWarehouseInput, UpdateWarehouseInput, WarehouseFindAllFilters, WarehouseCountFilters, WarehouseExistsFilters } from './../types/warehouse';


export const warehouseRepo = {
  async create(input: CreateWarehouseInput, executor?: Pool | PoolClient): Promise<WarehouseRow> {
    const db = executor || pool;
    const { text, values } = buildInsertWarehouseQuery(input);
    const result = await db.query<WarehouseRow>(text, values);
    return result.rows[0];
  },

  async update(id: string, input: UpdateWarehouseInput, executor?: Pool | PoolClient): Promise<WarehouseRow> {
    const db = executor || pool;
    const { text, values } = buildPatchWarehouseQuery(id, input);
    const result = await db.query<WarehouseRow>(text, values);
    return result.rows[0];
  },

  async findById(id: string, includeDeleted: boolean = false, executor?: Pool | PoolClient): Promise<WarehouseRow | null> {
    const db = executor || pool;
    const { text, values } = includeDeleted 
      ? buildSelectWarehouseByIdIncludedDeletedQuery(id)
      : buildSelectWarehouseByIdQuery(id);
    const result = await db.query<WarehouseRow>(text, values);
    return result.rows[0] || null;
  },

  async findAll(filters?: WarehouseFindAllFilters, executor?: Pool | PoolClient): Promise<WarehouseRow[]> {
    const db = executor || pool;
    const { text, values } = buildSelectWarehousesQuery(filters);
    const result = await db.query<WarehouseRow>(text, values);
    return result.rows;
  },

  async softDelete(id: string, executor?: Pool | PoolClient): Promise<WarehouseRow> {
    const db = executor || pool;
    const { text, values } = buildBulkSoftDeleteWarehousesQuery([id]);
    const result = await db.query<WarehouseRow>(text, values);
    return result.rows[0];
  },

  async hardDelete(id: string, executor?: Pool | PoolClient): Promise<WarehouseRow> {
    const db = executor || pool;
    const { text, values } = buildBulkHardDeleteWarehousesQuery([id]);
    const result = await db.query<WarehouseRow>(text, values);
    return result.rows[0];
  },

  async count(filters?: WarehouseCountFilters, executor?: Pool | PoolClient): Promise<number> {
    const db = executor || pool;
    const { text, values } = buildCountWarehousesQuery(filters);
    const result = await db.query<{ count: string }>(text, values);
    return parseInt(result.rows[0].count, 10);
  },

  async exists(filters?: WarehouseExistsFilters, executor?: Pool | PoolClient): Promise<boolean> {
    const db = executor || pool;
    const { text, values } = buildExistsWarehouseQuery(filters);
    const result = await db.query<{ exists: boolean }>(text, values);
    return result.rows[0].exists;
  },
};
