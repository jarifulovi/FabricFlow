import pool from './../connection';

import {
  buildInsertInventoryMovementQuery,
  buildBulkInsertInventoryMovementQuery,
  buildDeleteInventoryMovementsQuery,
  buildSelectInventoryMovementByIdQuery,
  buildSelectInventoryMovementsQuery,
  buildSelectInventoryMovementsBySourceQuery,
} from './../queries/index';
import {
  InventoryMovementRow,
  CreateInventoryMovementInput,
  MovementType,
  MovementSource,
  ItemType,
} from './../types/inventory-movement';
import { dbValidator } from '../validators/base.validator';

export const inventoryMovementRepo = {
  async create(input: CreateInventoryMovementInput): Promise<InventoryMovementRow> {
    if (!dbValidator.isValidUUID(input.itemId)) {
      throw new Error('Invalid item ID');
    }
    if (!dbValidator.isValidUUID(input.warehouseId)) {
      throw new Error('Invalid warehouse ID');
    }
    if (typeof input.quantity !== 'number' || !isFinite(input.quantity)) {
      throw new Error('Invalid quantity');
    }
    if (!dbValidator.isValidEnum(input.movementType, ['IN', 'OUT', 'ADJUSTMENT'])) {
      throw new Error('Invalid movement type');
    }
    if (!dbValidator.isValidEnum(input.itemType, ['product_variant', 'raw_material'])) {
      throw new Error('Invalid item type');
    }
    if (!dbValidator.isValidEnum(input.sourceType, [
      'receiving_slip_purchase',
      'receiving_slip_production',
      'purchase_order',
      'sale_order',
      'manual_adjustment',
    ])) {
      throw new Error('Invalid source type');
    }
    if (!dbValidator.isValidUUID(input.sourceId)) {
      throw new Error('Invalid source ID');
    }
    if (!dbValidator.isValidOptionalUUID(input.batchId)) {
      throw new Error('Invalid batch ID');
    }

    const { text, values } = buildInsertInventoryMovementQuery(input);
    const result = await pool.query<InventoryMovementRow>(text, values);
    return result.rows[0];
  },

  async bulkCreate(inputs: CreateInventoryMovementInput[]): Promise<InventoryMovementRow[]> {
    // Validate all inputs
    inputs.forEach((input, index) => {
      if (!dbValidator.isValidUUID(input.itemId)) {
        throw new Error(`Invalid item ID at index ${index}`);
      }
      if (!dbValidator.isValidUUID(input.warehouseId)) {
        throw new Error(`Invalid warehouse ID at index ${index}`);
      }
      if (typeof input.quantity !== 'number' || !isFinite(input.quantity)) {
        throw new Error(`Invalid quantity at index ${index}`);
      }
      if (!dbValidator.isValidEnum(input.movementType, ['IN', 'OUT', 'ADJUSTMENT'])) {
        throw new Error(`Invalid movement type at index ${index}`);
      }
      if (!dbValidator.isValidEnum(input.itemType, ['product_variant', 'raw_material'])) {
        throw new Error(`Invalid item type at index ${index}`);
      }
      if (!dbValidator.isValidEnum(input.sourceType, [
        'receiving_slip_purchase',
        'receiving_slip_production',
        'purchase_order',
        'sale_order',
        'manual_adjustment',
      ])) {
        throw new Error(`Invalid source type at index ${index}`);
      }
      if (!dbValidator.isValidUUID(input.sourceId)) {
        throw new Error(`Invalid source ID at index ${index}`);
      }
      if (!dbValidator.isValidOptionalUUID(input.batchId)) {
        throw new Error(`Invalid batch ID at index ${index}`);
      }
    });

    const { text, values } = buildBulkInsertInventoryMovementQuery(inputs);
    const result = await pool.query<InventoryMovementRow>(text, values);
    return result.rows;
  },

  async findById(id: string): Promise<InventoryMovementRow | null> {
    if (!dbValidator.isValidUUID(id)) {
      throw new Error('Invalid inventory movement ID');
    }
    const { text, values } = buildSelectInventoryMovementByIdQuery(id);
    const result = await pool.query<InventoryMovementRow>(text, values);
    return result.rows[0] || null;
  },

  async findBySource(sourceType: MovementSource, sourceId: string): Promise<InventoryMovementRow[]> {
    if (!dbValidator.isValidEnum(sourceType, [
      'receiving_slip_purchase',
      'receiving_slip_production',
      'purchase_order',
      'sale_order',
      'manual_adjustment',
    ])) {
      throw new Error('Invalid source type');
    }
    if (!dbValidator.isValidUUID(sourceId)) {
      throw new Error('Invalid source ID');
    }
    const { text, values } = buildSelectInventoryMovementsBySourceQuery(sourceType, sourceId);
    const result = await pool.query<InventoryMovementRow>(text, values);
    return result.rows;
  },

  async findAll(filters?: {
    itemId?: string;
    warehouseId?: string;
    movementType?: MovementType;
    itemType?: ItemType;
    sourceType?: MovementSource;
    sourceId?: string;
    batchId?: string;
    sortBy?: 'createdAt';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }): Promise<InventoryMovementRow[]> {
    if (filters?.itemId && !dbValidator.isValidUUID(filters.itemId)) {
      throw new Error('Invalid item ID');
    }
    if (filters?.warehouseId && !dbValidator.isValidUUID(filters.warehouseId)) {
      throw new Error('Invalid warehouse ID');
    }
    if (filters?.sourceId && !dbValidator.isValidUUID(filters.sourceId)) {
      throw new Error('Invalid source ID');
    }
    if (filters?.batchId && !dbValidator.isValidUUID(filters.batchId)) {
      throw new Error('Invalid batch ID');
    }
    if (filters?.movementType && !dbValidator.isValidEnum(filters.movementType, ['IN', 'OUT', 'ADJUSTMENT'])) {
      throw new Error('Invalid movement type');
    }
    if (filters?.itemType && !dbValidator.isValidEnum(filters.itemType, ['product_variant', 'raw_material'])) {
      throw new Error('Invalid item type');
    }
    if (filters?.sourceType && !dbValidator.isValidEnum(filters.sourceType, [
      'receiving_slip_purchase',
      'receiving_slip_production',
      'purchase_order',
      'sale_order',
      'manual_adjustment',
    ])) {
      throw new Error('Invalid source type');
    }

    const { text, values } = buildSelectInventoryMovementsQuery(filters);
    const result = await pool.query<InventoryMovementRow>(text, values);
    return result.rows;
  },

  // Delete is restricted for inventory movements, only for testing purposes
  async delete(id: string): Promise<InventoryMovementRow> {
    if (!dbValidator.isValidUUID(id)) {
      throw new Error('Invalid inventory movement ID');
    }
    const { text, values } = buildDeleteInventoryMovementsQuery([id]);
    const result = await pool.query<InventoryMovementRow>(text, values);
    return result.rows[0];
  },
};
