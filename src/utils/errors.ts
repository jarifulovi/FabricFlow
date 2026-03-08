/**
 * Base application error. All custom errors extend this to carry an HTTP status code,
 * allowing the central error handler to read `error.statusCode` directly instead of
 * parsing the error message string.
 */
export class AppError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    // Maintains proper stack trace in V8
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/** 400 Bad Request — invalid input or business-rule violation */
export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

/** 404 Not Found — resource does not exist */
export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
  }
}

/** 409 Conflict — resource already exists or uniqueness violation */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}
