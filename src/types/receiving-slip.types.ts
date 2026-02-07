import { z } from 'zod/v4';
import { receivingSlipFindAllFiltersSchema, slipTypeSchema, slipStatusSchema } from '../database/types/receiving-slip';

// ===== API/CONTROLLER TYPES =====
// These types handle API-specific concerns (pagination, string validation, etc.)

// Params validation
export const receivingSlipParamsSchema = z.object({
  id: z.uuid('Invalid receiving slip ID')
});

export const receivingSlipSlipNumberParamsSchema = z.object({
  slipNumber: z.string().min(1, 'Slip number is required')
});

// API Query filters (derives from database filters but with API-specific transformations)
export const receivingSlipApiQuerySchema = receivingSlipFindAllFiltersSchema.omit({
  limit: true,
  offset: true
}).extend({
  page: z.string().regex(/^\d+$/, 'Page must be a number').transform(Number).optional(),
  pageSize: z.string().regex(/^\d+$/, 'Page size must be a number').transform(Number).optional(),
  warehouseId: z.uuid('Invalid warehouse ID').optional()
});

// API types
export type ReceivingSlipParams = z.infer<typeof receivingSlipParamsSchema>;
export type ReceivingSlipSlipNumberParams = z.infer<typeof receivingSlipSlipNumberParamsSchema>;
export type ReceivingSlipApiQuery = z.infer<typeof receivingSlipApiQuerySchema>;
