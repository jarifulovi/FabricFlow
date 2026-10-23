import { roleRepo, userRepo } from '../database/repositories';
import { CreateUserInput, UserRow } from '../database/types/user';
import { BadRequestError, NotFoundError } from '../utils/errors';
import { invitationService } from './invitation.service';
import { RegisterWithInvitationInput, LoginInput } from '../types/auth.types';



export const authenticationService = {
  // TODO: Try to wrap in a transaction in future
  async registerWithInvitation(input: RegisterWithInvitationInput): Promise<UserRow> {
    const normalizedEmail = authenticationService.normalizeEmail(input.email);

    const invitation = await invitationService.findValidByRawToken(input.token);
    if (authenticationService.normalizeEmail(invitation.email) !== normalizedEmail) {
      throw new BadRequestError('Invitation email does not match OAuth email');
    }

    const role = await roleRepo.findById(invitation.roleId);
    if (!role) {
      throw new BadRequestError('Invitation role is invalid');
    }

    const existingUser = await userRepo.findByEmail(normalizedEmail);
    let user: UserRow;

    if (!existingUser) {
      // Keep this local for now; can be moved to a dedicated auth/user method later.
      const createUserInput: CreateUserInput = {
        externalId: input.externalId,
        email: normalizedEmail,
        name: input.name ?? null,
        roleId: invitation.roleId,
        isActive: true,
      };
      user = await userRepo.create(createUserInput);
    } else {
      if (existingUser.externalId !== input.externalId) {
        throw new BadRequestError('OAuth account does not match existing user identity');
      }
      user = await userRepo.update(existingUser.id, {
        roleId: invitation.roleId,
        isActive: true,
      });
    }

    await invitationService.consumeInvitation(input.token, normalizedEmail);
    return user;
  },

  async register(input: RegisterWithInvitationInput): Promise<UserRow> {
    return this.registerWithInvitation(input);
  },

  async login(input: LoginInput): Promise<UserRow> {
    if (!input.externalId && !input.email) {
      throw new BadRequestError('Either externalId or email is required');
    }

    const byExternalId = input.externalId ? await userRepo.findByExternalId(input.externalId) : null;
    if (byExternalId) {
      if (byExternalId.isActive === false) {
        throw new BadRequestError('User account is inactive');
      }
      return byExternalId;
    }

    if (!input.email) {
      throw new NotFoundError('User not found');
    }

    const byEmail = await userRepo.findByEmail(authenticationService.normalizeEmail(input.email));
    if (!byEmail) {
      throw new NotFoundError('User not found');
    }

    if (byEmail.isActive === false) {
      throw new BadRequestError('User account is inactive');
    }

    return byEmail;
  },

  // helper methods
  normalizeEmail (email: string): string {
    return email.trim().toLowerCase();
  }
};