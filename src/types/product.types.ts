import { z } from 'zod/v4';
import { productFindAllFiltersSchema, productStatusSchema } from '../database/types/product';

// ===== API/CONTROLLER TYPES =====
// These types handle API-specific concerns (pagination, string validation, etc.)

// Params validation
export const productParamsSchema = z.object({
  id: z.uuid('Invalid product ID')
});

export const productSkuParamsSchema = z.object({
  sku: z.string().min(1, 'SKU is required')
});

// API Query filters (derives from database filters but with API-specific transformations)
export const productApiQuerySchema = productFindAllFiltersSchema.omit({
  limit: true,
  offset: true
}).extend({
  page: z.string().regex(/^[1-9]\d*$/, 'Page must be a positive number').transform(Number).optional(),
  pageSize: z.string().regex(/^[1-9]\d*$/, 'Page size must be a positive number').transform(Number).optional(),
  includeDeleted: z.enum(['true', 'false']).transform(val => val === 'true').optional(),
  status: z.enum(['active', 'inactive', 'discontinued']).optional() // String from query
});

// API types
export type ProductParams = z.infer<typeof productParamsSchema>;
export type ProductSkuParams = z.infer<typeof productSkuParamsSchema>;
export type ProductApiQuery = z.infer<typeof productApiQuerySchema>;
