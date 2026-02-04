import { z } from 'zod/v4';

// Zod Schema - Single source of truth
export const slipTypeSchema = z.enum(['purchase', 'production']);
export const slipStatusSchema = z.enum(['draft', 'confirmed', 'cancelled']);

export const receivingSlipSchema = z.object({
  id: z.uuid(),
  slipNumber: z.string().min(1),
  type: slipTypeSchema,
  status: slipStatusSchema,
  date: z.date(),
  warehouseId: z.uuid(),
  createdBy: z.uuid().optional(),
  notes: z.string().max(1000).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createReceivingSlipSchema = receivingSlipSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
});

export const updateReceivingSlipSchema = createReceivingSlipSchema.partial().extend({
  status: slipStatusSchema.optional(),
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
export type ReceivingSlipRow = z.infer<typeof receivingSlipRowSchema>;

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
