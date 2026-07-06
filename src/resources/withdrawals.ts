import { HttpClient } from '../utils/http-client';
import { 
  WithdrawalRequest, 
  CreateWithdrawalParams, 
  ListWithdrawalsQuery, 
  WithdrawalListResponse 
} from '../types';

export class Withdrawals {
  constructor(private readonly client: HttpClient) {}

  /**
   * Create a withdrawal request
   * 
   * @param params Withdrawal creation parameters
   * @returns A promise that resolves to the created WithdrawalRequest
   */
  async create(params: CreateWithdrawalParams): Promise<WithdrawalRequest> {
    return this.client.request<WithdrawalRequest>('POST', '/v1/withdrawal', params);
  }

  /**
   * List withdrawal requests
   * 
   * @param query Pagination and filtering parameters
   * @returns A promise that resolves to a paginated list of WithdrawalRequests
   */
  async list(query?: ListWithdrawalsQuery): Promise<WithdrawalListResponse> {
    return this.client.request<WithdrawalListResponse>('GET', '/v1/withdrawal/list', undefined, query);
  }

  /**
   * Get a withdrawal request by ID
   * 
   * @param id Withdrawal request ID
   * @returns A promise that resolves to the WithdrawalRequest
   */
  async get(id: string): Promise<WithdrawalRequest> {
    return this.client.request<WithdrawalRequest>('GET', `/v1/withdrawal/${id}`);
  }
}
