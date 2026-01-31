import { warehouseRepo } from '../database/repositories/index';
import {
  CreateWarehouseInput,
  UpdateWarehouseInput,
  WarehouseRow,
} from '../database/types/warehouse';

export const warehouseService = {
  async create(input: CreateWarehouseInput): Promise<WarehouseRow> {
    // Business validation
    if (!input.name || input.name.trim().length === 0) {
      throw new Error('Warehouse name is required');
    }

    return await warehouseRepo.create(input);
  },

  async update(id: string, input: UpdateWarehouseInput): Promise<WarehouseRow> {
    const existing = await warehouseRepo.findById(id);
    if (!existing) {
      throw new Error('Warehouse not found');
    }

    if (input.name !== undefined && input.name.trim().length === 0) {
      throw new Error('Warehouse name cannot be empty');
    }

    return await warehouseRepo.update(id, input);
  },

  async findById(id: string): Promise<WarehouseRow> {
    const warehouse = await warehouseRepo.findById(id);
    if (!warehouse) {
      throw new Error('Warehouse not found');
    }
    return warehouse;
  },

  async findAll(filters?: {
    isActive?: boolean;
    sortBy?: 'name' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
  }): Promise<WarehouseRow[]> {
    const { page, pageSize, ...rest } = filters || {};
    const limit = pageSize;
    const offset = page && pageSize ? (page - 1) * pageSize : undefined;
    
    return await warehouseRepo.findAll({ ...rest, limit, offset });
  },

  async findAllDefault(): Promise<WarehouseRow[]> {
    return await warehouseRepo.findAll({
      isActive: true,
      sortBy: 'name',
      sortOrder: 'asc',
    });
  },

  async delete(id: string): Promise<WarehouseRow> {
    const existing = await warehouseRepo.findById(id);
    if (!existing) {
      throw new Error('Warehouse not found');
    }

    return await warehouseRepo.delete(id);
  },
};
