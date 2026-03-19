import { z } from 'zod/v4';

// Zod Schema - Single source of truth
export const userSchema = z.object({
  id: z.uuid({ message: 'Invalid user ID' }),
  externalId: z.string().min(1, 'External ID is required').max(100, 'External ID is too long'),
  email: z.email({ message: 'Invalid email address' }).max(255, 'Email is too long'),
  name: z.string().max(100, 'Name is too long').optional().nullable(),
  roleId: z.uuid({ message: 'Invalid role ID' }).optional().nullable(),
  roleName: z.string().max(100, 'Role name is too long').optional().nullable(),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createUserSchema = userSchema.omit({
  id: true,
  roleName: true,
  createdAt: true,
  updatedAt: true,
});

export const updateUserSchema = createUserSchema.omit({
  externalId: true,
}).partial();

export const userRowSchema = userSchema.omit({
  createdAt: true,
  updatedAt: true,
}).extend({
  createdAt: z.string(),
  updatedAt: z.string(),
});

// TypeScript types inferred from schemas
export type User = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserRow = z.infer<typeof userRowSchema>;

// Column mapping for database queries
export const userColumnMapping: Record<string, string> = {
  email: 'email',
  name: 'name',
  roleId: 'role_id',
  roleName: 'role_name',
  isActive: 'is_active',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
};
