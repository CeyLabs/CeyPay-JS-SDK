import { HttpClient } from '../utils/http-client';
import {
  CreatePaymentLinkRequest,
  UpdatePaymentLinkRequest,
  PaymentLinkResponse,
  ListPaymentLinksRequest,
  ListPaymentLinksResponse,
} from '../types';

/**
 * Payment Links resource for managing reusable payment links
 */
export class PaymentLinks {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Create a new payment link
   *
   * @param data - Payment link creation request data
   * @returns Created payment link details including shareable URL
   *
   * @example
   * ```typescript
   * // Fixed amount payment link
   * const link = await client.paymentLinks.create({
   *   name: 'Premium Plan - Monthly',
   *   description: 'Subscription to premium features',
   *   amount: 49.99,
   *   currency: Currency.USDT,
   *   allowCustomAmount: false,
   *   reusable: true
   * });
   *
   * console.log('Payment link:', link.checkoutUrl);
   * console.log('Slug:', link.slug);
   *
   * // Custom amount payment link
   * const donationLink = await client.paymentLinks.create({
   *   name: 'Support Us',
   *   description: 'Make a donation',
   *   currency: Currency.USDT,
   *   allowCustomAmount: true,
   *   minAmount: 5,
   *   maxAmount: 1000,
   *   reusable: true
   * });
   * ```
   */
  async create(data: CreatePaymentLinkRequest): Promise<PaymentLinkResponse> {
    return this.httpClient.request<PaymentLinkResponse>('POST', '/api/v1/payment-links', data);
  }

  /**
   * Retrieve a payment link by ID
   *
   * @param id - Payment link ID (UUID)
   * @returns Payment link details
   *
   * @example
   * ```typescript
   * const link = await client.paymentLinks.get('550e8400-e29b-41d4-a716-446655440000');
   * console.log('Link name:', link.name);
   * console.log('Used count:', link.usedCount);
   * console.log('Status:', link.status);
   * ```
   */
  async get(id: string): Promise<PaymentLinkResponse> {
    return this.httpClient.request<PaymentLinkResponse>('GET', `/api/v1/payment-links/${id}`);
  }

  /**
   * List all payment links with optional filtering and pagination
   *
   * @param params - List parameters (pagination, filters)
   * @returns Paginated list of payment links
   *
   * @example
   * ```typescript
   * // List all active links
   * const result = await client.paymentLinks.list({
   *   status: PaymentLinkStatus.ACTIVE,
   *   page: 1,
   *   pageSize: 20
   * });
   *
   * console.log('Active links:', result.data.length);
   * result.data.forEach(link => {
   *   console.log(`${link.name}: ${link.checkoutUrl}`);
   * });
   * ```
   */
  async list(params?: ListPaymentLinksRequest): Promise<ListPaymentLinksResponse> {
    return this.httpClient.request<ListPaymentLinksResponse>(
      'GET',
      '/api/v1/payment-links',
      undefined,
      params
    );
  }

  /**
   * Update an existing payment link
   *
   * @param id - Payment link ID (UUID)
   * @param data - Update request data
   * @returns Updated payment link details
   *
   * @example
   * ```typescript
   * // Update link amount
   * const updated = await client.paymentLinks.update(
   *   '550e8400-e29b-41d4-a716-446655440000',
   *   {
   *     amount: 59.99,
   *     description: 'Updated pricing for premium plan'
   *   }
   * );
   *
   * // Extend expiration date
   * const extended = await client.paymentLinks.update(linkId, {
   *   expirationDate: '2025-12-31T23:59:59Z'
   * });
   * ```
   */
  async update(id: string, data: UpdatePaymentLinkRequest): Promise<PaymentLinkResponse> {
    return this.httpClient.request<PaymentLinkResponse>(
      'PATCH',
      `/api/v1/payment-links/${id}`,
      data
    );
  }

  /**
   * Deactivate a payment link
   *
   * @param id - Payment link ID (UUID)
   * @returns void
   *
   * @example
   * ```typescript
   * // Deactivate a payment link
   * await client.paymentLinks.delete('550e8400-e29b-41d4-a716-446655440000');
   * console.log('Payment link deactivated');
   * ```
   */
  async delete(id: string): Promise<void> {
    await this.httpClient.request<void>('DELETE', `/api/v1/payment-links/${id}`);
  }
}
