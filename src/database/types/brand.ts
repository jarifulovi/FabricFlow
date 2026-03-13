import { z } from 'zod/v4';

// Zod Schema - Single source of truth
export const brandSchema = z.object({
  id: z.uuid({ message: 'Invalid brand ID' }),
  name: z.string({ message: 'Brand name is required' }).min(1, 'Brand name cannot be empty').max(100, 'Brand name is too long'),
  code: z.string().min(1, 'Brand code cannot be empty').max(50, 'Brand code is too long').optional().nullable(),
  description: z.string().max(500, 'Description is too long').optional().nullable(),
  country: z.string().max(100, 'Country is too long').optional().nullable(),
  website: z.string().max(255, 'Website is too long').optional().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createBrandSchema = brandSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateBrandSchema = createBrandSchema.partial();

export const brandRowSchema = brandSchema.omit({
  createdAt: true,
  updatedAt: true,
}).extend({
  productsCount: z.number().int().nonnegative(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// TypeScript types inferred from schemas
export type Brand = z.infer<typeof brandSchema>;
export type CreateBrandInput = z.infer<typeof createBrandSchema>;
export type UpdateBrandInput = z.infer<typeof updateBrandSchema>;
export type BrandRow = z.infer<typeof brandRowSchema>;

// ===== DATABASE FILTER TYPES (Per Operation) =====

// FindAll operation filters
export const brandFindAllFiltersSchema = z.object({
  search: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  excludeIds: z.array(z.uuid()).optional(),
  sortBy: z.enum(['name', 'createdAt', 'updatedAt', 'productsCount']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  limit: z.number().int().positive().optional(),
  offset: z.number().int().nonnegative().optional(),
});

// Count operation filters
export const brandCountFiltersSchema = z.object({
  search: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  excludeIds: z.array(z.uuid()).optional(),
});

// Exists operation filters
export const brandExistsFiltersSchema = z.object({
  id: z.uuid().optional(),
  name: z.string().max(100).optional(),
  code: z.string().max(50).optional(),
  search: z.string().max(100).optional(),
  excludeIds: z.array(z.uuid()).optional(),
});

// Database filter types
export type BrandFindAllFilters = z.infer<typeof brandFindAllFiltersSchema>;
export type BrandCountFilters = z.infer<typeof brandCountFiltersSchema>;
export type BrandExistsFilters = z.infer<typeof brandExistsFiltersSchema>;

// Column mapping for database queries
export const brandColumnMapping: Record<string, string> = {
  name: 'name',
  code: 'code',
  description: 'description',
  country: 'country',
  website: 'website',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  productsCount: 'products_count',
};
