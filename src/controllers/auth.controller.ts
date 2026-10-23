import { randomBytes } from 'node:crypto';
import { Request, Response } from 'express';
import {
  authenticationServicePublic,
  authorizationServicePublic,
  googleOAuthServicePublic,
  sessionServicePublic,
} from '../services';
import { SESSION_COOKIE_NAME } from '../services/session.service';
import {
  googleAuthCallbackQuerySchema,
  googleAuthStartQuerySchema,
  loginSchema,
  registerWithInvitationSchema,
} from '../types/auth.types';
import { asyncHandler } from '../utils/async-handler';
import { AppError } from '../utils/errors';

const OAUTH_STATE_TTL_MS = Number(process.env.OAUTH_STATE_TTL_MS || 10 * 60 * 1000);
const AUTH_SUCCESS_REDIRECT_URL = process.env.AUTH_SUCCESS_REDIRECT_URL || 'http://localhost:5173/auth/callback/success';
const AUTH_FAILURE_REDIRECT_URL = process.env.AUTH_FAILURE_REDIRECT_URL || 'http://localhost:5173/auth/callback/error';

const saveSession = async (req: Request): Promise<void> => {
  await new Promise<void>((resolve, reject) => {
    req.session.save((err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
};

const buildRedirectUrl = (baseUrl: string, params: Record<string, string>): string => {
  const query = new URLSearchParams(params);
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}${query.toString()}`;
};

export const authController = {
  // GET /auth/google/start?intent=login|register&token=...
  startGoogleAuth: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const query = googleAuthStartQuerySchema.parse(req.query);
    const state = randomBytes(24).toString('hex');

    req.session.oauth = {
      state,
      intent: query.intent,
      invitationToken: query.token,
      createdAt: Date.now(),
    };
    await saveSession(req);

    const authUrl = googleOAuthServicePublic.buildAuthorizationUrl(state);
    res.redirect(302, authUrl);
  }),

  // GET /auth/google/callback
  googleCallback: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const rawQuery = {
      code: typeof req.query.code === 'string' ? req.query.code : undefined,
      state: typeof req.query.state === 'string' ? req.query.state : undefined,
      error: typeof req.query.error === 'string' ? req.query.error : undefined,
      errorDescription:
        typeof req.query.error_description === 'string'
          ? req.query.error_description
          : undefined,
    };
    const query = googleAuthCallbackQuerySchema.parse(rawQuery);
    const pendingOAuth = req.session.oauth;

    const fail = async (reason: string): Promise<void> => {
      if (req.session.oauth) {
        delete req.session.oauth;
        await saveSession(req);
      }

      const failureRedirect = buildRedirectUrl(AUTH_FAILURE_REDIRECT_URL, {
        status: 'error',
        reason,
      });
      res.redirect(302, failureRedirect);
    };

    if (query.error) {
      await fail('provider_error');
      return;
    }

    if (!pendingOAuth) {
      await fail('missing_session_state');
      return;
    }

    if (!query.state || query.state !== pendingOAuth.state) {
      await fail('invalid_state');
      return;
    }

    if (!query.code) {
      await fail('missing_code');
      return;
    }

    if (Date.now() - pendingOAuth.createdAt > OAUTH_STATE_TTL_MS) {
      await fail('expired_state');
      return;
    }

    try {
      if (pendingOAuth.intent === 'register' && !pendingOAuth.invitationToken) {
        await fail('missing_invitation_token');
        return;
      }

      const tokens = await googleOAuthServicePublic.exchangeCodeForTokens(query.code);
      const profile = await googleOAuthServicePublic.fetchUserProfile(tokens.access_token as string);

      const user = pendingOAuth.intent === 'register'
        ? await authenticationServicePublic.register({
            token: pendingOAuth.invitationToken as string,
            externalId: profile.externalId,
            email: profile.email,
            name: profile.name,
          })
        : await authenticationServicePublic.login({
            externalId: profile.externalId,
            email: profile.email,
          });

      await sessionServicePublic.createLoginSession(req, user);

      const successRedirect = buildRedirectUrl(AUTH_SUCCESS_REDIRECT_URL, {
        status: 'success',
        intent: pendingOAuth.intent,
      });
      res.redirect(302, successRedirect);
    } catch {
      await fail('callback_failed');
    }
  }),

  // POST /auth/register
  register: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const input = registerWithInvitationSchema.parse(req.body);
    const user = await authenticationServicePublic.register(input);
    await sessionServicePublic.createLoginSession(req, user);

    res.status(201).json({
      success: true,
      data: user,
      message: 'Registration completed successfully',
    });
  }),

  // POST /auth/login
  login: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const input = loginSchema.parse(req.body);
    const user = await authenticationServicePublic.login(input);
    await sessionServicePublic.createLoginSession(req, user);

    res.status(200).json({
      success: true,
      data: user,
      message: 'Login successful',
    });
  }),

  // POST /auth/logout
  logout: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await sessionServicePublic.destroySession(req);
    res.clearCookie(SESSION_COOKIE_NAME);

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
