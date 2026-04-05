import { ROLE_PERMISSIONS, DefaultRole } from '../constants/role-permissions';
import { Permission } from '../constants/permissions';
import { authRepo } from '../database/repositories';
import { PermissionLookupInput } from '../types/auth.types';
import { BadRequestError } from '../utils/errors';

type SupportedRole = DefaultRole; // make it string when custom roles are supported

export const authorizationService = {
  /**
   * Returns the permissions associated with a given role name.
   * Uses in-memory mapping for now; can be updated to query the database later.
   */
  getPermissionsByRoleName(roleName?: string): Permission[] {
    const normalizedRole = this.normalizeRoleName(roleName);
    if (!normalizedRole) {
      return [];
    }
    return ROLE_PERMISSIONS[normalizedRole] as Permission[];
  },

  /**
   * Resolves the permissions for a user based on input.
   * If a role is provided, returns permissions for that role.
   * Otherwise, looks up the user's role from the database and returns its permissions.
   * Throws bad request error if no user identity is provided (userId | externalId | email).
   */
  async resolvePermissions(input: PermissionLookupInput): Promise<Permission[]> {
    if (input.role) {
      return this.getPermissionsByRoleName(input.role);
    }

    if (!input.userId && !input.externalId && !input.email) {
      throw new BadRequestError('Missing user identity for permission resolution');
    }

    const userRole = await authRepo.findActiveUserRole({
      userId: input.userId,
      externalId: input.externalId,
      email: input.email,
    });

    if (!userRole) {
      return [];
    }

    return this.getPermissionsByRoleName(userRole.roleName);
  },

  /**
   * Checks if the user (or role) has the specified permission.
   * Uses provided permissions if available, otherwise resolves them.
   */
  async hasPermission(permission: Permission, input: PermissionLookupInput): Promise<boolean> {
    const resolvedPermissions = Array.isArray(input.permissions)
      ? input.permissions
      : await this.resolvePermissions(input);

    return resolvedPermissions.includes(permission);
  },

  /**
   * Normalizes a role name to match the keys in ROLE_PERMISSIONS.
   * Returns null if the role is not recognized.
   */
  normalizeRoleName(roleName?: string): SupportedRole | null {
    if (!roleName) {
      return null;
    }

    const normalized = roleName.toLowerCase() as SupportedRole;
    if (normalized in ROLE_PERMISSIONS) {
      return normalized;
    }

    return null;
  }
};
