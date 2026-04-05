import { Request, Response } from 'express';
import {
  authenticationServicePublic,
  authorizationServicePublic,
  sessionServicePublic,
} from '../services';
import {
  loginSchema,
  registerWithInvitationSchema,
} from '../types/auth.types';
import { asyncHandler } from '../utils/async-handler';
import { AppError } from '../utils/errors';

export const authController = {
  // POST /auth/register
  register: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const input = registerWithInvitationSchema.parse(req.body);
    const user = await authenticationServicePublic.register(input, req);

    res.status(201).json({
      success: true,
      data: user,
      message: 'Registration completed successfully',
    });
  }),

  // POST /auth/login
  login: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const input = loginSchema.parse(req.body);
    const user = await authenticationServicePublic.login(input, req);

    res.status(200).json({
      success: true,
      data: user,
      message: 'Login successful',
    });
  }),

  // POST /auth/logout
  logout: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await sessionServicePublic.destroySession(req, res);

    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  }),

  // GET /auth/me
  me: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const sessionUser = sessionServicePublic.getSessionUser(req);
    if (!sessionUser) {
      throw new AppError('Unauthorized', 401);
    }

    const permissions = await authorizationServicePublic.resolvePermissions({
      userId: sessionUser.id,
      role: sessionUser.roleName ?? undefined,
      email: sessionUser.email,
      externalId: sessionUser.externalId,
    });

    res.status(200).json({
      success: true,
      data: {
        id: sessionUser.id,
        externalId: sessionUser.externalId,
        email: sessionUser.email,
        roleId: sessionUser.roleId,
        role: sessionUser.roleName ?? null,
        permissions,
      },
    });
  }),
};
