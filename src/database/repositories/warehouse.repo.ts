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

  async findById(id: string, includeDeleted: boolean = false, executor?: Pool | PoolClient): Promise<WarehouseRow | null> {
    const db = executor || pool;
    if (!dbValidator.isValidUUID(id)) {
      throw new Error('Invalid warehouse ID');
    }
    const { text, values } = includeDeleted 
      ? buildSelectWarehouseByIdIncludedDeletedQuery(id)
      : buildSelectWarehouseByIdQuery(id);
    const result = await db.query<WarehouseRow>(text, values);
    return result.rows[0] || null;
  },

  async findAll(filters?: WarehouseFindAllFilters, executor?: Pool | PoolClient): Promise<WarehouseRow[]> {
    const db = executor || pool;
    if (!dbValidator.isValidString(filters?.search, 500, true)) {
      throw new Error('Invalid search string');
    }
    if (!dbValidator.isValidEnum(filters?.sortBy, ['name', 'createdAt'], true)) {
      throw new Error('Invalid sortBy value');
    }
    if (!dbValidator.isValidEnum(filters?.sortOrder, ['asc', 'desc'], true)) {
      throw new Error('Invalid sortOrder value');
    }
    const { text, values } = buildSelectWarehousesQuery(filters);
    const result = await db.query<WarehouseRow>(text, values);
    return result.rows;
  },

  // Soft delete (recommended for production)
  async softDelete(id: string, executor?: Pool | PoolClient): Promise<WarehouseRow> {
    const db = executor || pool;
    if (!dbValidator.isValidUUID(id)) {
      throw new Error('Invalid warehouse ID');
    }
    const { text, values } = buildBulkSoftDeleteWarehousesQuery([id]);
    const result = await db.query<WarehouseRow>(text, values);
    return result.rows[0];
  },

  // Hard delete (only for testing purposes and batch clean-ups)
  async hardDelete(id: string, executor?: Pool | PoolClient): Promise<WarehouseRow> {
    const db = executor || pool;
    if (!dbValidator.isValidUUID(id)) {
      throw new Error('Invalid warehouse ID');
    }
    const { text, values } = buildBulkHardDeleteWarehousesQuery([id]);
    const result = await db.query<WarehouseRow>(text, values);
    return result.rows[0];
  },

  // Count warehouses with filters
  async count(filters?: WarehouseCountFilters, executor?: Pool | PoolClient): Promise<number> {
    const db = executor || pool;
    if (!dbValidator.isValidString(filters?.search, 500, true)) {
      throw new Error('Invalid search string');
    }
    const { text, values } = buildCountWarehousesQuery(filters);
    const result = await db.query<{ count: string }>(text, values);
    return parseInt(result.rows[0].count, 10);
  },

  // Check if warehouse exists with filters
  async exists(filters?: WarehouseExistsFilters, executor?: Pool | PoolClient): Promise<boolean> {
    const db = executor || pool;
    if (!dbValidator.isValidUUID(filters?.id, true)) {
      throw new Error('Invalid warehouse ID');
    }
    if (!dbValidator.isValidString(filters?.search, 500, true)) {
      throw new Error('Invalid search string');
    }
    const { text, values } = buildExistsWarehouseQuery(filters);
    const result = await db.query<{ exists: boolean }>(text, values);
    return result.rows[0].exists;
  },
};
