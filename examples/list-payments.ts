/**
 * Example: List payments with pagination
 *
 * This example shows how to list payments and iterate through pages.
 * Run with: npx ts-node examples/list-payments.ts
 */

import { CeyPayClient, PaymentStatus } from '../src';

async function main() {
  const client = new CeyPayClient({
    apiKey: process.env.CEYPAY_API_KEY || 'ak_live_xxx.sk_live_xxx',
  });

  try {
    // List first page of payments
    console.log('📄 Fetching payments...\n');
    const result = await client.payments.list({
      page: 1,
      pageSize: 10,
    });

    console.log('Total payments:', result.pagination.total);
    console.log('Total pages:', result.pagination.totalPages);
    console.log('Current page:', result.pagination.page);
    console.log('Page size:', result.pagination.pageSize);
    console.log('\nPayments:\n');

    result.data.forEach((payment, index) => {
      console.log(`${index + 1}. Payment ID: ${payment.id}`);
      console.log(`   Status: ${payment.status}`);
      console.log(`   Amount: ${payment.amount} ${payment.currency}`);
      console.log(`   Created: ${payment.createdAt}`);
      if (payment.status === PaymentStatus.PAID && payment.paidAt) {
        console.log(`   Paid At: ${payment.paidAt}`);
      }
      console.log();
    });

    // Example: Filter by status
    console.log('\n💰 Fetching only PAID payments...\n');
    const paidPayments = await client.payments.list({
      status: PaymentStatus.PAID,
      page: 1,
      pageSize: 5,
    });

    console.log('Paid payments count:', paidPayments.pagination.total);
    paidPayments.data.forEach((payment) => {
      console.log(`✅ ${payment.id} - ${payment.amount} ${payment.currency}`);
    });

    // Example: Filter by date range
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    console.log('\n📅 Fetching payments from the last 7 days...\n');
    const recentPayments = await client.payments.list({
      createdAfter: oneWeekAgo.toISOString(),
      page: 1,
      pageSize: 10,
    });

    console.log('Recent payments:', recentPayments.pagination.total);
  } catch (error: any) {
    console.error('❌ Error listing payments:', error.message);
    if (error.statusCode) {
      console.error('Status code:', error.statusCode);
    }
  }
}

main();
