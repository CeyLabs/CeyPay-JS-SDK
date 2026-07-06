import { PaginatedResponse, PaginationParams } from './common.types';

export interface Branch {
  id: string;
  merchantId: string;
  name: string;
  code: string;
  address?: string;
  city?: string;
  postalCode?: string;
  phone?: string;
  telegramGroupId?: string;
  usesMerchantBankAccount: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBranchParams {
  name: string;
  code: string;
  address?: string;
  city?: string;
  postalCode?: string;
  phone?: string;
  telegramGroupId?: string;
}

export type UpdateBranchParams = Partial<CreateBranchParams>;

export interface ListBranchesQuery extends PaginationParams {
  search?: string;
  isActive?: boolean;
}

export type BranchListResponse = PaginatedResponse<Branch>;
