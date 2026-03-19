import { z } from 'zod/v4';
import { updateUserSchema } from '../database/types/user';

// API/Controller params
export const userParamsSchema = z.object({
  id: z.uuid('Invalid user ID'),
});

export const userOwnProfileUpdateSchema = updateUserSchema.omit({
  email: true,
  roleId: true,
  isActive: true,
});

export const userAdminUpdateSchema = updateUserSchema.omit({
  email: true,
})


export type UserParams = z.infer<typeof userParamsSchema>;
export type UserOwnProfileUpdateInput = z.infer<typeof userOwnProfileUpdateSchema>;
export type UserAdminUpdateInput = z.infer<typeof userAdminUpdateSchema>;
