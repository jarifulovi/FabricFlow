import { z } from 'zod/v4';

// Zod Schema - Single source of truth
export const roleSchema = z.object({
  id: z.uuid({ message: 'Invalid role ID' }),
  name: z.string({ message: 'Role name is required' }).min(1, 'Role name cannot be empty').max(50, 'Role name is too long'),
  description: z.string().max(500, 'Description is too long').optional().nullable(),
  isSystem: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createRoleSchema = roleSchema.omit({
  id: true,
  isSystem: true,
  createdAt: true,
  updatedAt: true,
});

export const updateRoleSchema = createRoleSchema.partial();

export const roleRowSchema = roleSchema.omit({
  createdAt: true,
  updatedAt: true,
}).extend({
  createdAt: z.string(),
  updatedAt: z.string(),
});

// TypeScript types inferred from schemas
export type Role = z.infer<typeof roleSchema>;
export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
export type RoleRow = z.infer<typeof roleRowSchema>;

// Column mapping for database queries
export const roleColumnMapping: Record<string, string> = {
  name: 'name',
  description: 'description',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
};
