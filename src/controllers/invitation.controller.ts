import { Request, Response } from 'express';
import { invitationServicePublic } from '../services';
import { RequestUser } from '../types/auth.types';
import {
  invitationByTokenQuerySchema,
  invitationCreateBodySchema,
} from '../types/invitation.types';
import { asyncHandler } from '../utils/async-handler';
import { AppError } from '../utils/errors';

type RequestWithUser = Request & {
  user?: RequestUser;
};

export const invitationController = {
  // POST /invitations
  create: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const input = invitationCreateBodySchema.parse(req.body);
    const actor = (req as RequestWithUser).user;

    if (!actor) {
      throw new AppError('Unauthorized', 401);
    }

    const result = await invitationServicePublic.createInvitation(input, actor);

    res.status(201).json({
      success: true,
      data: result,
      message: 'Invitation created successfully',
    });
  }),

  // GET /invitations/preview?token=...
  preview: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { token } = invitationByTokenQuerySchema.parse(req.query);
    const invitation = await invitationServicePublic.previewInvitation(token);

    res.status(200).json({
      success: true,
      data: invitation,
    });
  }),
};
