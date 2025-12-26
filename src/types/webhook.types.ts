import { PaymentStatus } from './common.types';

/**
 * Webhook types and interfaces
 */

/**
 * Webhook event payload structure
 */
export interface WebhookPayload {
  /** Internal payment ID */
  paymentId: string;
  /** Provider payment ID (e.g., Bybit Pay ID) */
  payId: string;
  /** Merchant trade number */
  merchantTradeNo: string;
  /** Current payment status */
  status: PaymentStatus;
  /** Payment amount */
  amount: number;
  /** Payment currency */
  currency: string;
  /** Timestamp when payment was completed (for PAID status) */
  paidAt?: string;
  /** Timestamp when payment expired (for EXPIRED status) */
  expiredAt?: string;
  /** Timestamp when payment failed (for FAILED status) */
  failedAt?: string;
  /** Event timestamp */
  timestamp: string;
}

/**
 * Webhook configuration
 */
export interface WebhookConfig {
  /** Webhook secret for signature verification */
  webhookSecret: string;
  /** Header name for signature (X-Webhook-Signature) */
  signatureHeader: string;
  /** Header name for timestamp (X-Webhook-Timestamp) */
  timestampHeader: string;
}

/**
 * Request to test webhook delivery
 */
export interface WebhookTestRequest {
  /** Webhook URL to test */
  webhookUrl: string;
}

/**
 * Response from webhook test
 */
export interface WebhookTestResponse {
  /** Whether test was successful */
  success: boolean;
  /** Test result message */
  message: string;
  /** Webhook delivery time in milliseconds */
  deliveryTime: number;
}

/**
 * Webhook headers received in webhook requests
 */
export interface WebhookHeaders {
  /** HMAC signature for verification */
  'x-webhook-signature': string;
  /** Unix timestamp in milliseconds */
  'x-webhook-timestamp': string;
  /** Delivery attempt number (1-5) */
  'x-webhook-attempt': string;
  /** Content type (application/json) */
  'content-type': string;
}
