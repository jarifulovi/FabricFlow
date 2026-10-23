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

export const googleAuthIntentSchema = z.enum(['login', 'register']);

export const googleAuthStartQuerySchema = z.object({
  intent: googleAuthIntentSchema.default('login'),
  token: z.string().min(1).optional(),
}).refine((data) => data.intent !== 'register' || Boolean(data.token), {
  message: 'Invitation token is required for register intent',
  path: ['token'],
});

export const googleAuthCallbackQuerySchema = z.object({
  code: z.string().min(1).optional(),
  state: z.string().min(1).optional(),
  error: z.string().min(1).optional(),
  errorDescription: z.string().min(1).optional(),
});

export type RegisterWithInvitationInput = z.infer<typeof registerWithInvitationSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type GoogleAuthIntent = z.infer<typeof googleAuthIntentSchema>;
export type GoogleAuthStartQuery = z.infer<typeof googleAuthStartQuerySchema>;
export type GoogleAuthCallbackQuery = z.infer<typeof googleAuthCallbackQuerySchema>;

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