import { z } from 'zod/v4';
import { receivingSlipLineRowSchema } from './receiving-slip-line';

// Zod Schema - Single source of truth
export const slipTypeSchema = z.enum(['purchase', 'production']);
export const slipStatusSchema = z.enum(['draft', 'confirmed', 'cancelled']);

export const receivingSlipSchema = z.object({
  id: z.uuid({ message: 'Invalid slip ID' }),
  slipNumber: z.string({ message: 'Slip number is required' }).regex(/^USR\d+-\d+$/, 'Slip number must follow format USR[UserID]-[SlipNumber]'),
  type: slipTypeSchema,
  status: slipStatusSchema,
  date: z.date({ message: 'Invalid date' }),
  warehouseId: z.uuid({ message: 'Invalid warehouse ID' }),
  createdBy: z.uuid({ message: 'Invalid user ID' }).optional().nullable(),
  notes: z.string().max(1000, 'Notes are too long').optional().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createReceivingSlipSchema = receivingSlipSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
});

export const updateReceivingSlipSchema = z.object({
  notes: z.string().max(1000, 'Notes are too long').optional().nullable(),
  date: z.date({ message: 'Invalid date' }).optional(),
  createdBy: z.uuid({ message: 'Invalid user ID' }).optional().nullable(),
  status: slipStatusSchema.optional(),
});

// Slip-level fields allowed to be patched on a draft slip
// warehouseId is allowed since line items are fully recreated in the same transaction
export const updateDraftReceivingSlipSlipSchema = z.object({
  slipNumber: z.string({ message: 'Slip number is required' }).regex(/^USR\d+-\d+$/, 'Slip number must follow format USR[UserID]-[SlipNumber]').optional(),
  type: slipTypeSchema.optional(),
  date: z.date({ message: 'Invalid date' }).optional(),
  warehouseId: z.uuid({ message: 'Invalid warehouse ID' }).optional(),
  notes: z.string().max(1000, 'Notes are too long').optional().nullable(),
  createdBy: z.uuid({ message: 'Invalid user ID' }).optional().nullable(),
});

export const receivingSlipRowSchema = receivingSlipSchema.omit({
  createdAt: true,
  updatedAt: true,
  date: true,
}).extend({
  createdAt: z.string(),
  updatedAt: z.string(),
  date: z.string(),
});

// TypeScript types inferred from schemas
export type SlipType = z.infer<typeof slipTypeSchema>;
export type SlipStatus = z.infer<typeof slipStatusSchema>;
export type ReceivingSlip = z.infer<typeof receivingSlipSchema>;
export type CreateReceivingSlipInput = z.infer<typeof createReceivingSlipSchema>;
export type UpdateReceivingSlipInput = z.infer<typeof updateReceivingSlipSchema>;
export type UpdateDraftReceivingSlipSlipInput = z.infer<typeof updateDraftReceivingSlipSlipSchema>;
export type ReceivingSlipRow = z.infer<typeof receivingSlipRowSchema>;

// Receiving slip row with embedded line items (used when includeLines=true)
export const receivingSlipWithLinesRowSchema = receivingSlipRowSchema.extend({
  lineItems: z.array(receivingSlipLineRowSchema),
});
export type ReceivingSlipWithLinesRow = z.infer<typeof receivingSlipWithLinesRowSchema>;

// ===== DATABASE FILTER TYPES (Per Operation) =====
// Database-level filtering - reused by QB and Repo

// FindAll operation filters
export const receivingSlipFindAllFiltersSchema = z.object({
  type: slipTypeSchema.optional(),
  status: slipStatusSchema.optional(),
  warehouseId: z.uuid().optional(),
  createdBy: z.uuid().optional(),
  search: z.string().min(1).optional(),
  sortBy: z.enum(['slipNumber', 'date', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  limit: z.number().int().positive().optional(),
  offset: z.number().int().nonnegative().optional()
});

// Count operation filters
export const receivingSlipCountFiltersSchema = z.object({
  type: slipTypeSchema.optional(),
  status: slipStatusSchema.optional(),
  warehouseId: z.uuid().optional(),
  createdBy: z.uuid().optional()
});

// Exists operation filters
export const receivingSlipExistsFiltersSchema = z.object({
  id: z.uuid().optional(),
  slipNumber: z.string().min(1).optional(),
  type: slipTypeSchema.optional(),
  status: slipStatusSchema.optional(),
  warehouseId: z.uuid().optional(),
  createdBy: z.uuid().optional()
});

// Database filter types
export type ReceivingSlipFindAllFilters = z.infer<typeof receivingSlipFindAllFiltersSchema>;
export type ReceivingSlipCountFilters = z.infer<typeof receivingSlipCountFiltersSchema>;
export type ReceivingSlipExistsFilters = z.infer<typeof receivingSlipExistsFiltersSchema>;

// Column mapping for database queries
export const receivingSlipColumnMapping: Record<string, string> = {
  slipNumber: 'slip_number',
  type: 'type',
  status: 'status',
  date: 'date',
  warehouseId: 'warehouse_id',
  createdBy: 'created_by',
  notes: 'notes',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
};
