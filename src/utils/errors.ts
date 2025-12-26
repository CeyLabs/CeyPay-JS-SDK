import { ErrorResponse } from '../types';

/**
 * Custom error classes for CeyPay SDK
 */

/**
 * Base error class for all CeyPay SDK errors
 */
export class CeyPayError extends Error {
  /** HTTP status code */
  public readonly statusCode?: number;
  /** Original error response data */
  public readonly response?: ErrorResponse;
  /** Request context */
  public readonly context?: Record<string, any>;

  constructor(message: string, statusCode?: number, response?: ErrorResponse, context?: Record<string, any>) {
    super(message);
    this.name = 'CeyPayError';
    this.statusCode = statusCode;
    this.response = response;
    this.context = context;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Authentication error (401)
 * Thrown when API key is invalid or signature verification fails
 */
export class AuthenticationError extends CeyPayError {
  constructor(message: string, response?: ErrorResponse, context?: Record<string, any>) {
    super(message, 401, response, context);
    this.name = 'AuthenticationError';
  }
}

/**
 * Validation error (400)
 * Thrown when request data fails validation
 */
export class ValidationError extends CeyPayError {
  /** Validation error details */
  public readonly validationErrors?: Array<{
    field: string;
    constraint: string;
    message: string;
  }>;

  constructor(message: string, response?: ErrorResponse, context?: Record<string, any>) {
    super(message, 400, response, context);
    this.name = 'ValidationError';
    this.validationErrors = response?.details;
  }
}

/**
 * Not found error (404)
 * Thrown when requested resource doesn't exist
 */
export class NotFoundError extends CeyPayError {
  constructor(message: string, response?: ErrorResponse, context?: Record<string, any>) {
    super(message, 404, response, context);
    this.name = 'NotFoundError';
  }
}

/**
 * Forbidden error (403)
 * Thrown when user doesn't have permission to access resource
 */
export class ForbiddenError extends CeyPayError {
  constructor(message: string, response?: ErrorResponse, context?: Record<string, any>) {
    super(message, 403, response, context);
    this.name = 'ForbiddenError';
  }
}

/**
 * Conflict error (409)
 * Thrown when there's a resource conflict (e.g., duplicate slug)
 */
export class ConflictError extends CeyPayError {
  constructor(message: string, response?: ErrorResponse, context?: Record<string, any>) {
    super(message, 409, response, context);
    this.name = 'ConflictError';
  }
}

/**
 * Gone error (410)
 * Thrown when resource has expired or been permanently deleted
 */
export class GoneError extends CeyPayError {
  constructor(message: string, response?: ErrorResponse, context?: Record<string, any>) {
    super(message, 410, response, context);
    this.name = 'GoneError';
  }
}

/**
 * Unprocessable entity error (422)
 * Thrown when request is well-formed but fails business logic validation
 */
export class UnprocessableEntityError extends CeyPayError {
  constructor(message: string, response?: ErrorResponse, context?: Record<string, any>) {
    super(message, 422, response, context);
    this.name = 'UnprocessableEntityError';
  }
}

/**
 * Rate limit error (429)
 * Thrown when API rate limit is exceeded
 */
export class RateLimitError extends CeyPayError {
  /** Seconds to wait before retrying */
  public readonly retryAfter?: number;

  constructor(message: string, retryAfter?: number, response?: ErrorResponse, context?: Record<string, any>) {
    super(message, 429, response, context);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

/**
 * Internal server error (500)
 * Thrown when server encounters an unexpected error
 */
export class InternalServerError extends CeyPayError {
  constructor(message: string, response?: ErrorResponse, context?: Record<string, any>) {
    super(message, 500, response, context);
    this.name = 'InternalServerError';
  }
}

/**
 * Bad gateway error (502)
 * Thrown when upstream service (e.g., Bybit) fails
 */
export class BadGatewayError extends CeyPayError {
  constructor(message: string, response?: ErrorResponse, context?: Record<string, any>) {
    super(message, 502, response, context);
    this.name = 'BadGatewayError';
  }
}

/**
 * Generic API error for other status codes
 */
export class ApiError extends CeyPayError {
  constructor(message: string, statusCode: number, response?: ErrorResponse, context?: Record<string, any>) {
    super(message, statusCode, response, context);
    this.name = 'ApiError';
  }
}

/**
 * Network error (no response from server)
 */
export class NetworkError extends CeyPayError {
  constructor(message: string, originalError?: Error) {
    super(message, undefined, undefined, { originalError });
    this.name = 'NetworkError';
  }
}
