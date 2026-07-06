import { HttpClient } from '../utils/http-client';
import { Bank } from '../types';

export class Banks {
  constructor(private readonly client: HttpClient) {}

  /**
   * List all supported banks
   * 
   * @returns A promise that resolves to an array of Bank objects
   */
  async list(): Promise<Bank[]> {
    return this.client.request<Bank[]>('GET', '/v1/bank/list');
  }
}
