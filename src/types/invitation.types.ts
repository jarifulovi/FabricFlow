import { z } from 'zod/v4';
import { updateInvitationSchema } from '../database/types/invitation';

// API/Controller params
export const invitationParamsSchema = z.object({
  id: z.uuid('Invalid invitation ID'),
});

export const invitationByEmailQuerySchema = z.object({
  email: z.email('Invalid email address').max(255, 'Email is too long'),
});

export const invitationByTokenQuerySchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

export const invitationCreateBodySchema = z.object({
  email: z.email('Invalid email address').max(255, 'Email is too long'),
  roleId: z.uuid('Invalid role ID'),
  expiresAt: z.coerce.date().optional(),
});
export const invitationUpdateBodySchema = updateInvitationSchema;

export type InvitationParams = z.infer<typeof invitationParamsSchema>;
export type InvitationByEmailQuery = z.infer<typeof invitationByEmailQuerySchema>;
export type InvitationByTokenQuery = z.infer<typeof invitationByTokenQuerySchema>;
export type InvitationCreateBody = z.infer<typeof invitationCreateBodySchema>;
export type InvitationUpdateBody = z.infer<typeof invitationUpdateBodySchema>;
