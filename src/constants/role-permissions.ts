import { PERMISSIONS } from './permissions';

export const ROLE_PERMISSIONS = {
  admin: Object.values(PERMISSIONS),
  manager: [
    PERMISSIONS.CATEGORY_CREATE,
    PERMISSIONS.CATEGORY_READ_ANY,
    PERMISSIONS.CATEGORY_UPDATE,
    PERMISSIONS.CATEGORY_DELETE,
    // TODO: Fix the permissions first
    // Add more as needed for manager
  ],
  user: [
    PERMISSIONS.CATEGORY_READ_ANY,
    // TODO: Fix the permissions first
    // Basic read-only permissions for user
  ],
} as const;

/**
 * Type of system roles. Note default roles are not necessarily exhaustive of all possible roles in the system, but represent the baseline for permission assignment.
 */
export type DefaultRole = keyof typeof ROLE_PERMISSIONS;