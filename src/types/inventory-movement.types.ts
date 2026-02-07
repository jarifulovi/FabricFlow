import { z } from 'zod/v4';
import { inventoryMovementFindAllFiltersSchema, movementSourceSchema } from '../database/types/inventory-movement';

// ===== API/CONTROLLER TYPES =====
// These types handle API-specific concerns (pagination, string validation, etc.)

// Params validation
export const inventoryMovementParamsSchema = z.object({
  id: z.uuid('Invalid inventory movement ID')
});

export const inventoryMovementSourceParamsSchema = z.object({
  sourceType: movementSourceSchema,
  sourceId: z.uuid('Invalid source ID')
});

// API Query filters (derives from database filters but with API-specific transformations)
export const inventoryMovementApiQuerySchema = inventoryMovementFindAllFiltersSchema.omit({
  limit: true,
  offset: true
}).extend({
  page: z.string().regex(/^\d+$/, 'Page must be a number').transform(Number).optional(),
  pageSize: z.string().regex(/^\d+$/, 'Page size must be a number').transform(Number).optional(),
  itemId: z.uuid('Invalid item ID').optional(),
  warehouseId: z.uuid('Invalid warehouse ID').optional()
});

// API types
export type InventoryMovementParams = z.infer<typeof inventoryMovementParamsSchema>;
export type InventoryMovementSourceParams = z.infer<typeof inventoryMovementSourceParamsSchema>;
export type InventoryMovementApiQuery = z.infer<typeof inventoryMovementApiQuerySchema>;
