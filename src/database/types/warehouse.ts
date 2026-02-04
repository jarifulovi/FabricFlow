import { z } from 'zod/v4';

// Zod Schema - Single source of truth
export const warehouseSchema = z.object({
  id: z.uuid({ message: 'Invalid warehouse ID' }),
  name: z.string({ message: 'Warehouse name is required' }).min(1, 'Warehouse name cannot be empty').max(500, 'Warehouse name is too long'),
  location: z.string().max(500, 'Location is too long').optional().nullable(),
  isActive: z.boolean().default(true),
  isDeleted: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().optional().nullable(),
});

export const createWarehouseSchema = warehouseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  isActive: true,
  isDeleted: true,
  deletedAt: true,
});

export const updateWarehouseSchema = createWarehouseSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export const warehouseRowSchema = warehouseSchema.omit({
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
}).extend({
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
});

// TypeScript types inferred from schemas
export type Warehouse = z.infer<typeof warehouseSchema>;
export type CreateWarehouseInput = z.infer<typeof createWarehouseSchema>;
export type UpdateWarehouseInput = z.infer<typeof updateWarehouseSchema>;
export type WarehouseRow = z.infer<typeof warehouseRowSchema>;

// Column mapping for database queries
export const warehouseColumnMapping: Record<string, string> = {
  name: 'name',
  location: 'location',
  isActive: 'is_active',
  isDeleted: 'is_deleted',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
};
