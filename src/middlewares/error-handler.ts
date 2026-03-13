import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import logger from '../utils/logger';

/**
 * Error response interface for consistent error formatting
 */
interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
  stack?: string;
}

/**
 * Centralized error handling middleware.
 * Custom AppError subclasses carry their own statusCode — no message parsing needed.
 * Falls back to message inspection only for unexpected raw DB / library errors.
 */
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isTest = process.env.NODE_ENV === 'test';

  const isAppError = error instanceof AppError;
  const isZodError = error.name === 'ZodError';
  const statusCode = isAppError ? error.statusCode : isZodError ? 400 : 500;
  const message = error.message || 'Internal Server Error';

  // Log error using Winston logger, except in test environment
  if (!isTest) {
    logger.error({
      message: error.message,
      stack: error.stack,
      url: req.originalUrl,
      method: req.method,
      statusCode,
      user: (req as any).user?.id || undefined,
    });
  }

  const errorResponse: ErrorResponse = {
    success: false,
    message: statusCode === 500 && !isDevelopment ? 'Internal Server Error' : message,
    ...(isDevelopment && {
      error: error.name,
      stack: error.stack,
    }),
  };

  res.status(statusCode).json(errorResponse);
}

/**
 * 404 Not Found middleware for unmatched routes
 */
export function notFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const error = new Error(`Route ${req.originalUrl} not found`);
  res.status(404).json({
    success: false,
    message: error.message
  });
}