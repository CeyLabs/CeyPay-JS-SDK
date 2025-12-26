import * as crypto from 'crypto';

/**
 * Webhook signature verification utilities
 */

/**
 * Options for verifying webhook signatures
 */
export interface VerifyWebhookOptions {
  /** Signature from X-Webhook-Signature header */
  signature: string;
  /** Timestamp from X-Webhook-Timestamp header */
  timestamp: string;
  /** Raw request body as string (before JSON parsing) */
  rawBody: string;
  /** Webhook secret from GET /api/v1/webhooks/config */
  webhookSecret: string;
  /** Tolerance in milliseconds for timestamp validation (default: 5 minutes) */
  toleranceMs?: number;
}

/**
 * Verify webhook signature and timestamp
 *
 * This function verifies that:
 * 1. The webhook signature is valid (prevents tampering)
 * 2. The timestamp is recent (prevents replay attacks)
 *
 * @param options - Verification options
 * @returns true if signature and timestamp are valid, false otherwise
 *
 * @example
 * ```typescript
 * import { verifyWebhook } from 'ceypay-sdk';
 * import express from 'express';
 *
 * const app = express();
 *
 * // IMPORTANT: Use raw body for webhook endpoints
 * app.use('/webhooks/ceypay', express.raw({ type: 'application/json' }));
 *
 * app.post('/webhooks/ceypay', (req, res) => {
 *   const signature = req.headers['x-webhook-signature'] as string;
 *   const timestamp = req.headers['x-webhook-timestamp'] as string;
 *   const rawBody = req.body.toString('utf8');
 *   const webhookSecret = process.env.CEYPAY_WEBHOOK_SECRET;
 *
 *   const isValid = verifyWebhook({
 *     signature,
 *     timestamp,
 *     rawBody,
 *     webhookSecret
 *   });
 *
 *   if (!isValid) {
 *     return res.status(401).json({ error: 'Invalid signature' });
 *   }
 *
 *   // Process webhook
 *   const payload = JSON.parse(rawBody);
 *   console.log('Webhook received:', payload);
 *
 *   res.status(200).json({ received: true });
 * });
 * ```
 */
export function verifyWebhook(options: VerifyWebhookOptions): boolean {
  const { signature, timestamp, rawBody, webhookSecret, toleranceMs = 5 * 60 * 1000 } = options;

  // 1. Verify timestamp is recent (prevent replay attacks)
  const now = Date.now();
  const requestTime = parseInt(timestamp, 10);

  if (isNaN(requestTime)) {
    return false;
  }

  const timeDifference = Math.abs(now - requestTime);
  if (timeDifference > toleranceMs) {
    return false;
  }

  // 2. Verify signature
  const message = timestamp + rawBody;
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(message)
    .digest('hex');

  // Use timing-safe comparison to prevent timing attacks
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}

/**
 * Express-compatible webhook verification helper
 *
 * Convenience function for Express.js applications that automatically
 * extracts headers and body from the request object.
 *
 * @param req - Express request object (must use raw body parser)
 * @param webhookSecret - Webhook secret from configuration
 * @param toleranceMs - Timestamp tolerance in milliseconds (default: 5 minutes)
 * @returns true if signature and timestamp are valid, false otherwise
 *
 * @example
 * ```typescript
 * import { verifyWebhookExpress } from 'ceypay-sdk';
 * import express from 'express';
 *
 * const app = express();
 * const WEBHOOK_SECRET = process.env.CEYPAY_WEBHOOK_SECRET;
 *
 * // IMPORTANT: Use raw body parser for webhook endpoint
 * app.use('/webhooks/ceypay', express.raw({ type: 'application/json' }));
 *
 * app.post('/webhooks/ceypay', (req, res) => {
 *   // Verify webhook signature
 *   if (!verifyWebhookExpress(req, WEBHOOK_SECRET)) {
 *     return res.status(401).json({ error: 'Invalid webhook signature' });
 *   }
 *
 *   // Parse and process webhook
 *   const payload = JSON.parse(req.body.toString('utf8'));
 *
 *   switch (payload.status) {
 *     case 'PAID':
 *       console.log('Payment completed:', payload.paymentId);
 *       break;
 *     case 'EXPIRED':
 *       console.log('Payment expired:', payload.paymentId);
 *       break;
 *     case 'FAILED':
 *       console.log('Payment failed:', payload.paymentId);
 *       break;
 *   }
 *
 *   res.status(200).json({ received: true });
 * });
 * ```
 */
export function verifyWebhookExpress(
  req: any,
  webhookSecret: string,
  toleranceMs?: number
): boolean {
  const signature = req.headers['x-webhook-signature'];
  const timestamp = req.headers['x-webhook-timestamp'];

  if (!signature || !timestamp) {
    return false;
  }

  // Handle both Buffer and string body
  const rawBody = Buffer.isBuffer(req.body) ? req.body.toString('utf8') : String(req.body);

  return verifyWebhook({
    signature,
    timestamp,
    rawBody,
    webhookSecret,
    toleranceMs,
  });
}

/**
 * Compute webhook signature for testing purposes
 *
 * This function is useful for testing webhook handlers locally.
 * It generates the same signature that CeyPay would send.
 *
 * @param timestamp - Unix timestamp in milliseconds as string
 * @param body - Webhook payload as JSON string
 * @param webhookSecret - Webhook secret
 * @returns HMAC-SHA256 signature (hex-encoded)
 *
 * @example
 * ```typescript
 * import { computeWebhookSignature } from 'ceypay-sdk';
 *
 * // Simulate a webhook for testing
 * const timestamp = Date.now().toString();
 * const payload = {
 *   paymentId: '550e8400-e29b-41d4-a716-446655440000',
 *   status: 'PAID',
 *   amount: 100,
 *   currency: 'USDT'
 * };
 * const body = JSON.stringify(payload);
 * const webhookSecret = 'whsec_test_abc123';
 *
 * const signature = computeWebhookSignature(timestamp, body, webhookSecret);
 *
 * // Send test webhook to your endpoint
 * await fetch('http://localhost:3000/webhooks/ceypay', {
 *   method: 'POST',
 *   headers: {
 *     'Content-Type': 'application/json',
 *     'X-Webhook-Signature': signature,
 *     'X-Webhook-Timestamp': timestamp,
 *     'X-Webhook-Attempt': '1'
 *   },
 *   body
 * });
 * ```
 */
export function computeWebhookSignature(
  timestamp: string,
  body: string,
  webhookSecret: string
): string {
  const message = timestamp + body;
  return crypto.createHmac('sha256', webhookSecret).update(message).digest('hex');
}
