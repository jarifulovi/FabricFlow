import { Request } from 'express';
import { UserRow } from '../database/types/user';

type SessionUser = {
  id: string;
  externalId: string;
  email: string;
  roleId: string;
  roleName?: string | null;
};

declare module 'express-session' {
  interface SessionData {
    user?: SessionUser;
  }
}

export const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'fabricflow.sid';



export const sessionService = {
  async createLoginSession(req: Request, user: UserRow): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      req.session.regenerate((err) => {
        if (err) {
          reject(err);
          return;
        }

        req.session.user = sessionService.mapUserToSessionUser(user);
        req.session.save((saveErr) => {
          if (saveErr) {
            reject(saveErr);
            return;
          }
          resolve();
        });
      });
    });
  },

  getSessionUser(req: Request): SessionUser | null {
    return req.session.user || null;
  },

  isAuthenticated(req: Request): boolean {
    return Boolean(req.session.user);
  },

  async destroySession(req: Request): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  },

  mapUserToSessionUser (user: UserRow): SessionUser {
    return ({
      id: user.id,
      externalId: user.externalId,
      email: user.email,
      roleId: user.roleId,
      roleName: user.roleName,
    });
  } 
};
