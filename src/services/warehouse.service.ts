import { warehouseRepo } from '../database/repositories/index';
import {
  CreateWarehouseInput,
  UpdateWarehouseInput,
  WarehouseRow,
} from '../database/types/warehouse';

export const warehouseService = {
  async create(input: CreateWarehouseInput): Promise<WarehouseRow> {
    // Check if warehouse exists
    const existing = await warehouseRepo.exists({ search: input.name, includeDeleted: false });
    if (existing) {
      throw new Error('Warehouse with the same name already exists');
    }

    return await warehouseRepo.create(input);
  },

  async update(id: string, input: UpdateWarehouseInput): Promise<WarehouseRow> {
    const existing = await warehouseRepo.exists({ id, includeDeleted: false });
    if (!existing) {
      throw new Error('Warehouse not found');
    }

    return await warehouseRepo.update(id, input);
  },

  async findById(id: string): Promise<WarehouseRow> {
    const warehouse = await warehouseRepo.findById(id, false);
    if (!warehouse) {
      throw new Error('Warehouse not found');
    }
    return warehouse;
  },

  async findAll(filters?: {
    search?: string; // name or location
    isActive?: boolean;
    includeDeleted?: boolean;
    sortBy?: 'name' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
  }): Promise<WarehouseRow[]> {
    const { page, pageSize, includeDeleted = false, ...rest } = filters || {};
    const limit = pageSize;
    const offset = page && pageSize ? (page - 1) * pageSize : undefined;
    
    return await warehouseRepo.findAll({ ...rest, includeDeleted, limit, offset });
  },

  async findAllDefault(): Promise<WarehouseRow[]> {
    return await warehouseRepo.findAll({
      isActive: true,
      includeDeleted: false,
      sortBy: 'name',
      sortOrder: 'asc',
    });
  },

  // Restricted for now
  async softDelete(id: string): Promise<WarehouseRow> {
    const existing = await warehouseRepo.exists({ id, includeDeleted: false });
    if (!existing) {
      throw new Error('Warehouse not found');
    }
    // TODO: Check for existing slips+line items for all types of invoices
    // TODO: Wrapped in transactions
    return await warehouseRepo.softDelete(id);
  },
};
