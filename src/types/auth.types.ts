import { Permission } from '../constants/permissions';

// ===== API/CONTROLLER TYPES =====
// These types handle API-specific concerns (validation, transformation, etc.)

import { z } from 'zod/v4';

export const registerWithInvitationSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  externalId: z.string().min(1, 'External ID is required'),
  email: z.email('Invalid email address').max(255, 'Email is too long'),
  name: z.string().max(100, 'Name is too long').optional().nullable(),
});

export const loginSchema = z.object({
  externalId: z.string().min(1).optional(),
  email: z.email('Invalid email address').max(255, 'Email is too long').optional(),
}).refine(data => data.externalId || data.email, {
  message: 'Either externalId or email is required',
});

export type RegisterWithInvitationInput = z.infer<typeof registerWithInvitationSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export interface AuthIdentityInput {
  userId?: string;
  externalId?: string;
  email?: string;
}

export interface PermissionLookupInput extends AuthIdentityInput {
  role?: string;
  permissions?: Permission[] | string[];
}

export interface RequestUser {
  id?: string;
  externalId?: string;
  email?: string;
  role?: string;
  permissions?: Permission[] | string[];
}