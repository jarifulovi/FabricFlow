import pool from './../connection';

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
  async create(input: CreateWarehouseInput): Promise<WarehouseRow> {
    if (!dbValidator.isValidString(input.name)) {
      throw new Error('Invalid warehouse name');
    }
    if (!dbValidator.isValidOptionalString(input.location)) {
      throw new Error('Invalid warehouse location');
    }
    const { text, values } = buildInsertWarehouseQuery(input);
    const result = await pool.query<WarehouseRow>(text, values);
    return result.rows[0];
  },

  async update(id: string, input: UpdateWarehouseInput): Promise<WarehouseRow> {
    if (!dbValidator.isValidUUID(id)) {
      throw new Error('Invalid warehouse ID');
    }
    if (!dbValidator.isValidOptionalString(input.name)) {
      throw new Error('Invalid warehouse name');
    }
    if (!dbValidator.isValidOptionalString(input.location)) {
      throw new Error('Invalid warehouse location');
    }
    if (input.isActive !== undefined && !dbValidator.isBoolean(input.isActive)) {
      throw new Error('Invalid isActive value');
    }
    const { text, values } = buildPatchWarehouseQuery(id, input);
    const result = await pool.query<WarehouseRow>(text, values);
    return result.rows[0];
  },

  async findById(id: string): Promise<WarehouseRow | null> {
    if (!dbValidator.isValidUUID(id)) {
      throw new Error('Invalid warehouse ID');
    }
    const { text, values } = buildSelectWarehouseByIdQuery(id);
    const result = await pool.query<WarehouseRow>(text, values);
    return result.rows[0] || null;
  },

  async findAll(filters?: {
    isActive?: boolean;
    search?: string;
    sortBy?: 'name' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }): Promise<WarehouseRow[]> {
    const { text, values } = buildSelectWarehousesQuery(filters);
    const result = await pool.query<WarehouseRow>(text, values);
    return result.rows;
  },

  // Delete is restricted for warehouses, only for testing purposes
  async delete(id: string): Promise<WarehouseRow> {
    if (!dbValidator.isValidUUID(id)) {
      throw new Error('Invalid warehouse ID');
    }
    const { text, values } = buildDeleteWarehousesQuery([id]);
    const result = await pool.query<WarehouseRow>(text, values);
    return result.rows[0];
  },
};
