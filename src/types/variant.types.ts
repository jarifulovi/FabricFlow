import { z } from 'zod/v4';
import { variantFindAllFiltersSchema } from '../database/types/variant';

// ===== API/CONTROLLER TYPES =====
// These types handle API-specific concerns (pagination, string validation, etc.)

// Params validation
export const variantParamsSchema = z.object({
  id: z.uuid('Invalid variant ID')
});

export const variantSkuParamsSchema = z.object({
  sku: z.string().min(1, 'SKU is required')
});

// API Query filters (derives from database filters but with API-specific transformations)
export const variantApiQuerySchema = variantFindAllFiltersSchema.omit({
  limit: true,
  offset: true
}).extend({
  page: z.string().regex(/^[1-9]\d*$/, 'Page must be a positive number').transform(Number).optional(),
  pageSize: z.string().regex(/^[1-9]\d*$/, 'Page size must be a positive number').transform(Number).optional(),
  productId: z.uuid('Invalid product ID').optional(),
  includeDeleted: z.enum(['true', 'false']).transform(val => val === 'true').optional()
});

// API types
export type VariantParams = z.infer<typeof variantParamsSchema>;
export type VariantSkuParams = z.infer<typeof variantSkuParamsSchema>;
export type VariantApiQuery = z.infer<typeof variantApiQuerySchema>;
