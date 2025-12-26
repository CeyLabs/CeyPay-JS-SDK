/**
 * Example: Create payment links
 *
 * This example shows how to create both fixed-amount and custom-amount payment links.
 * Run with: npx ts-node examples/create-payment-link.ts
 */

import { CeyPayClient, Currency } from '../src';

async function main() {
  const client = new CeyPayClient({
    apiKey: process.env.CEYPAY_API_KEY || 'ak_live_xxx.sk_live_xxx',
  });

  try {
    // Example 1: Fixed amount payment link
    console.log('Creating fixed amount payment link...\n');
    const fixedLink = await client.paymentLinks.create({
      name: 'Premium Plan - Monthly',
      description: 'Monthly subscription to premium features',
      amount: 49.99,
      currency: Currency.USDT,
      allowCustomAmount: false,
      reusable: true, // Can be used multiple times
    });

    console.log('✅ Fixed amount link created!\n');
    console.log('Link ID:', fixedLink.id);
    console.log('Slug:', fixedLink.slug);
    console.log('Checkout URL:', fixedLink.checkoutUrl);
    console.log('Amount:', fixedLink.amount, fixedLink.currency);
    console.log('Reusable:', fixedLink.reusable);
    console.log('Status:', fixedLink.status);

    // Example 2: Custom amount payment link (for donations, tips, etc.)
    console.log('\n\nCreating custom amount payment link...\n');
    const customLink = await client.paymentLinks.create({
      name: 'Support Our Work',
      description: 'Make a donation to support our project',
      currency: Currency.USDT,
      allowCustomAmount: true,
      minAmount: 5, // Minimum $5
      maxAmount: 1000, // Maximum $1000
      reusable: true,
    });

    console.log('✅ Custom amount link created!\n');
    console.log('Link ID:', customLink.id);
    console.log('Slug:', customLink.slug);
    console.log('Checkout URL:', customLink.checkoutUrl);
    console.log('Amount Range:', `${customLink.minAmount} - ${customLink.maxAmount}`, customLink.currency);
    console.log('Allow Custom Amount:', customLink.allowCustomAmount);

    // Example 3: Single-use payment link with expiration
    console.log('\n\nCreating single-use payment link with expiration...\n');
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7); // Expires in 7 days

    const singleUseLink = await client.paymentLinks.create({
      name: 'Invoice #12345',
      description: 'Payment for web development services',
      amount: 500,
      currency: Currency.USDT,
      allowCustomAmount: false,
      reusable: false, // Single use only
      expirationDate: expirationDate.toISOString(),
    });

    console.log('✅ Single-use link created!\n');
    console.log('Link ID:', singleUseLink.id);
    console.log('Checkout URL:', singleUseLink.checkoutUrl);
    console.log('Reusable:', singleUseLink.reusable);
    console.log('Expires At:', singleUseLink.expirationDate);

    // List all payment links
    console.log('\n\n📋 Listing all payment links...\n');
    const allLinks = await client.paymentLinks.list({
      page: 1,
      pageSize: 10,
    });

    console.log('Total links:', allLinks.pagination.total);
    allLinks.data.forEach((link, index) => {
      console.log(`\n${index + 1}. ${link.name}`);
      console.log(`   ID: ${link.id}`);
      console.log(`   URL: ${link.checkoutUrl}`);
      console.log(`   Status: ${link.status}`);
      console.log(`   Used: ${link.usedCount} times`);
    });
  } catch (error: any) {
    console.error('❌ Error:', error.message);

    if (error.validationErrors) {
      console.error('\nValidation errors:');
      error.validationErrors.forEach((err: any) => {
        console.error(`  - ${err.field}: ${err.message}`);
      });
    }
  }
}

main();
