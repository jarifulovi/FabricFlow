import { z } from 'zod/v4';
import { categoryFindAllFiltersSchema } from '../database/types/category';

// ===== API/CONTROLLER TYPES =====
// These types handle API-specific concerns (pagination, string validation, etc.)

// Params validation
export const categoryParamsSchema = z.object({
  id: z.uuid('Invalid category ID')
});

// API Query filters (derives from database filters but with API-specific transformations)
export const categoryApiQuerySchema = categoryFindAllFiltersSchema.omit({
  limit: true,
  offset: true,
  search: true
}).extend({
  page: z.string().regex(/^\d+$/, 'Page must be a number').transform(Number).optional(),
  pageSize: z.string().regex(/^\d+$/, 'Page size must be a number').transform(Number).optional(),
  name: z.string().min(1).optional(), // API uses "name" for search
  includeDeleted: z.enum(['true', 'false']).transform(val => val === 'true').optional()
});

// API types
export type CategoryParams = z.infer<typeof categoryParamsSchema>;
export type CategoryApiQuery = z.infer<typeof categoryApiQuerySchema>;
