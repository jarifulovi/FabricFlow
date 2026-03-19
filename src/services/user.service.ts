import { PERMISSIONS, Permission } from '../constants/permissions';
import { roleRepo, userRepo } from '../database/repositories';
import { CreateUserInput, UserRow } from '../database/types/user';
import { RequestUser } from '../types/auth.types';
import { AppError, BadRequestError, ConflictError, NotFoundError } from '../utils/errors';
import { hasUpdateFields } from '../utils/service-utils';
import { authorizationService } from './authorization.service';
import { UserAdminUpdateInput, UserOwnProfileUpdateInput } from '../types/user.types';


export const userService = {
  // TODO: impplement exists, count, findAll
  // TODO: this create might be migrated to auth service with invitation based registration flow, but for now we can keep it here for simplicity
  async create(actor: RequestUser, input: CreateUserInput): Promise<UserRow> {
    const existingRole = await roleRepo.findById(input.roleId);
    if (!existingRole) {
      throw new BadRequestError('Invalid role ID');
    }
    if (existingRole.name === 'superadmin') {
      throw new AppError('Forbidden: cannot assign superadmin role to user', 403);
    }
    if (existingRole.name === 'admin' && actor.role !== 'superadmin') {
      throw new AppError('Forbidden: only superadmin can assign admin role to user', 403);
    }
    const existingByExternalId = await userRepo.findByExternalId(input.externalId);
    if (existingByExternalId) {
      throw new ConflictError('User with the same external ID already exists');
    }

    const existingByEmail = await userRepo.findByEmail(input.email);
    if (existingByEmail) {
      throw new ConflictError('User with the same email already exists');
    }

    return await userRepo.create(input);
  },

  async findById(id: string): Promise<UserRow> {
    const user = await userRepo.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  },

  async findByExternalId(externalId: string): Promise<UserRow> {
    const user = await userRepo.findByExternalId(externalId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  },

  async findByEmail(email: string): Promise<UserRow> {
    const user = await userRepo.findByEmail(email);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  },

  async findProfileForActor(actor: RequestUser, targetUserId: string): Promise<UserRow> { 
    const isSelf = actor.id === targetUserId; 
    if (!isSelf) {
      const canReadOthers = await this.actorHasPermission(actor, PERMISSIONS.USER_READ_ALL); 
      if (!canReadOthers) { 
        throw new AppError('Forbidden: cannot view other user profiles', 403); 
      }
    } 
    return await this.findById(targetUserId);
  },

  // Implement findAll for previliged users

  async updateOwnProfile(actor: RequestUser, targetUserId: string, input: UserOwnProfileUpdateInput): Promise<UserRow> {
    if (actor.id !== targetUserId) {
      throw new AppError('Forbidden: cannot update other user profiles', 403);
    }
    if (!hasUpdateFields(input)) {
      throw new BadRequestError('No fields provided to update');
    }
    const existing = await userRepo.findById(targetUserId);
    if (!existing) {
      throw new NotFoundError('User not found');
    }
    if (!existing.isActive) {
      throw new AppError('Cannot update inactive user unless reactivating', 403);
    }
    return await userRepo.update(targetUserId, input);
  },

  async updateUserByAdmin(actor: RequestUser, targetUserId: string, input: UserAdminUpdateInput): Promise<UserRow> {
    if (!hasUpdateFields(input)) {
      throw new BadRequestError('No fields provided to update');
    }
    const existing = await userRepo.findById(targetUserId);
    if (!existing) {
      throw new NotFoundError('User not found');
    }
    if (existing.roleName === 'admin' && actor.role !== 'superadmin') {
      throw new AppError('Forbidden: cannot update admin or superadmin user profiles', 403);
    }
    
    if (actor.id === targetUserId) {
      delete input.roleId;
      delete input.isActive;
    }
    return await userRepo.update(targetUserId, input);
  },

  async updateUserBySuperAdmin(actor: RequestUser, targetUserId: string, input: Partial<UserRow>): Promise<UserRow> {
    // Only superadmins can update admin users and others
    if (!hasUpdateFields(input)) {
      throw new BadRequestError('No fields provided to update');
    }
    const existing = await userRepo.findById(targetUserId);
    if (!existing) {
      throw new NotFoundError('User not found');
    }
    if (actor.id === targetUserId) {
      delete input.roleId;
      delete input.isActive;
    }

    return await userRepo.update(targetUserId, input);
  },

  async deleteByAdmin(actor: RequestUser, id: string): Promise<UserRow> {
    if (actor.id === id) {
      throw new AppError('Forbidden: cannot delete own user profile', 403);
    }

    const existing = await userRepo.findById(id);
    if (!existing) {
      throw new NotFoundError('User not found');
    }
    if (existing.roleName === 'admin' || existing.roleName === 'superadmin') {
      throw new AppError('Forbidden: cannot delete admin or superadmin user profiles', 403);
    }
    
    return await userRepo.delete(id);
  },

  async deleteBySuperAdmin(actor: RequestUser, id: string): Promise<UserRow> {
    if (actor.id === id) {
      throw new AppError('Forbidden: cannot delete own user profile', 403);
    }
    // verfiy user exists
    const existing = await userRepo.findById(id);
    if (!existing) {
      throw new NotFoundError('User not found');
    }
    
    return await userRepo.delete(id);
  },

  // helper methods
  async actorHasPermission(actor: RequestUser, permission: Permission): Promise<boolean> {
    return authorizationService.hasPermission(permission, {
      userId: actor.id,
      externalId: actor.externalId,
      email: actor.email,
      role: actor.role,
      permissions: actor.permissions,
    });
  },
};
