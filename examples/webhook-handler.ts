/**
 * Example: Webhook handler with Express
 *
 * This example shows how to handle CeyPay webhooks with signature verification.
 * Run with: npx ts-node examples/webhook-handler.ts
 */

import express from 'express';
import { CeyPayClient, verifyWebhookExpress, PaymentStatus, WebhookPayload } from '../src';

const app = express();
const PORT = 3000;

// Your webhook secret (get from: client.webhooks.getConfig())
const WEBHOOK_SECRET = process.env.CEYPAY_WEBHOOK_SECRET || 'whsec_xxx';

// IMPORTANT: Use raw body parser for webhook endpoint
// This is required for signature verification
app.use('/webhooks/ceypay', express.raw({ type: 'application/json' }));

// Regular JSON parser for other endpoints
app.use(express.json());

// In-memory store for processed webhooks (use database in production)
const processedWebhooks = new Set<string>();

/**
 * Webhook endpoint
 */
app.post('/webhooks/ceypay', (req, res) => {
  console.log('\n📨 Webhook received');

  // 1. Verify webhook signature
  if (!verifyWebhookExpress(req, WEBHOOK_SECRET)) {
    console.error('❌ Invalid webhook signature');
    return res.status(401).json({ error: 'Invalid signature' });
  }

  console.log('✅ Signature verified');

  // 2. Parse webhook payload
  const rawBody = req.body.toString('utf8');
  const payload: WebhookPayload = JSON.parse(rawBody);

  console.log('Payment ID:', payload.paymentId);
  console.log('Status:', payload.status);
  console.log('Amount:', payload.amount, payload.currency);

  // 3. Idempotency check (prevent duplicate processing)
  if (processedWebhooks.has(payload.paymentId)) {
    console.log('⚠️  Webhook already processed (idempotency check)');
    return res.status(200).json({ received: true, note: 'Already processed' });
  }

  // 4. Process webhook based on status
  try {
    switch (payload.status) {
      case PaymentStatus.INITIATED:
        handlePaymentInitiated(payload);
        break;

      case PaymentStatus.PAID:
        handlePaymentPaid(payload);
        break;

      case PaymentStatus.EXPIRED:
        handlePaymentExpired(payload);
        break;

      case PaymentStatus.FAILED:
        handlePaymentFailed(payload);
        break;

      default:
        console.log('Unknown payment status:', payload.status);
    }

    // Mark as processed
    processedWebhooks.add(payload.paymentId);

    // 5. Always respond with 200 OK
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);

    // Still return 200 to acknowledge receipt
    // Log the error for investigation
    res.status(200).json({ received: true, error: 'Processing error' });
  }
});

/**
 * Handle payment initiated event
 */
function handlePaymentInitiated(payload: WebhookPayload) {
  console.log('🟡 Payment initiated');
  console.log('Customer can now complete payment');
  // Update order status to "awaiting_payment"
}

/**
 * Handle payment completed event
 */
function handlePaymentPaid(payload: WebhookPayload) {
  console.log('✅ Payment completed!');
  console.log('Paid at:', payload.paidAt);

  // Actions to take:
  // 1. Update order status to "paid"
  // 2. Fulfill order (ship product, activate subscription, etc.)
  // 3. Send confirmation email to customer
  // 4. Trigger any post-payment workflows

  console.log('📦 Fulfilling order...');
  console.log('📧 Sending confirmation email...');
}

/**
 * Handle payment expired event
 */
function handlePaymentExpired(payload: WebhookPayload) {
  console.log('⏰ Payment expired');
  console.log('Expired at:', payload.expiredAt);

  // Actions to take:
  // 1. Update order status to "expired"
  // 2. Release reserved inventory
  // 3. Optionally send reminder email to customer

  console.log('📦 Releasing inventory...');
}

/**
 * Handle payment failed event
 */
function handlePaymentFailed(payload: WebhookPayload) {
  console.log('❌ Payment failed');
  console.log('Failed at:', payload.failedAt);

  // Actions to take:
  // 1. Update order status to "failed"
  // 2. Notify customer about failure
  // 3. Provide option to retry payment

  console.log('📧 Notifying customer...');
}

/**
 * Test endpoint to verify webhook configuration
 */
app.get('/test-webhook', async (req, res) => {
  try {
    const client = new CeyPayClient({
      apiKey: process.env.CEYPAY_API_KEY || 'ak_live_xxx.sk_live_xxx',
    });

    // Get webhook configuration
    const config = await client.webhooks.getConfig();
    console.log('\nWebhook configuration:');
    console.log('Secret:', config.webhookSecret.substring(0, 20) + '...');
    console.log('Signature header:', config.signatureHeader);
    console.log('Timestamp header:', config.timestampHeader);

    // Test webhook delivery
    const webhookUrl = `http://localhost:${PORT}/webhooks/ceypay`;
    console.log('\nTesting webhook delivery to:', webhookUrl);

    const result = await client.webhooks.test(webhookUrl);

    if (result.success) {
      console.log('✅ Webhook test successful!');
      console.log('Delivery time:', result.deliveryTime, 'ms');
      res.json({ success: true, result });
    } else {
      console.log('❌ Webhook test failed:', result.message);
      res.json({ success: false, result });
    }
  } catch (error: any) {
    console.error('Error testing webhook:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Webhook server running on http://localhost:${PORT}`);
  console.log(`\nWebhook endpoint: http://localhost:${PORT}/webhooks/ceypay`);
  console.log(`Test endpoint: http://localhost:${PORT}/test-webhook`);
  console.log('\nTo expose locally for testing, use ngrok:');
  console.log(`  ngrok http ${PORT}`);
  console.log('\nWaiting for webhooks...\n');
});
