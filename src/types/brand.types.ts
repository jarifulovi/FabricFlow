import { z } from 'zod/v4';
import { brandFindAllFiltersSchema } from '../database/types/brand';

// Params validation
export const brandParamsSchema = z.object({
  id: z.uuid('Invalid brand ID'),
});

// API Query filters
export const brandApiQuerySchema = brandFindAllFiltersSchema.omit({
  limit: true,
  offset: true,
}).extend({
  page: z.string().regex(/^[1-9]\d*$/, 'Page must be a positive number').transform(Number).optional(),
  pageSize: z.string().regex(/^[1-9]\d*$/, 'Page size must be a positive number').transform(Number).optional(),
});

export type BrandParams = z.infer<typeof brandParamsSchema>;
export type BrandApiQuery = z.infer<typeof brandApiQuerySchema>;
