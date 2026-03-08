import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

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

  let statusCode = 500;
  let message = error.message || 'Internal Server Error';

  if (error instanceof AppError) {
    // Custom application errors carry their own status code
    statusCode = error.statusCode;
  } else if (error.name === 'ZodError') {
    // Zod validation errors are always 400 Bad Request
    statusCode = 400;
  } else {
    // Fallback: detect common raw DB / library errors by message
    const msg = message.toLowerCase();
    if (msg.includes('duplicate key') || msg.includes('violates unique constraint')) {
      statusCode = 409;
    } else if (msg.includes('foreign key constraint') || msg.includes('violates foreign key')) {
      statusCode = 400;
    }
    // Only log truly unexpected errors — skip in test env to keep output clean
    if (!isTest) {
      console.error('Unexpected error:', {
        message: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
      });
    }
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