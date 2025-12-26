/**
 * Example: Update and delete payment links
 *
 * This example shows how to update payment link settings and deactivate them.
 * Run with: npx ts-node examples/update-payment-link.ts
 */

import { CeyPayClient, Currency, PaymentLinkStatus } from '../src';

async function main() {
  const client = new CeyPayClient({
    apiKey: process.env.CEYPAY_API_KEY || 'ak_live_xxx.sk_live_xxx',
  });

  try {
    // First, create a payment link
    console.log('Creating payment link...\n');
    const link = await client.paymentLinks.create({
      name: 'Test Product',
      description: 'Original description',
      amount: 29.99,
      currency: Currency.USDT,
      allowCustomAmount: false,
      reusable: true,
    });

    console.log('✅ Payment link created!');
    console.log('Link ID:', link.id);
    console.log('Original amount:', link.amount, link.currency);
    console.log('Original description:', link.description);

    // Update the payment link
    console.log('\n\nUpdating payment link...\n');
    const updated = await client.paymentLinks.update(link.id, {
      amount: 39.99, // New price
      description: 'Updated description with new pricing',
    });

    console.log('✅ Payment link updated!');
    console.log('New amount:', updated.amount, updated.currency);
    console.log('New description:', updated.description);
    console.log('Updated at:', updated.updatedAt);

    // Example: Extend expiration date
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 3); // 3 months from now

    console.log('\n\nExtending expiration date...\n');
    const extended = await client.paymentLinks.update(link.id, {
      expirationDate: futureDate.toISOString(),
    });

    console.log('✅ Expiration date extended!');
    console.log('New expiration:', extended.expirationDate);

    // Get the updated link
    console.log('\n\nFetching updated link...\n');
    const fetched = await client.paymentLinks.get(link.id);

    console.log('Link details:');
    console.log('Name:', fetched.name);
    console.log('Amount:', fetched.amount, fetched.currency);
    console.log('Status:', fetched.status);
    console.log('Used count:', fetched.usedCount);
    console.log('Reusable:', fetched.reusable);

    // Deactivate the payment link
    console.log('\n\nDeactivating payment link...\n');
    await client.paymentLinks.delete(link.id);

    console.log('✅ Payment link deactivated!');

    // Verify it's deactivated
    const deactivated = await client.paymentLinks.get(link.id);
    console.log('New status:', deactivated.status);

    if (deactivated.status === PaymentLinkStatus.DISABLED) {
      console.log('✓ Link is now disabled and can no longer be used');
    }
  } catch (error: any) {
    console.error('❌ Error:', error.message);

    if (error.statusCode === 404) {
      console.error('Payment link not found');
    } else if (error.validationErrors) {
      console.error('\nValidation errors:');
      error.validationErrors.forEach((err: any) => {
        console.error(`  - ${err.field}: ${err.message}`);
      });
    }
  }
}

main();
