import { HttpClient } from '../utils/http-client';
import { 
  Scenario, 
  DirectDebitContractResponse, 
  CreateDirectDebitContractParams, 
  ListContractsQuery, 
  ContractListResponse,
  TerminateContractParams,
  ExecuteDirectDebitPaymentParams
} from '../types';
import { PaymentResponse } from '../types';

export class DirectDebits {
  constructor(private readonly client: HttpClient) {}

  /**
   * List supported scenario codes
   * 
   * @param params Optional provider and active filters
   * @returns A promise that resolves to an object containing an array of Scenarios
   */
  async listScenarios(params?: { provider?: string; active?: boolean }): Promise<{ data: Scenario[] }> {
    return this.client.request<{ data: Scenario[] }>('GET', '/v1/direct-debit/scenario-code/list', undefined, params);
  }

  /**
   * Create a Direct Debit contract
   * 
   * @param params Contract creation parameters
   * @returns A promise that resolves to the DirectDebitContractResponse
   */
  async createContract(params: CreateDirectDebitContractParams): Promise<DirectDebitContractResponse> {
    return this.client.request<DirectDebitContractResponse>('POST', '/v1/direct-debit', params);
  }

  /**
   * List Direct Debit contracts
   * 
   * @param query Pagination and filtering parameters
   * @returns A promise that resolves to a paginated list of Contracts
   */
  async listContracts(query?: ListContractsQuery): Promise<ContractListResponse> {
    return this.client.request<ContractListResponse>('GET', '/v1/direct-debit/list', undefined, query);
  }

  /**
   * Get a contract by ID
   * 
   * @param id Contract ID
   * @returns A promise that resolves to the DirectDebitContractResponse
   */
  async getContract(id: string): Promise<DirectDebitContractResponse> {
    return this.client.request<DirectDebitContractResponse>('GET', `/v1/direct-debit/${id}`);
  }

  /**
   * Query and sync contract status
   * 
   * @param id Contract ID
   * @returns A promise that resolves to the synced DirectDebitContractResponse
   */
  async syncContract(id: string): Promise<DirectDebitContractResponse> {
    return this.client.request<DirectDebitContractResponse>('POST', `/v1/direct-debit/${id}/sync`, {});
  }

  /**
   * Terminate a signed contract
   * 
   * @param id Contract ID
   * @param params Termination notes
   * @returns A promise that resolves to the terminated DirectDebitContractResponse
   */
  async terminateContract(id: string, params?: TerminateContractParams): Promise<DirectDebitContractResponse> {
    return this.client.request<DirectDebitContractResponse>('POST', `/v1/direct-debit/${id}/terminate`, params || {});
  }

  /**
   * Execute a payment against a signed contract
   * 
   * @param id Contract ID
   * @param params Payment execution parameters
   * @returns A promise that resolves to the created Payment
   */
  async executePayment(id: string, params: ExecuteDirectDebitPaymentParams): Promise<PaymentResponse> {
    return this.client.request<PaymentResponse>('POST', `/v1/direct-debit/${id}/payment`, params);
  }
}
