import { Request, Response, NextFunction } from 'express';

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
 * Maps common error messages to HTTP status codes
 */
function getStatusCodeFromError(error: Error): number {
  const message = error.message.toLowerCase();
  
  // Not found errors
  if (message.includes('not found')) return 404;
  
  // Validation errors
  if (message.includes('invalid') || 
      message.includes('required') || 
      message.includes('must be') ||
      message.includes('cannot be empty') ||
      message.includes('cannot delete') ||
      message.includes('already exists')) {
    return 400;
  }
  
  // Database constraint errors (for PostgreSQL)
  if (message.includes('duplicate key') || 
      message.includes('violates unique constraint')) {
    return 409; // Conflict
  }
  
  if (message.includes('foreign key constraint') ||
      message.includes('violates foreign key')) {
    return 400;
  }
  
  // Default to 500 for unknown errors
  return 500;
}

/**
 * Centralized error handling middleware
 */
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query
  });

  const statusCode = getStatusCodeFromError(error);
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  const errorResponse: ErrorResponse = {
    success: false,
    message: error.message || 'Internal Server Error',
    ...(isDevelopment && { 
      error: error.name,
      stack: error.stack 
    })
  };

  // Don't expose internal errors in production
  if (!isDevelopment && statusCode === 500) {
    errorResponse.message = 'Internal Server Error';
  }

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