import { z } from 'zod/v4';
import { warehouseFindAllFiltersSchema } from '../database/types/warehouse';

// ===== API/CONTROLLER TYPES =====
// These types handle API-specific concerns (pagination, string validation, etc.)

// Params validation
export const warehouseParamsSchema = z.object({
  id: z.uuid('Invalid warehouse ID')
});

// API Query filters (derives from database filters but with API-specific transformations)
export const warehouseApiQuerySchema = warehouseFindAllFiltersSchema.omit({
  limit: true,
  offset: true,
  isActive: true,
  includeDeleted: true
}).extend({
  page: z.string().regex(/^\d+$/, 'Page must be a number').transform(Number).optional(),
  pageSize: z.string().regex(/^\d+$/, 'Page size must be a number').transform(Number).optional(),
  isActive: z.enum(['true', 'false']).transform(val => val === 'true').optional(),
  includeDeleted: z.enum(['true', 'false']).transform(val => val === 'true').optional()
});

// API types
export type WarehouseParams = z.infer<typeof warehouseParamsSchema>;
export type WarehouseApiQuery = z.infer<typeof warehouseApiQuerySchema>;
