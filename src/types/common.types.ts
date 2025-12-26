/**
 * Common types shared across the SDK
 */

/**
 * CeyPay API environments
 */
export enum Env {
  /** Production environment */
  LIVE = 'LIVE',
  /** Sandbox environment for testing */
  SANDBOX = 'SANDBOX',
}

/**
 * SDK client configuration
 */
export interface CeyPayClientConfig {
  /** Full API key in format: ak_live_xxx.sk_live_xxx */
  apiKey: string;
  /** Environment to use (default: Env.LIVE) */
  env?: Env;
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;
  /** Enable debug logging */
  debug?: boolean;
}

/**
 * Rate limit information from response headers
 */
export interface RateLimitInfo {
  /** Maximum requests allowed in the time window */
  limit: number;
  /** Remaining requests in current window */
  remaining: number;
  /** Unix timestamp when the rate limit resets */
  reset: number;
}

/**
 * Generic paginated response wrapper
 */
export interface PaginatedResponse<T> {
  /** Array of items */
  data: T[];
  /** Pagination metadata */
  pagination: {
    /** Current page number */
    page: number;
    /** Number of items per page */
    pageSize: number;
    /** Total number of items */
    total: number;
    /** Total number of pages */
    totalPages: number;
  };
}

/**
 * Pagination request parameters
 */
export interface PaginationParams {
  /** Page number (default: 1) */
  page?: number;
  /** Items per page (default: 20, max: 100) */
  pageSize?: number;
}

/**
 * API error response format
 */
export interface ErrorResponse {
  /** HTTP status code */
  statusCode: number;
  /** Error message */
  message: string;
  /** Error type/name */
  error: string;
  /** Validation error details (for 400 errors) */
  details?: Array<{
    field: string;
    constraint: string;
    message: string;
  }>;
  /** Retry after seconds (for 429 errors) */
  retryAfter?: number;
}

/**
 * Supported currencies
 */
export enum Currency {
  USDT = 'USDT',
  LKR = 'LKR',
}

/**
 * Payment status
 */
export enum PaymentStatus {
  INITIATED = 'INITIATED',
  USER_REVIEW = 'USER_REVIEW',
  PAID = 'PAID',
  EXPIRED = 'EXPIRED',
  FAILED = 'FAILED',
}

/**
 * Payment link status
 */
export enum PaymentLinkStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  USED = 'USED',
  DISABLED = 'DISABLED',
}
