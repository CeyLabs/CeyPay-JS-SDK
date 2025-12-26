import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { generateSignature, getCurrentTimestamp } from '../auth/hmac';
import { RateLimitInfo, ErrorResponse } from '../types';
import {
  CeyPayError,
  AuthenticationError,
  ValidationError,
  NotFoundError,
  ForbiddenError,
  ConflictError,
  GoneError,
  UnprocessableEntityError,
  RateLimitError,
  InternalServerError,
  BadGatewayError,
  ApiError,
  NetworkError,
} from './errors';

/**
 * HTTP client configuration
 */
export interface HttpClientConfig {
  baseUrl: string;
  apiKey: string;
  secretKey: string;
  timeout: number;
  debug: boolean;
}

/**
 * Internal HTTP client with HMAC authentication
 */
export class HttpClient {
  private axios: AxiosInstance;
  private config: HttpClientConfig;
  private lastRateLimitInfo?: RateLimitInfo;

  constructor(config: HttpClientConfig) {
    this.config = config;

    this.axios = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add response interceptor to track rate limits
    this.axios.interceptors.response.use(
      (response) => {
        this.extractRateLimitInfo(response);
        return response;
      },
      (error) => {
        if (error.response) {
          this.extractRateLimitInfo(error.response);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Make an authenticated API request
   */
  async request<T = any>(
    method: string,
    path: string,
    body?: any,
    params?: Record<string, any>
  ): Promise<T> {
    try {
      // Build full path with query parameters
      const fullPath = this.buildPath(path, params);

      // Prepare request body
      const bodyString = body ? JSON.stringify(body) : '';

      // Generate authentication headers
      const timestamp = getCurrentTimestamp();
      const signature = generateSignature(
        timestamp,
        method.toUpperCase(),
        fullPath,
        bodyString,
        this.config.secretKey
      );

      // Build axios config
      const axiosConfig: AxiosRequestConfig = {
        method: method.toLowerCase(),
        url: fullPath,
        headers: {
          'x-api-key': this.config.apiKey,
          'x-timestamp': timestamp,
          'x-signature': signature,
        },
      };

      // Add body for POST, PATCH, PUT requests
      if (body && ['POST', 'PATCH', 'PUT'].includes(method.toUpperCase())) {
        axiosConfig.data = body;
      }

      // Debug logging
      if (this.config.debug) {
        console.log('[CeyPay SDK] Request:', {
          method: method.toUpperCase(),
          path: fullPath,
          timestamp,
          signature,
        });
      }

      // Make request
      const response = await this.axios.request<T>(axiosConfig);

      // Debug logging
      if (this.config.debug) {
        console.log('[CeyPay SDK] Response:', {
          status: response.status,
          data: response.data,
        });
      }

      return response.data;
    } catch (error) {
      throw this.handleError(error, method, path);
    }
  }

  /**
   * Build full path with query parameters
   */
  private buildPath(path: string, params?: Record<string, any>): string {
    if (!params || Object.keys(params).length === 0) {
      return path;
    }

    // Filter out undefined values
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);

    const queryString = new URLSearchParams(
      cleanParams as Record<string, string>
    ).toString();

    return queryString ? `${path}?${queryString}` : path;
  }

  /**
   * Extract rate limit information from response headers
   */
  private extractRateLimitInfo(response: AxiosResponse): void {
    const limit = response.headers['x-ratelimit-limit'];
    const remaining = response.headers['x-ratelimit-remaining'];
    const reset = response.headers['x-ratelimit-reset'];

    if (limit && remaining && reset) {
      this.lastRateLimitInfo = {
        limit: parseInt(limit, 10),
        remaining: parseInt(remaining, 10),
        reset: parseInt(reset, 10),
      };
    }
  }

  /**
   * Get last known rate limit information
   */
  getRateLimitInfo(): RateLimitInfo | undefined {
    return this.lastRateLimitInfo;
  }

  /**
   * Transform axios error into SDK error
   */
  private handleError(error: any, method: string, path: string): CeyPayError {
    const context = { method, path };

    // Network error (no response)
    if (!error.response) {
      const message = error.message || 'Network error occurred';
      return new NetworkError(message, error);
    }

    const axiosError = error as AxiosError<ErrorResponse>;
    const status = axiosError.response?.status;
    const errorData = axiosError.response?.data;
    const message = errorData?.message || axiosError.message || 'An error occurred';

    // Map status codes to specific error types
    switch (status) {
      case 400:
        return new ValidationError(message, errorData, context);

      case 401:
        return new AuthenticationError(message, errorData, context);

      case 403:
        return new ForbiddenError(message, errorData, context);

      case 404:
        return new NotFoundError(message, errorData, context);

      case 409:
        return new ConflictError(message, errorData, context);

      case 410:
        return new GoneError(message, errorData, context);

      case 422:
        return new UnprocessableEntityError(message, errorData, context);

      case 429: {
        const retryAfter = errorData?.retryAfter || 60;
        return new RateLimitError(message, retryAfter, errorData, context);
      }

      case 500:
        return new InternalServerError(message, errorData, context);

      case 502:
        return new BadGatewayError(message, errorData, context);

      default:
        return new ApiError(message, status || 500, errorData, context);
    }
  }
}
