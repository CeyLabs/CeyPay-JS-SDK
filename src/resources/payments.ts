import { HttpClient } from '../utils/http-client';
import {
  CreatePaymentRequest,
  PaymentResponse,
  ListPaymentsRequest,
  ListPaymentsResponse,
} from '../types';

/**
 * Payments resource for managing payment operations
 */
export class Payments {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Create a new payment
   *
   * @param data - Payment creation request data
   * @returns Created payment details including checkout link and QR code
   *
   * @example
   * ```typescript
   * const payment = await client.payments.create({
   *   amount: 100,
   *   currency: Currency.USDT,
   *   goods: [
   *     {
   *       name: 'Premium Plan',
   *       description: 'Monthly subscription'
   *     }
   *   ],
   *   customerBilling: {
   *     email: 'customer@example.com',
   *     firstName: 'John',
   *     lastName: 'Doe'
   *   }
   * });
   *
   * console.log('Checkout link:', payment.checkoutLink);
   * console.log('QR code:', payment.qrContent);
   * ```
   */
  async create(data: CreatePaymentRequest): Promise<PaymentResponse> {
    return this.httpClient.request<PaymentResponse>('POST', '/api/v1/payments', data);
  }

  /**
   * Retrieve a payment by ID
   *
   * @param id - Payment ID (UUID)
   * @returns Payment details
   *
   * @example
   * ```typescript
   * const payment = await client.payments.get('550e8400-e29b-41d4-a716-446655440000');
   * console.log('Payment status:', payment.status);
   * console.log('Amount:', payment.amount, payment.currency);
   * ```
   */
  async get(id: string): Promise<PaymentResponse> {
    return this.httpClient.request<PaymentResponse>('GET', `/api/v1/payments/${id}`);
  }

  /**
   * List all payments with optional filtering and pagination
   *
   * @param params - List parameters (pagination, filters)
   * @returns Paginated list of payments
   *
   * @example
   * ```typescript
   * // List first page
   * const result = await client.payments.list({
   *   page: 1,
   *   pageSize: 20
   * });
   *
   * console.log('Total payments:', result.pagination.total);
   * console.log('Payments:', result.data);
   *
   * // Filter by status
   * const paidPayments = await client.payments.list({
   *   status: PaymentStatus.PAID,
   *   page: 1,
   *   pageSize: 50
   * });
   *
   * // Filter by date range
   * const recentPayments = await client.payments.list({
   *   createdAfter: '2025-01-01T00:00:00Z',
   *   createdBefore: '2025-01-31T23:59:59Z'
   * });
   * ```
   */
  async list(params?: ListPaymentsRequest): Promise<ListPaymentsResponse> {
    return this.httpClient.request<ListPaymentsResponse>('GET', '/api/v1/payments', undefined, params);
  }
}
