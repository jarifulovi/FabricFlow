import { z } from 'zod/v4';

// Zod Schema - Single source of truth
export const categorySchema = z.object({
  id: z.uuid(),
  name: z.string().min(1).max(500),
  description: z.string().max(500).optional(),
  isDeleted: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().optional(),
});


export const createCategorySchema = categorySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  isDeleted: true,
});

export const updateCategorySchema = createCategorySchema.partial();

export const categoryRowSchema = categorySchema.omit({
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
}).extend({
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
});

// TypeScript types inferred from schemas
export type Category = z.infer<typeof categorySchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CategoryRow = z.infer<typeof categoryRowSchema>;

// Column mapping for database queries
export const categoryColumnMapping: Record<string, string> = {
  name: 'name',
  description: 'description',
  isDeleted: 'is_deleted',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
};
