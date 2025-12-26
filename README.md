# CeyPay JavaScript/TypeScript SDK

Official TypeScript/JavaScript SDK for the [CeyPay](https://ceypay.io) Payment API. Accept cryptocurrency payments with ease.

[![npm version](https://img.shields.io/npm/v/@ceypay/sdk.svg)](https://www.npmjs.com/package/@ceypay/sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🔐 **HMAC-SHA256 Authentication** - Secure API request signing
- 💳 **Payment Management** - Create and track crypto payments
- 🔗 **Payment Links** - Generate reusable payment links
- 🪝 **Webhook Verification** - Built-in webhook signature verification
- 📘 **Full TypeScript Support** - Complete type definitions
- ⚡ **Rate Limit Tracking** - Monitor API rate limits
- 🎯 **Error Handling** - Comprehensive error types
- 📦 **Modern ESM/CJS** - Works with both module systems

## Installation

```bash
npm install @ceypay/sdk
```

Or with yarn:

```bash
yarn add @ceypay/sdk
```

Or with pnpm:

```bash
pnpm add @ceypay/sdk
```

## Quick Start

```typescript
import { CeyPayClient, Currency } from '@ceypay/sdk';

// Initialize the client
const client = new CeyPayClient({
  apiKey: process.env.CEYPAY_API_KEY, // Get from https://merchant.ceypay.io
});

// Create a payment
const payment = await client.payments.create({
  amount: 100,
  currency: Currency.USDT,
  goods: [
    {
      name: 'Premium Plan',
      description: 'Monthly subscription',
    },
  ],
  customerBilling: {
    email: 'customer@example.com',
    firstName: 'John',
    lastName: 'Doe',
  },
});

console.log('Checkout link:', payment.checkoutLink);
console.log('QR code:', payment.qrContent);
```

## Table of Contents

- [Authentication](#authentication)
- [Usage](#usage)
  - [Creating Payments](#creating-payments)
  - [Retrieving Payments](#retrieving-payments)
  - [Listing Payments](#listing-payments)
  - [Payment Links](#payment-links)
  - [Webhook Verification](#webhook-verification)
- [Configuration](#configuration)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [TypeScript Support](#typescript-support)
- [Examples](#examples)
- [API Reference](#api-reference)
- [Support](#support)

## Authentication

Get your API key from the [CeyPay Dashboard](https://merchant.ceypay.io):

1. Log in to your merchant account
2. Navigate to **Settings** → **API Keys**
3. Click **Generate New API Key**
4. Copy and securely store your API key

⚠️ **Important**: Never expose your API key in client-side code. The SDK is designed for server-side use only.

```typescript
import { CeyPayClient } from '@ceypay/sdk';

const client = new CeyPayClient({
  apiKey: 'ak_live_abc123.sk_live_xyz789',
});
```

## Usage

### Creating Payments

```typescript
import { CeyPayClient, Currency } from '@ceypay/sdk';

const client = new CeyPayClient({
  apiKey: process.env.CEYPAY_API_KEY,
});

const payment = await client.payments.create({
  amount: 149.99,
  currency: Currency.USDT, // or Currency.LKR
  goods: [
    {
      name: 'Premium Plan - Annual',
      description: 'One year subscription to premium features',
    },
  ],
  customerBilling: {
    email: 'customer@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1234567890',
  },
  webhookUrl: 'https://your-app.com/webhooks/ceypay', // Optional
});

// Redirect customer to checkout
console.log('Redirect to:', payment.checkoutLink);

// Or display QR code
console.log('QR code content:', payment.qrContent);
```

### Retrieving Payments

```typescript
// Get payment by ID
const payment = await client.payments.get('550e8400-e29b-41d4-a716-446655440000');

console.log('Status:', payment.status); // INITIATED, PAID, EXPIRED, FAILED
console.log('Amount:', payment.amount, payment.currency);

if (payment.status === 'PAID') {
  console.log('Payment completed at:', payment.paidAt);
  console.log('Fee breakdown:', payment.feeBreakdown);
}
```

### Listing Payments

```typescript
// List all payments with pagination
const result = await client.payments.list({
  page: 1,
  pageSize: 20,
});

console.log('Total:', result.pagination.total);
console.log('Payments:', result.data);

// Filter by status
const paidPayments = await client.payments.list({
  status: PaymentStatus.PAID,
  page: 1,
  pageSize: 50,
});

// Filter by date range
const recentPayments = await client.payments.list({
  createdAfter: '2025-01-01T00:00:00Z',
  createdBefore: '2025-01-31T23:59:59Z',
});

// Filter by branch (for multi-branch merchants)
const branchPayments = await client.payments.list({
  branchId: 'branch-id-here',
});
```

### Payment Links

Create reusable payment links for products, subscriptions, or donations:

```typescript
// Fixed amount payment link
const link = await client.paymentLinks.create({
  name: 'Premium Plan - Monthly',
  description: 'Monthly subscription',
  amount: 49.99,
  currency: Currency.USDT,
  allowCustomAmount: false,
  reusable: true,
});

console.log('Share this link:', link.checkoutUrl);

// Custom amount payment link (donations)
const donationLink = await client.paymentLinks.create({
  name: 'Support Us',
  description: 'Make a donation',
  currency: Currency.USDT,
  allowCustomAmount: true,
  minAmount: 5,
  maxAmount: 1000,
  reusable: true,
});

// Single-use payment link with expiration
const invoiceLink = await client.paymentLinks.create({
  name: 'Invoice #12345',
  description: 'Web development services',
  amount: 500,
  currency: Currency.USDT,
  allowCustomAmount: false,
  reusable: false,
  expirationDate: '2025-12-31T23:59:59Z',
});

// Update payment link
const updated = await client.paymentLinks.update(link.id, {
  amount: 59.99,
  description: 'Updated pricing',
});

// Deactivate payment link
await client.paymentLinks.delete(link.id);

// List payment links
const links = await client.paymentLinks.list({
  status: PaymentLinkStatus.ACTIVE,
  page: 1,
  pageSize: 10,
});
```

### Webhook Verification

Verify webhook signatures to ensure authenticity:

```typescript
import express from 'express';
import { verifyWebhookExpress, WebhookPayload } from '@ceypay/sdk';

const app = express();

// IMPORTANT: Use raw body parser for webhook endpoint
app.use('/webhooks/ceypay', express.raw({ type: 'application/json' }));

app.post('/webhooks/ceypay', (req, res) => {
  // Get webhook secret from config endpoint
  const webhookSecret = process.env.CEYPAY_WEBHOOK_SECRET;

  // Verify signature
  if (!verifyWebhookExpress(req, webhookSecret)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // Parse and process webhook
  const payload: WebhookPayload = JSON.parse(req.body.toString('utf8'));

  switch (payload.status) {
    case 'PAID':
      // Fulfill order
      console.log('Payment completed:', payload.paymentId);
      break;
    case 'EXPIRED':
      // Cancel order
      console.log('Payment expired:', payload.paymentId);
      break;
    case 'FAILED':
      // Notify customer
      console.log('Payment failed:', payload.paymentId);
      break;
  }

  res.status(200).json({ received: true });
});

app.listen(3000);
```

#### Get Webhook Secret

```typescript
const config = await client.webhooks.getConfig();
console.log('Webhook secret:', config.webhookSecret);
```

#### Test Webhook Delivery

```typescript
const result = await client.webhooks.test('https://your-app.com/webhooks/ceypay');

if (result.success) {
  console.log('Webhook test successful!');
  console.log('Delivery time:', result.deliveryTime, 'ms');
}
```

## Configuration

```typescript
const client = new CeyPayClient({
  apiKey: 'ak_live_xxx.sk_live_xxx', // Required
  baseUrl: 'https://api.ceypay.io', // Optional (default)
  timeout: 30000, // Optional timeout in ms (default: 30000)
  debug: false, // Optional debug logging (default: false)
});
```

## Error Handling

The SDK provides typed error classes for different scenarios:

```typescript
import {
  CeyPayClient,
  AuthenticationError,
  ValidationError,
  NotFoundError,
  RateLimitError,
} from '@ceypay/sdk';

try {
  const payment = await client.payments.create(data);
} catch (error) {
  if (error instanceof ValidationError) {
    // Handle validation errors (400)
    console.error('Validation failed:');
    error.validationErrors?.forEach((err) => {
      console.error(`  ${err.field}: ${err.message}`);
    });
  } else if (error instanceof AuthenticationError) {
    // Handle authentication errors (401)
    console.error('Invalid API key or signature');
  } else if (error instanceof NotFoundError) {
    // Handle not found errors (404)
    console.error('Resource not found');
  } else if (error instanceof RateLimitError) {
    // Handle rate limit errors (429)
    console.error('Rate limit exceeded');
    console.error('Retry after:', error.retryAfter, 'seconds');
  } else {
    // Handle other errors
    console.error('Error:', error.message);
  }
}
```

### Available Error Types

- `CeyPayError` - Base error class
- `AuthenticationError` - 401 Unauthorized
- `ValidationError` - 400 Bad Request (includes validation details)
- `NotFoundError` - 404 Not Found
- `ForbiddenError` - 403 Forbidden
- `ConflictError` - 409 Conflict
- `GoneError` - 410 Gone
- `UnprocessableEntityError` - 422 Unprocessable Entity
- `RateLimitError` - 429 Too Many Requests (includes retryAfter)
- `InternalServerError` - 500 Internal Server Error
- `BadGatewayError` - 502 Bad Gateway
- `ApiError` - Generic API error
- `NetworkError` - Network/connection error

## Rate Limiting

Monitor your API rate limits:

```typescript
// Make an API call
await client.payments.list();

// Check rate limit info
const rateLimit = client.getRateLimitInfo();

if (rateLimit) {
  console.log(`${rateLimit.remaining}/${rateLimit.limit} requests remaining`);

  const resetDate = new Date(rateLimit.reset * 1000);
  console.log('Rate limit resets at:', resetDate);

  if (rateLimit.remaining < 10) {
    console.warn('Approaching rate limit!');
  }
}
```

### Rate Limits by Endpoint

| Endpoint                         | Limit          |
| -------------------------------- | -------------- |
| `POST /api/v1/payments`          | 100 req/min    |
| `GET /api/v1/payments/:id`       | 300 req/min    |
| `GET /api/v1/payments`           | 200 req/min    |
| `POST /api/v1/payment-links`     | 50 req/min     |
| `GET /api/v1/payment-links`      | 100 req/min    |
| `PATCH /api/v1/payment-links/:id`| 50 req/min     |
| `DELETE /api/v1/payment-links/:id`| 50 req/min    |
| `GET /api/v1/webhooks/config`    | 20 req/min     |
| `POST /api/v1/webhooks/test`     | 5 req/min      |

## TypeScript Support

The SDK is written in TypeScript and provides comprehensive type definitions:

```typescript
import {
  CeyPayClient,
  CreatePaymentRequest,
  PaymentResponse,
  Currency,
  PaymentStatus,
  WebhookPayload,
} from '@ceypay/sdk';

const request: CreatePaymentRequest = {
  amount: 100,
  currency: Currency.USDT,
  goods: [{ name: 'Product', description: 'Description' }],
};

const payment: PaymentResponse = await client.payments.create(request);

// TypeScript will autocomplete and type-check everything
if (payment.status === PaymentStatus.PAID) {
  console.log('Payment successful!');
}
```

## Examples

The `examples/` directory contains complete working examples:

- **[create-payment.ts](examples/create-payment.ts)** - Create a payment with customer billing
- **[list-payments.ts](examples/list-payments.ts)** - List and filter payments with pagination
- **[create-payment-link.ts](examples/create-payment-link.ts)** - Create various types of payment links
- **[update-payment-link.ts](examples/update-payment-link.ts)** - Update and deactivate payment links
- **[webhook-handler.ts](examples/webhook-handler.ts)** - Express webhook handler with signature verification

Run examples:

```bash
npx ts-node examples/create-payment.ts
```

## API Reference

### Client

#### `new CeyPayClient(config)`

Create a new CeyPay client instance.

**Parameters:**
- `config.apiKey` (string, required) - Your CeyPay API key
- `config.baseUrl` (string, optional) - API base URL (default: `https://api.ceypay.io`)
- `config.timeout` (number, optional) - Request timeout in ms (default: 30000)
- `config.debug` (boolean, optional) - Enable debug logging (default: false)

### Payments

#### `client.payments.create(data)`

Create a new payment.

**Returns:** `Promise<PaymentResponse>`

#### `client.payments.get(id)`

Retrieve a payment by ID.

**Returns:** `Promise<PaymentResponse>`

#### `client.payments.list(params?)`

List payments with optional filtering and pagination.

**Returns:** `Promise<ListPaymentsResponse>`

### Payment Links

#### `client.paymentLinks.create(data)`

Create a new payment link.

**Returns:** `Promise<PaymentLinkResponse>`

#### `client.paymentLinks.get(id)`

Retrieve a payment link by ID.

**Returns:** `Promise<PaymentLinkResponse>`

#### `client.paymentLinks.list(params?)`

List payment links with optional filtering.

**Returns:** `Promise<ListPaymentLinksResponse>`

#### `client.paymentLinks.update(id, data)`

Update a payment link.

**Returns:** `Promise<PaymentLinkResponse>`

#### `client.paymentLinks.delete(id)`

Deactivate a payment link.

**Returns:** `Promise<void>`

### Webhooks

#### `client.webhooks.getConfig()`

Get webhook configuration including secret.

**Returns:** `Promise<WebhookConfig>`

#### `client.webhooks.test(webhookUrl)`

Test webhook delivery to your endpoint.

**Returns:** `Promise<WebhookTestResponse>`

### Webhook Utilities

#### `verifyWebhook(options)`

Verify webhook signature and timestamp.

**Returns:** `boolean`

#### `verifyWebhookExpress(req, webhookSecret)`

Express-compatible webhook verification helper.

**Returns:** `boolean`

## Support

- **Documentation**: [https://docs.ceypay.io](https://docs.ceypay.io)
- **Email**: support@ceypay.io
- **Status**: [https://status.ceypay.io](https://status.ceypay.io)
- **GitHub Issues**: [https://github.com/CeyLabs/CeyPay-JS-SDK/issues](https://github.com/CeyLabs/CeyPay-JS-SDK/issues)

## License

MIT © CeyPay

---

Made with ❤️ by the CeyPay team
