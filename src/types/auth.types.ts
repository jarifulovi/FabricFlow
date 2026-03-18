import { Permission } from '../constants/permissions';

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