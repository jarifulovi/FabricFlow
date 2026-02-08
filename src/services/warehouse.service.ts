import { warehouseRepo } from '../database/repositories/index';
import {
  CreateWarehouseInput,
  UpdateWarehouseInput,
  WarehouseRow,
  WarehouseFindAllFilters,
} from '../database/types/warehouse';
import { WarehouseApiQuery } from '../types/warehouse.types';

export const warehouseService = {
  async create(input: CreateWarehouseInput): Promise<WarehouseRow> {
    // Check if warehouse exists using search (checks name and location)
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

  async findAll(filters?: WarehouseApiQuery): Promise<WarehouseRow[]> {
    const { page, pageSize, includeDeleted = false, ...rest } = filters || {};
    
    // Convert API params to database filters
    const dbFilters: WarehouseFindAllFilters = {
      ...rest,
      includeDeleted,
      limit: pageSize,
      offset: page && pageSize ? (page - 1) * pageSize : undefined
    };
    
    return await warehouseRepo.findAll(dbFilters);
  },

  async findAllDefault(): Promise<WarehouseRow[]> {
    const dbFilters: WarehouseFindAllFilters = {
      isActive: true,
      includeDeleted: false,
      sortBy: 'name',
      sortOrder: 'asc'
    };
    
    return await warehouseRepo.findAll(dbFilters);
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
