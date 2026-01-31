import { Request, Response, NextFunction } from "express";

/**
 * Wraps an async route handler and forwards errors to Express error middleware.
 * Avoids repetitive try/catch in every controller method.
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };