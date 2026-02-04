import { z } from 'zod/v4';

// Zod Schema - Single source of truth
export const productStatusSchema = z.enum(['active', 'inactive', 'discontinued']);
export const productUnitSchema = z.enum(['piece', 'meter', 'yard', 'kilogram', 'roll', 'bundle']);

export const productSchema = z.object({
  id: z.uuid(),
  sku: z.string().min(1).max(500),
  name: z.string().min(1).max(500),
  description: z.string().max(500).optional(),
  brandName: z.string().max(500).optional(),
  brandCode: z.string().max(500).optional(),
  categoryId: z.uuid(),
  status: productStatusSchema,
  unit: productUnitSchema,
  isDeleted: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().optional(),
});

export const createProductSchema = productSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  isDeleted: true,
});

export const updateProductSchema = createProductSchema.partial();

export const productRowSchema = productSchema.omit({
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
}).extend({
  categoryName: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
});

// TypeScript types inferred from schemas
export type ProductStatus = z.infer<typeof productStatusSchema>;
export type ProductUnit = z.infer<typeof productUnitSchema>;
export type Product = z.infer<typeof productSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductRow = z.infer<typeof productRowSchema>;

// Column mapping for database queries
export const productColumnMapping: Record<string, string> = {
  sku: 'sku',
  name: 'name',
  description: 'description',
  brandName: 'brand_name',
  brandCode: 'brand_code',
  categoryId: 'category_id',
  status: 'status',
  unit: 'unit',
  tags: 'tags',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
};

