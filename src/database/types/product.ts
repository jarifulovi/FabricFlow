import { z } from 'zod/v4';

// Zod Schema - Single source of truth
export const productStatusSchema = z.enum(['active', 'inactive', 'discontinued']);
export const productUnitSchema = z.enum(['piece', 'meter', 'yard', 'kilogram', 'roll', 'bundle']);

export const productSchema = z.object({
  id: z.uuid({ message: 'Invalid product ID' }),
  sku: z.string({ message: 'SKU is required' }).min(1, 'SKU cannot be empty').max(500, 'SKU is too long'),
  name: z.string({ message: 'Product name is required' }).min(1, 'Product name cannot be empty').max(500, 'Product name is too long'),
  description: z.string().max(500, 'Description is too long').optional().nullable(),
  brandName: z.string().max(500, 'Brand name is too long').optional().nullable(),
  brandCode: z.string().max(500, 'Brand code is too long').optional().nullable(),
  categoryId: z.uuid({ message: 'Invalid category ID' }),
  status: productStatusSchema,
  unit: productUnitSchema,
  isDeleted: z.boolean().default(false),
  tags: z.array(z.string()).optional().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().optional().nullable(),
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

// ===== DATABASE FILTER TYPES (Per Operation) =====
// Database-level filtering - reused by QB and Repo

// FindAll operation filters
export const productFindAllFiltersSchema = z.object({
  categoryId: z.uuid().optional(),
  search: z.string().min(1).optional(),
  status: productStatusSchema.optional(),
  tag: z.string().min(1).optional(),
  includeDeleted: z.boolean().optional(),
  excludeIds: z.array(z.uuid()).optional(),
  sortBy: z.enum(['name', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  limit: z.number().int().positive().optional(),
  offset: z.number().int().nonnegative().optional()
});

// Count operation filters
export const productCountFiltersSchema = z.object({
  categoryId: z.uuid().optional(),
  search: z.string().min(1).optional(),
  status: productStatusSchema.optional(),
  tag: z.string().min(1).optional(),
  includeDeleted: z.boolean().optional(),
  excludeIds: z.array(z.uuid()).optional()
});

// Exists operation filters
export const productExistsFiltersSchema = z.object({
  id: z.uuid().optional(),
  sku: z.string().min(1).optional(),
  categoryId: z.uuid().optional(),
  status: productStatusSchema.optional(),
  tag: z.string().min(1).optional(),
  search: z.string().min(1).optional(),
  includeDeleted: z.boolean().optional(),
  excludeIds: z.array(z.uuid()).optional()
});

// Database filter types
export type ProductFindAllFilters = z.infer<typeof productFindAllFiltersSchema>;
export type ProductCountFilters = z.infer<typeof productCountFiltersSchema>;
export type ProductExistsFilters = z.infer<typeof productExistsFiltersSchema>;

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

