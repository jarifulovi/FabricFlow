import { z } from 'zod/v4';

export const userRoleLookupInputSchema = z
  .object({
    userId: z.uuid().optional(),
    externalId: z.string().min(1).optional(),
    email: z.email().optional(),
  })
  .refine(
    (value) => Boolean(value.userId || value.externalId || value.email),
    'At least one user lookup field is required'
  );

export const userRoleRowSchema = z.object({
  userId: z.uuid(),
  externalId: z.string(),
  email: z.email(),
  roleName: z.string().min(1),
});

export type UserRoleLookupInput = z.infer<typeof userRoleLookupInputSchema>;
export type UserRoleRow = z.infer<typeof userRoleRowSchema>;