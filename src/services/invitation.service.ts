import { createHash, randomBytes } from 'node:crypto';
import { invitationRepo, roleRepo } from '../database/repositories';
import { InvitationRow } from '../database/types/invitation';
import { InvitationCreateBody } from '../types/invitation.types';
import { BadRequestError, ConflictError, NotFoundError } from '../utils/errors';
import { RequestUser } from '../types/auth.types';
import { emailService } from './email.service';
import { buildInvitationEmailContent } from '../constants/email/invitation-email';

// Constants
const DEFAULT_EXPIRY_HOURS = 72;
const INVITE_ACCEPT_URL = process.env.INVITE_ACCEPT_URL || 'http://localhost:5173/accept-invite';

// These types are specific to this service's return values and not used elsewhere.
type InvitationPreview = Pick<InvitationRow, 'id' | 'email' | 'roleId' | 'expiresAt'>;
type CreateInvitationResult = {
  invitation: InvitationRow;
  rawToken: string;
};


export const invitationService = {
  async createInvitation(input: InvitationCreateBody, actor: RequestUser): Promise<CreateInvitationResult> {
    const normalizedEmail = invitationService.normalizeEmail(input.email);

    const role = await roleRepo.findById(input.roleId);
    if (!role) {
      throw new BadRequestError('Invalid role ID');
    }
    if (role.name === 'superadmin') {
      throw new BadRequestError('Cannot assign superadmin role in invitation');
    }
    if (role.name === 'admin' && actor.role !== 'superadmin') {
      throw new BadRequestError('Only superadmin can assign admin role in invitation');
    }

    const existingPending = await invitationRepo.findByEmail(normalizedEmail);
    if (existingPending) {
      throw new ConflictError('An active invitation for this email already exists');
    }

    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = invitationService.hashInvitationToken(rawToken);

    const invitation = await invitationRepo.create({
      email: normalizedEmail,
      roleId: input.roleId,
      tokenHash,
      expiresAt: invitationService.getExpiryDate(input.expiresAt),
      createdBy: actor.id ?? null,
    });

    if (emailService.isConfigured()) {
      const inviteLink = `${INVITE_ACCEPT_URL}?token=${encodeURIComponent(rawToken)}`;
      const content = buildInvitationEmailContent({
        inviteLink,
        roleName: role.name,
        expiresAt: invitation.expiresAt,
      });

      await emailService.sendEmail({
        to: normalizedEmail,
        subject: content.subject,
        text: content.text,
        html: content.html,
      });
    }

    // TODO: if you need strict delivery guarantees, fail invite creation when email sending fails.
    return { invitation, rawToken };
  },

  async previewInvitation(token: string): Promise<InvitationPreview> {
    const invitation = await invitationService.findValidByRawToken(token);
    return {
      id: invitation.id,
      email: invitation.email,
      roleId: invitation.roleId,
      expiresAt: invitation.expiresAt,
    };
  },

  async findValidByRawToken(token: string): Promise<InvitationRow> {
    const tokenHash = invitationService.hashInvitationToken(token);
    const invitation = await invitationRepo.findByTokenHash(tokenHash);
    if (!invitation) {
      throw new NotFoundError('Invitation is invalid, expired, or already used');
    }
    return invitation;
  },

  async consumeInvitation(token: string, oauthEmail: string): Promise<InvitationRow> {
    const tokenHash = invitationService.hashInvitationToken(token);
    const normalizedEmail = invitationService.normalizeEmail(oauthEmail);
    const consumedInvitation = await invitationRepo.consume(tokenHash, normalizedEmail);
    if (!consumedInvitation) {
      throw new NotFoundError('Invitation is invalid, expired, or already used');
    }
    return consumedInvitation;
  },

  // Private helpers
  normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  },

  hashInvitationToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  },

  getExpiryDate(expiresAt?: Date): Date {
    if (expiresAt) return expiresAt;
    return new Date(Date.now() + DEFAULT_EXPIRY_HOURS * 60 * 60 * 1000);
  }
};