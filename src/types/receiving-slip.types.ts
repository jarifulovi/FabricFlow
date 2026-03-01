import { z } from 'zod/v4';
import { receivingSlipFindAllFiltersSchema, slipTypeSchema, slipStatusSchema } from '../database/types/receiving-slip';
import { createReceivingSlipLineSchema } from '../database/types/receiving-slip-line';

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

// Query param for fetching a single slip (by id or slip number)
export const receivingSlipGetQuerySchema = z.object({
  includeLines: z.string().transform(v => v === 'true').optional(),
});
export type ReceivingSlipGetQuery = z.infer<typeof receivingSlipGetQuerySchema>;

// Query params for the default listing endpoint (pagination only)
export const receivingSlipDefaultQuerySchema = z.object({
  page: z.string().regex(/^\d+$/, 'Page must be a number').transform(Number).optional(),
  pageSize: z.string().regex(/^\d+$/, 'Page size must be a number').transform(Number).optional(),
});
export type ReceivingSlipDefaultQuery = z.infer<typeof receivingSlipDefaultQuerySchema>;

// Combined update body schema - handles both confirmed (header-only) and draft (header + lines) updates
// The service enforces which fields are applicable per status
export const updateReceivingSlipBodySchema = z.object({
  // Shared fields (confirmed & draft)
  notes: z.string().max(1000, 'Notes are too long').optional().nullable(),
  date: z.coerce.date({ message: 'Invalid date' }).optional(),
  createdBy: z.uuid({ message: 'Invalid user ID' }).optional().nullable(),
  status: slipStatusSchema.optional(),
  // Draft-only fields (ignored for confirmed slips in service layer)
  slipNumber: z.string().regex(/^USR\d+-\d+$/, 'Slip number must follow format USR[UserID]-[SlipNumber]').optional(),
  type: slipTypeSchema.optional(),
  warehouseId: z.uuid({ message: 'Invalid warehouse ID' }).optional(),
  lineItems: z.array(createReceivingSlipLineSchema.omit({ slipId: true })).optional(),
});

export type UpdateReceivingSlipBody = z.infer<typeof updateReceivingSlipBodySchema>;
