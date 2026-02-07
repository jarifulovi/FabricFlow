import { z } from 'zod/v4';

// Zod Schema - Single source of truth
export const movementTypeSchema = z.enum(['IN', 'OUT', 'ADJUSTMENT']);
export const itemTypeSchema = z.enum(['product_variant', 'raw_material']);
export const movementSourceSchema = z.enum([
  'receiving_slip_purchase',
  'receiving_slip_production',
  'purchase_order',
  'sale_order',
  'manual_adjustment',
]);

export const inventoryMovementSchema = z.object({
  id: z.uuid({ message: 'Invalid movement ID' }),
  itemId: z.uuid({ message: 'Invalid item ID' }),
  warehouseId: z.uuid({ message: 'Invalid warehouse ID' }),
  quantity: z.number({ message: 'Quantity must be a number' }),
  movementType: movementTypeSchema,
  itemType: itemTypeSchema,
  sourceType: movementSourceSchema,
  sourceId: z.uuid({ message: 'Invalid source ID' }),
  batchId: z.uuid({ message: 'Invalid batch ID' }).optional().nullable(),
  price: z.number({ message: 'Price must be a number' }).nonnegative('Price cannot be negative').optional().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createInventoryMovementSchema = inventoryMovementSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateInventoryMovementSchema = createInventoryMovementSchema.partial();

export const inventoryMovementRowSchema = inventoryMovementSchema.omit({
  createdAt: true,
  updatedAt: true,
}).extend({
  createdAt: z.string(),
  updatedAt: z.string(),
});

// TypeScript types inferred from schemas
export type MovementType = z.infer<typeof movementTypeSchema>;
export type ItemType = z.infer<typeof itemTypeSchema>;
export type MovementSource = z.infer<typeof movementSourceSchema>;
export type InventoryMovement = z.infer<typeof inventoryMovementSchema>;
export type CreateInventoryMovementInput = z.infer<typeof createInventoryMovementSchema>;
export type UpdateInventoryMovementInput = z.infer<typeof updateInventoryMovementSchema>;
export type InventoryMovementRow = z.infer<typeof inventoryMovementRowSchema>;

// ===== DATABASE FILTER TYPES (Per Operation) =====
// Database-level filtering - reused by QB and Repo

// FindAll operation filters
export const inventoryMovementFindAllFiltersSchema = z.object({
  itemId: z.uuid().optional(),
  warehouseId: z.uuid().optional(),
  movementType: movementTypeSchema.optional(),
  itemType: itemTypeSchema.optional(),
  sourceType: movementSourceSchema.optional(),
  sourceId: z.uuid().optional(),
  batchId: z.uuid().optional(),
  sortBy: z.enum(['createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  limit: z.number().int().positive().optional(),
  offset: z.number().int().nonnegative().optional()
});

// Count operation filters
export const inventoryMovementCountFiltersSchema = z.object({
  itemId: z.uuid().optional(),
  warehouseId: z.uuid().optional(),
  movementType: movementTypeSchema.optional(),
  itemType: itemTypeSchema.optional(),
  sourceType: movementSourceSchema.optional()
});

// Exists operation filters
export const inventoryMovementExistsFiltersSchema = z.object({
  id: z.uuid().optional(),
  itemId: z.uuid().optional(),
  warehouseId: z.uuid().optional()
});

// Database filter types
export type InventoryMovementFindAllFilters = z.infer<typeof inventoryMovementFindAllFiltersSchema>;
export type InventoryMovementCountFilters = z.infer<typeof inventoryMovementCountFiltersSchema>;
export type InventoryMovementExistsFilters = z.infer<typeof inventoryMovementExistsFiltersSchema>;

// Column mapping for database queries
export const inventoryMovementColumnMapping: Record<string, string> = {
  itemId: 'item_id',
  warehouseId: 'warehouse_id',
  quantity: 'quantity',
  movementType: 'movement_type',
  itemType: 'item_type',
  sourceType: 'source_type',
  sourceId: 'source_id',
  batchId: 'batch_id',
  price: 'price',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
};
