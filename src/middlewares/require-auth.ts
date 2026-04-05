import { NextFunction, Request, Response } from 'express';
import { sessionService } from '../services/session.service';
import { RequestUser } from '../types/auth.types';
import { AppError } from '../utils/errors';

type RequestWithUser = Request & {
  user?: RequestUser;
};

/**
 * Enforces authenticated access using session data and attaches actor to req.user.
 * This should run before permission middleware so authorization can use req.user.
 */
export const requireAuth = () => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sessionUser = sessionService.getSessionUser(req);
      if (!sessionUser) {
        throw new AppError('Unauthorized', 401);
      }

      const request = req as RequestWithUser;
      request.user = {
        id: sessionUser.id,
        externalId: sessionUser.externalId,
        email: sessionUser.email,
        role: sessionUser.roleName ?? undefined,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};