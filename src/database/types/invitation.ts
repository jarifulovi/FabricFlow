import { z } from 'zod/v4';

// Zod schema - single source of truth
export const invitationSchema = z.object({
  id: z.uuid({ message: 'Invalid invitation ID' }),
  email: z.email({ message: 'Invalid email address' }).max(255, 'Email is too long'),
  roleId: z.uuid({ message: 'Invalid role ID' }),
  tokenHash: z.string().min(1, 'Token hash is required'),
  expiresAt: z.date(),
  acceptedAt: z.date().optional().nullable(),
  createdBy: z.uuid({ message: 'Invalid creator user ID' }).optional().nullable(),
  createdAt: z.date(),
});

export const createInvitationSchema = invitationSchema.omit({
  id: true,
  acceptedAt: true,
  createdAt: true,
});

export const updateInvitationSchema = z.object({
  email: z.email({ message: 'Invalid email address' }).max(255, 'Email is too long').optional(),
  roleId: z.uuid({ message: 'Invalid role ID' }).optional(),
  tokenHash: z.string().min(1, 'Token hash is required').optional(),
  expiresAt: z.date().optional(),
  acceptedAt: z.date().nullable().optional(),
});

export const invitationRowSchema = invitationSchema.omit({
  expiresAt: true,
  acceptedAt: true,
  createdAt: true,
}).extend({
  expiresAt: z.string(),
  acceptedAt: z.string().nullable(),
  createdAt: z.string(),
});

// TypeScript types inferred from schemas
export type Invitation = z.infer<typeof invitationSchema>;
export type CreateInvitationInput = z.infer<typeof createInvitationSchema>;
export type UpdateInvitationInput = z.infer<typeof updateInvitationSchema>;
export type InvitationRow = z.infer<typeof invitationRowSchema>;

// Column mapping for database queries
export const invitationColumnMapping: Record<string, string> = {
  email: 'email',
  roleId: 'role_id',
  tokenHash: 'token_hash',
  expiresAt: 'expires_at',
  acceptedAt: 'accepted_at',
  createdBy: 'created_by',
  createdAt: 'created_at',
};
