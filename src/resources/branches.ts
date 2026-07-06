import { HttpClient } from '../utils/http-client';
import { 
  Branch, 
  CreateBranchParams, 
  UpdateBranchParams, 
  ListBranchesQuery, 
  BranchListResponse 
} from '../types';

export class Branches {
  constructor(private readonly client: HttpClient) {}

  /**
   * Create a new branch
   * 
   * @param params Branch creation parameters
   * @returns A promise that resolves to the created Branch
   */
  async create(params: CreateBranchParams): Promise<Branch> {
    return this.client.request<Branch>('POST', '/v1/branch', params);
  }

  /**
   * List branches
   * 
   * @param query Pagination and filtering parameters
   * @returns A promise that resolves to a paginated list of Branches
   */
  async list(query?: ListBranchesQuery): Promise<BranchListResponse> {
    return this.client.request<BranchListResponse>('GET', '/v1/branch/list', undefined, query);
  }

  /**
   * Get a branch by ID
   * 
   * @param id Branch ID
   * @returns A promise that resolves to the Branch
   */
  async get(id: string): Promise<Branch> {
    return this.client.request<Branch>('GET', `/v1/branch/${id}`);
  }

  /**
   * Update a branch
   * 
   * @param id Branch ID
   * @param params Branch update parameters
   * @returns A promise that resolves to the updated Branch
   */
  async update(id: string, params: UpdateBranchParams): Promise<Branch> {
    return this.client.request<Branch>('PATCH', `/v1/branch/${id}`, params);
  }

  /**
   * Deactivate a branch
   * 
   * @param id Branch ID
   */
  async deactivate(id: string): Promise<void> {
    return this.client.request<void>('DELETE', `/v1/branch/${id}`);
  }
}
