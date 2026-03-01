import { inventoryMovementRepo } from '../database/repositories/index';
import {
  CreateInventoryMovementInput,
  InventoryMovementRow,
  MovementSource,
  InventoryMovementFindAllFilters,
} from '../database/types/inventory-movement';
import { InventoryMovementApiQuery } from '../types/inventory-movement.types';

export const inventoryMovementService = {
  async create(input: CreateInventoryMovementInput): Promise<InventoryMovementRow> {
    return await inventoryMovementRepo.create(input);
  },

  async createBulk(inputs: CreateInventoryMovementInput[]): Promise<InventoryMovementRow[]> {
    return await inventoryMovementRepo.bulkCreate(inputs);
  },

  async findById(id: string): Promise<InventoryMovementRow> {
    const movement = await inventoryMovementRepo.findById(id);
    if (!movement) {
      throw new Error('Inventory movement not found');
    }
    return movement;
  },

  async findBySource(sourceType: MovementSource, sourceId: string): Promise<InventoryMovementRow[]> {
    return await inventoryMovementRepo.findBySource(sourceType, sourceId);
  },

  async findAll(filters?: InventoryMovementApiQuery): Promise<InventoryMovementRow[]> {
    const { page, pageSize, ...rest } = filters || {};
    
    // Convert API params to database filters
    const dbFilters: InventoryMovementFindAllFilters = {
      ...rest,
      limit: pageSize,
      offset: page && pageSize ? (page - 1) * pageSize : undefined
    };
    
    return await inventoryMovementRepo.findAll(dbFilters);
  },

  async findAllDefault(): Promise<InventoryMovementRow[]> {
    const dbFilters: InventoryMovementFindAllFilters = {
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    
    return await inventoryMovementRepo.findAll(dbFilters);
  },

  // Restricted to test environment only
  async delete(id: string): Promise<InventoryMovementRow> {
    const movement = await inventoryMovementRepo.findById(id);
    if (!movement) {
      throw new Error('Inventory movement not found');
    }
    return await inventoryMovementRepo.delete(id);
  },
};
