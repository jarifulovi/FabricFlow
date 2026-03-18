import { NextFunction, Request, Response } from 'express';
import { Permission } from '../constants/permissions';
import { authorizationService } from '../services/authorization.service';
import { RequestUser } from '../types/auth.types';
import { AppError } from '../utils/errors';

type RequestWithUser = Request & {
  user?: RequestUser;
};

/**
 * Enforces role/permission access for a route.
 * Checks after authentication middleware has run and attached user info to the request.
 */
export const requirePermission = (permission: Permission) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const request = req as RequestWithUser;
      const user = request.user;

      if (!user) {
        throw new AppError('Unauthorized', 401);
      }

      const isAllowed = await authorizationService.hasPermission(permission, {
        userId: user.id,
        externalId: user.externalId,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
      });

      if (!isAllowed) {
        throw new AppError('Forbidden: missing required permission', 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
