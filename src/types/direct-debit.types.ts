import { PaginatedResponse, PaginationParams } from './common.types';

export type PaymentProvider = 'BINANCE_PAY' | 'BYBIT_PAY' | 'KUCOIN_PAY';

export interface Scenario {
  scenarioCode: string;
  provider: PaymentProvider;
  description?: string;
  singleUpperLimit?: number;
  isActive: boolean;
}

export interface DirectDebitContract {
  id: string;
  merchantId: string;
  branchId?: string;
  merchantContractCode: string;
  bizId?: string;
  provider: PaymentProvider;
  status: 'INITIATED' | 'SIGNED' | 'TERMINATED' | 'EXPIRED';
  currency: string;
  singleUpperLimit: number;
  contractEndTime?: string;
  webhookUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDirectDebitContractParams {
  branchId?: string;
  scenarioCode: string;
  currency: string;
  singleUpperLimit: number;
  contractEndTime?: string;
  webhookUrl?: string;
  returnUrl?: string;
}

export interface DirectDebitContractResponse {
  contract: DirectDebitContract;
  qrCode?: string;
  deepLink?: string;
}

export interface ListContractsQuery extends PaginationParams {
  status?: 'INITIATED' | 'SIGNED' | 'TERMINATED' | 'EXPIRED';
  branchId?: string;
  currency?: string;
  paymentProvider?: PaymentProvider;
  search?: string;
}

export type ContractListResponse = PaginatedResponse<DirectDebitContract>;

export interface TerminateContractParams {
  terminationNotes?: string;
}

export interface ExecuteDirectDebitPaymentParams {
  amount: number;
  currency: string;
  productName: string;
  productDetail?: string;
  webhookUrl?: string;
  customerBilling?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
}
