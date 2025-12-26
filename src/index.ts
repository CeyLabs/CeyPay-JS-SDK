/**
 * CeyPay SDK - Official TypeScript/JavaScript SDK for CeyPay API
 *
 * @packageDocumentation
 */

// Main client
export { CeyPayClient } from './client';

// Webhook utilities
export { verifyWebhook, verifyWebhookExpress, computeWebhookSignature } from './utils/webhook-verifier';
export type { VerifyWebhookOptions } from './utils/webhook-verifier';

// Error classes
export {
  CeyPayError,
  AuthenticationError,
  ValidationError,
  NotFoundError,
  ForbiddenError,
  ConflictError,
  GoneError,
  UnprocessableEntityError,
  RateLimitError,
  InternalServerError,
  BadGatewayError,
  ApiError,
  NetworkError,
} from './utils/errors';

// All types
export * from './types';
