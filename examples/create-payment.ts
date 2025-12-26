/**
 * Example: Create a payment
 *
 * This example shows how to create a payment and handle the response.
 * Run with: npx ts-node examples/create-payment.ts
 */

import { CeyPayClient, Currency, PaymentStatus } from '../src';

async function main() {
  // Initialize the CeyPay client with your API key
  const client = new CeyPayClient({
    apiKey: process.env.CEYPAY_API_KEY || 'ak_live_xxx.sk_live_xxx',
    debug: true, // Enable debug logging
  });

  try {
    // Create a payment
    console.log('Creating payment...');
    const payment = await client.payments.create({
      amount: 100,
      currency: Currency.USDT,
      goods: [
        {
          name: 'Premium Plan',
          description: 'Monthly subscription to premium features',
        },
      ],
      customerBilling: {
        email: 'customer@example.com',
        firstName: 'John',
        lastName: 'Doe',
      },
      webhookUrl: 'https://your-app.com/webhooks/ceypay', // Optional webhook URL
    });

    console.log('\n✅ Payment created successfully!\n');
    console.log('Payment ID:', payment.id);
    console.log('Payment No:', payment.paymentNo);
    console.log('Status:', payment.status);
    console.log('Amount:', payment.amount, payment.currency);
    console.log('\n📱 Checkout Options:');
    console.log('Checkout Link:', payment.checkoutLink);
    console.log('QR Code Content:', payment.qrContent);

    if (payment.feeBreakdown) {
      console.log('\n💰 Fee Breakdown:');
      console.log('Exchange Fee:', payment.feeBreakdown.exchangeFeeAmount, 'USDT');
      console.log('CeyPay Fee:', payment.feeBreakdown.ceypayFeeAmount, 'USDT');
      console.log('Net Amount:', payment.feeBreakdown.netAmount, 'USDT');
    }

    // Check rate limit info
    const rateLimit = client.getRateLimitInfo();
    if (rateLimit) {
      console.log('\n⚡ Rate Limit Info:');
      console.log(`${rateLimit.remaining}/${rateLimit.limit} requests remaining`);
      const resetDate = new Date(rateLimit.reset * 1000);
      console.log('Resets at:', resetDate.toLocaleString());
    }
  } catch (error: any) {
    console.error('❌ Error creating payment:', error.message);

    if (error.validationErrors) {
      console.error('\nValidation errors:');
      error.validationErrors.forEach((err: any) => {
        console.error(`  - ${err.field}: ${err.message}`);
      });
    }

    if (error.statusCode) {
      console.error('Status code:', error.statusCode);
    }
  }
}

main();
