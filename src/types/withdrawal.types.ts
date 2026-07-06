import { PaginatedResponse, PaginationParams } from './common.types';

export interface WithdrawalRequest {
  id: string;
  merchantId: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  rejectionReason?: string;
  transactionHash?: string;
  fees: number;
  netAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWithdrawalParams {
  currency: string;
}

export interface ListWithdrawalsQuery extends PaginationParams {
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  currency?: string;
}

export type WithdrawalListResponse = PaginatedResponse<WithdrawalRequest>;
