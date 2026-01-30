import pool, { Pool, PoolClient } from './../connection';

import {
  buildInsertWarehouseQuery,
  buildPatchWarehouseQuery,
  buildDeleteWarehousesQuery,
  buildSelectWarehousesQuery,
  buildSelectWarehouseByIdQuery,
} from './../queries/index';
import { WarehouseRow, CreateWarehouseInput, UpdateWarehouseInput } from './../types/warehouse';
import { dbValidator } from '../validators/base.validator';


export const warehouseRepo = {
  async create(input: CreateWarehouseInput, executor?: Pool | PoolClient): Promise<WarehouseRow> {
    const db = executor || pool;
    if (!dbValidator.isValidString(input.name)) {
      throw new Error('Invalid warehouse name');
    }
    if (!dbValidator.isValidString(input.location, 500, true)) {
      throw new Error('Invalid warehouse location');
    }
    const { text, values } = buildInsertWarehouseQuery(input);
    const result = await db.query<WarehouseRow>(text, values);
    return result.rows[0];
  },

  async update(id: string, input: UpdateWarehouseInput, executor?: Pool | PoolClient): Promise<WarehouseRow> {
    const db = executor || pool;
    if (!dbValidator.isValidUUID(id)) {
      throw new Error('Invalid warehouse ID');
    }
    if (!dbValidator.isValidString(input.name, 500, true)) {
      throw new Error('Invalid warehouse name');
    }
    if (!dbValidator.isValidString(input.location, 500, true)) {
      throw new Error('Invalid warehouse location');
    }
    if (input.isActive !== undefined && !dbValidator.isBoolean(input.isActive)) {
      throw new Error('Invalid isActive value');
    }
    const { text, values } = buildPatchWarehouseQuery(id, input);
    const result = await db.query<WarehouseRow>(text, values);
    return result.rows[0];
  },

  async findById(id: string, executor?: Pool | PoolClient): Promise<WarehouseRow | null> {
    const db = executor || pool;
    if (!dbValidator.isValidUUID(id)) {
      throw new Error('Invalid warehouse ID');
    }
    const { text, values } = buildSelectWarehouseByIdQuery(id);
    const result = await db.query<WarehouseRow>(text, values);
    return result.rows[0] || null;
  },

  async findAll(filters?: {
    isActive?: boolean;
    search?: string;
    sortBy?: 'name' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }, executor?: Pool | PoolClient): Promise<WarehouseRow[]> {
    const db = executor || pool;
    const { text, values } = buildSelectWarehousesQuery(filters);
    const result = await db.query<WarehouseRow>(text, values);
    return result.rows;
  },

  // Delete is restricted for warehouses, only for testing purposes
  async delete(id: string, executor?: Pool | PoolClient): Promise<WarehouseRow> {
    const db = executor || pool;
    if (!dbValidator.isValidUUID(id)) {
      throw new Error('Invalid warehouse ID');
    }
    const { text, values } = buildDeleteWarehousesQuery([id]);
    const result = await db.query<WarehouseRow>(text, values);
    return result.rows[0];
  },
};
