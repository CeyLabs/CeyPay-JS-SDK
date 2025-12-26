import { Currency, PaymentLinkStatus, PaginationParams, PaginatedResponse } from './common.types';

/**
 * Payment link types and interfaces
 */

/**
 * Request to create a new payment link
 */
export interface CreatePaymentLinkRequest {
  /** Payment link name/title */
  name: string;
  /** Payment link description */
  description?: string;
  /** Fixed payment amount (required if !allowCustomAmount) */
  amount?: number;
  /** Payment currency */
  currency: Currency;
  /** Allow customers to enter custom amounts */
  allowCustomAmount: boolean;
  /** Minimum allowed amount (required if allowCustomAmount) */
  minAmount?: number;
  /** Maximum allowed amount (required if allowCustomAmount) */
  maxAmount?: number;
  /** Whether the link can be used multiple times (default: true) */
  reusable?: boolean;
  /** Link expiration date (ISO 8601 format) */
  expirationDate?: string;
  /** Branch ID for multi-branch merchants */
  branchId?: string;
}

/**
 * Request to update an existing payment link
 */
export interface UpdatePaymentLinkRequest {
  /** Updated payment link name */
  name?: string;
  /** Updated description */
  description?: string;
  /** Updated fixed amount */
  amount?: number;
  /** Updated currency */
  currency?: Currency;
  /** Updated custom amount setting */
  allowCustomAmount?: boolean;
  /** Updated minimum amount */
  minAmount?: number;
  /** Updated maximum amount */
  maxAmount?: number;
  /** Updated reusable setting */
  reusable?: boolean;
  /** Updated expiration date */
  expirationDate?: string;
}

/**
 * Payment link response from API
 */
export interface PaymentLinkResponse {
  /** Payment link ID (UUID) */
  id: string;
  /** Merchant ID */
  merchantId: string;
  /** Branch ID (if applicable) */
  branchId?: string;
  /** URL-friendly slug */
  slug: string;
  /** Payment link name */
  name: string;
  /** Payment link description */
  description?: string;
  /** Fixed payment amount */
  amount?: number;
  /** Payment currency */
  currency: string;
  /** Whether custom amounts are allowed */
  allowCustomAmount: boolean;
  /** Minimum allowed amount */
  minAmount?: number;
  /** Maximum allowed amount */
  maxAmount?: number;
  /** Whether link can be reused */
  reusable: boolean;
  /** Number of times link has been used */
  usedCount: number;
  /** Link expiration date */
  expirationDate?: string;
  /** Current link status */
  status: PaymentLinkStatus;
  /** Creator type (CLERK_USER or API_KEY) */
  creatorType: 'CLERK_USER' | 'API_KEY';
  /** Creator ID (Clerk user ID or API key ID) */
  creatorId: string;
  /** Creation timestamp */
  createdAt: string;
  /** Last update timestamp */
  updatedAt: string;
  /** Full checkout URL */
  checkoutUrl?: string;
}

/**
 * Parameters for listing payment links
 */
export interface ListPaymentLinksRequest extends PaginationParams {
  /** Filter by link status */
  status?: PaymentLinkStatus;
  /** Filter by branch ID */
  branchId?: string;
  /** Filter links created after this date (ISO 8601) */
  createdAfter?: string;
  /** Filter links created before this date (ISO 8601) */
  createdBefore?: string;
}

/**
 * Response for listing payment links
 */
export type ListPaymentLinksResponse = PaginatedResponse<PaymentLinkResponse>;
