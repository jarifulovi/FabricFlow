import { inventoryMovementRepo } from '../database/repositories/index';
import {
  CreateInventoryMovementInput,
  InventoryMovementRow,
  MovementSource,
  MovementType,
  ItemType,
} from '../database/types/inventory-movement';

export const inventoryMovementService = {
  async create(input: CreateInventoryMovementInput): Promise<InventoryMovementRow> {
    // Business validation
    if (!input.itemId) {
      throw new Error('Item ID is required');
    }
    if (input.quantity <= 0) {
      throw new Error('Quantity must be greater than zero');
    }

    return await inventoryMovementRepo.create(input);
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

  async findAll(filters?: {
    itemId?: string;
    warehouseId?: string;
    movementType?: MovementType;
    itemType?: ItemType;
    sourceType?: MovementSource;
    sortBy?: 'createdAt';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
  }): Promise<InventoryMovementRow[]> {
    const { page, pageSize, ...rest } = filters || {};
    const limit = pageSize;
    const offset = page && pageSize ? (page - 1) * pageSize : undefined;
    
    return await inventoryMovementRepo.findAll({ ...rest, limit, offset });
  },

  async findAllDefault(): Promise<InventoryMovementRow[]> {
    return await inventoryMovementRepo.findAll({
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  },
};
