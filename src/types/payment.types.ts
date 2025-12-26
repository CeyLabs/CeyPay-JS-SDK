import { Currency, PaymentStatus, PaginationParams, PaginatedResponse } from './common.types';

/**
 * Payment types and interfaces
 */

/**
 * Goods/product item in a payment
 */
export interface GoodsItem {
  /** Product/service name */
  name: string;
  /** Product/service description */
  description: string;
  /** Merchant Category Code (optional) */
  mccCode?: string;
}

/**
 * Customer billing information
 */
export interface CustomerBilling {
  /** Customer's first name */
  firstName?: string;
  /** Customer's last name */
  lastName?: string;
  /** Customer's email address */
  email?: string;
  /** Customer's phone number */
  phone?: string;
  /** Customer's street address */
  address?: string;
  /** Customer's city */
  city?: string;
  /** Customer's postal/zip code */
  postalCode?: string;
  /** Customer's country */
  country?: string;
}

/**
 * Fee breakdown for a payment
 */
export interface FeeBreakdown {
  /** Exchange fee percentage */
  exchangeFeePercentage: number;
  /** Exchange fee amount in USDT */
  exchangeFeeAmount: number;
  /** CeyPay platform fee percentage */
  ceypayFeePercentage: number;
  /** CeyPay platform fee amount in USDT */
  ceypayFeeAmount: number;
  /** Net amount after fees in USDT */
  netAmount: number;
}

/**
 * Request to create a new payment
 */
export interface CreatePaymentRequest {
  /** Payment amount */
  amount: number;
  /** Payment currency (USDT or LKR) */
  currency: Currency;
  /** List of goods/products being purchased */
  goods: GoodsItem[];
  /** Optional branch ID for multi-branch merchants */
  branchId?: string;
  /** Payment expiration time (ISO 8601 format) */
  orderExpireTime?: string;
  /** Payment provider (default: BYBIT) */
  provider?: 'BYBIT';
  /** POS device ID (if payment from device) */
  deviceId?: string;
  /** Webhook URL for payment status notifications */
  webhookUrl?: string;
  /** Customer billing information */
  customerBilling?: CustomerBilling;
}

/**
 * Payment response from API
 */
export interface PaymentResponse {
  /** Internal payment ID (UUID) */
  id: string;
  /** Merchant ID */
  merchantId: string;
  /** Branch ID (if applicable) */
  branchId?: string;
  /** Device ID (if from POS device) */
  deviceId?: string;
  /** Provider payment ID (e.g., Bybit Pay ID) */
  payId: string;
  /** Payment amount in USDT */
  amount: number;
  /** Payment currency (always USDT for provider) */
  currency: string;
  /** Current payment status */
  status: PaymentStatus;
  /** QR code content for payment (deeplink) */
  qrContent: string;
  /** Web checkout URL */
  checkoutLink: string;
  /** Goods/products list */
  goods?: GoodsItem[];
  /** Customer billing information */
  customerBilling?: CustomerBilling;
  /** Payment provider name */
  paymentProvider?: string;
  /** Payment expiration time */
  expireTime?: string;
  /** Payment creation timestamp */
  createdAt: string;
  /** Fee breakdown */
  feeBreakdown?: FeeBreakdown;
  /** Amount in USDT */
  usdtAmount?: number;
  /** Exchange rate snapshot (for LKR payments) */
  exchangeRateSnapshot?: number;
  /** LKR gross amount (before fees) */
  lkrGrossAmount?: number;
  /** LKR exchange fee amount */
  lkrExchangeFeeAmount?: number;
  /** LKR CeyPay fee amount */
  lkrCeypayFeeAmount?: number;
  /** LKR net amount (merchant receives) */
  lkrNetAmount?: number;
  /** Associated withdrawal request ID */
  withdrawalRequestId?: string;
  /** Associated payment link ID */
  paymentLinkId?: string;
  /** Settlement ID */
  settlementId?: string;
  /** Merchant trade number */
  paymentNo: string;
  /** Timestamp when payment was completed */
  paidAt?: string;
}

/**
 * Parameters for listing payments
 */
export interface ListPaymentsRequest extends PaginationParams {
  /** Filter by payment status */
  status?: PaymentStatus;
  /** Filter by branch ID */
  branchId?: string;
  /** Filter payments created after this date (ISO 8601) */
  createdAfter?: string;
  /** Filter payments created before this date (ISO 8601) */
  createdBefore?: string;
}

/**
 * Response for listing payments
 */
export type ListPaymentsResponse = PaginatedResponse<PaymentResponse>;
