import { z } from 'zod/v4';
import { categoryFindAllFiltersSchema, categoryTypeSchema } from '../database/types/category';

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
  page: z.string().regex(/^[1-9]\d*$/, 'Page must be a positive number').transform(Number).optional(),
  pageSize: z.string().regex(/^[1-9]\d*$/, 'Page size must be a positive number').transform(Number).optional(),
  name: z.string().optional(), // API uses "name" for search
  type: categoryTypeSchema.optional(), // filter by category type
  includeDeleted: z.enum(['true', 'false']).transform(val => val === 'true').optional()
});

// API types
export type CategoryParams = z.infer<typeof categoryParamsSchema>;
export type CategoryApiQuery = z.infer<typeof categoryApiQuerySchema>;
