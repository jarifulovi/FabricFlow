import { z } from 'zod/v4';

// Zod Schema - Single source of truth
export const receivingSlipLineSchema = z.object({
  id: z.uuid({ message: 'Invalid line ID' }),
  slipId: z.uuid({ message: 'Invalid slip ID' }),
  lineNumber: z.number({ message: 'Line number must be a number' }).int('Line number must be an integer').positive('Line number must be positive'),
  warehouseId: z.uuid({ message: 'Invalid warehouse ID' }).optional().nullable(),
  variantId: z.uuid({ message: 'Invalid variant ID' }),
  vendorSku: z.string().max(500, 'Vendor SKU is too long').optional().nullable(),
  quantity: z.number({ message: 'Quantity must be a number' }).positive('Quantity must be positive'),
  price: z.number({ message: 'Price must be a number' }).nonnegative('Price cannot be negative').optional().nullable(),
  notes: z.string().max(1000, 'Notes are too long').optional().nullable(),
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
