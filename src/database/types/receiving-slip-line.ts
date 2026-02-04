import { z } from 'zod/v4';

// Zod Schema - Single source of truth
export const receivingSlipLineSchema = z.object({
  id: z.uuid(),
  slipId: z.uuid(),
  lineNumber: z.number().int().positive(),
  warehouseId: z.uuid().optional(),
  variantId: z.uuid(),
  vendorSku: z.string().max(500).optional(),
  quantity: z.number().positive(),
  price: z.number().nonnegative().optional(),
  notes: z.string().max(1000).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createReceivingSlipLineSchema = receivingSlipLineSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateReceivingSlipLineSchema = createReceivingSlipLineSchema.partial();

export const receivingSlipLineRowSchema = receivingSlipLineSchema.omit({
  createdAt: true,
  updatedAt: true,
}).extend({
  createdAt: z.string(),
  updatedAt: z.string(),
});

// TypeScript types inferred from schemas
export type ReceivingSlipLine = z.infer<typeof receivingSlipLineSchema>;
export type CreateReceivingSlipLineInput = z.infer<typeof createReceivingSlipLineSchema>;
export type UpdateReceivingSlipLineInput = z.infer<typeof updateReceivingSlipLineSchema>;
export type ReceivingSlipLineRow = z.infer<typeof receivingSlipLineRowSchema>;

// Column mapping for database queries
export const receivingSlipLineColumnMapping: Record<string, string> = {
  slipId: 'slip_id',
  lineNumber: 'line_number',
  warehouseId: 'warehouse_id',
  variantId: 'variant_id',
  vendorSku: 'vendor_sku',
  quantity: 'quantity',
  price: 'price',
  notes: 'notes',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
};
