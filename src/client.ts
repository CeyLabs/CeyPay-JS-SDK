import { parseApiKey } from './auth/hmac';
import { HttpClient } from './utils/http-client';
import { Payments } from './resources/payments';
import { PaymentLinks } from './resources/payment-links';
import { Webhooks } from './resources/webhooks';
import { CeyPayClientConfig, RateLimitInfo, Env } from './types';

/**
 * Environment base URLs
 */
const ENVIRONMENT_URLS: Record<Env, string> = {
  [Env.LIVE]: 'https://api.ceypay.io',
  [Env.SANDBOX]: 'https://api-sandbox.ceypay.io',
};

/**
 * Default configuration values
 */
const DEFAULT_CONFIG = {
  env: Env.LIVE,
  timeout: 30000, // 30 seconds
  debug: false,
};

/**
 * Main CeyPay SDK client
 *
 * @example
 * ```typescript
 * import { CeyPayClient } from 'ceypay-sdk';
 *
 * const client = new CeyPayClient({
 *   apiKey: process.env.CEYPAY_API_KEY
 * });
 *
 * // Create a payment
 * const payment = await client.payments.create({
 *   amount: 100,
 *   currency: Currency.USDT,
 *   goods: [{ name: 'Product', description: 'Test product' }]
 * });
 *
 * // Create a payment link
 * const link = await client.paymentLinks.create({
 *   name: 'Premium Plan',
 *   amount: 49.99,
 *   currency: Currency.USDT,
 *   allowCustomAmount: false,
 *   reusable: true
 * });
 *
 * // Get webhook config
 * const webhookConfig = await client.webhooks.getConfig();
 * ```
 */
export class CeyPayClient {
  /** Payments resource for managing payment operations */
  public readonly payments: Payments;

  /** Payment Links resource for managing reusable payment links */
  public readonly paymentLinks: PaymentLinks;

  /** Webhooks resource for webhook configuration */
  public readonly webhooks: Webhooks;

  private httpClient: HttpClient;

  /**
   * Create a new CeyPay SDK client instance
   *
   * @param config - Client configuration
   * @throws Error if API key is invalid or missing
   *
   * @example
   * ```typescript
   * // Basic usage (production environment)
   * const client = new CeyPayClient({
   *   apiKey: 'ak_live_abc123.sk_live_xyz789'
   * });
   *
   * // With custom configuration
   * const client = new CeyPayClient({
   *   apiKey: process.env.CEYPAY_API_KEY,
   *   env: Env.SANDBOX, // Use sandbox environment for testing
   *   timeout: 60000, // 60 second timeout
   *   debug: true // Enable debug logging
   * });
   * ```
   */
  constructor(config: CeyPayClientConfig) {
    // Validate required config
    if (!config.apiKey) {
      throw new Error('API key is required. Get your API key from https://merchant.ceypay.io');
    }

    // Parse and validate API key format
    const { secretKey } = parseApiKey(config.apiKey);

    // Determine environment and base URL
    const env = config.env || DEFAULT_CONFIG.env;
    const baseUrl = ENVIRONMENT_URLS[env];

    // Merge with defaults
    const fullConfig = {
      baseUrl,
      timeout: config.timeout || DEFAULT_CONFIG.timeout,
      debug: config.debug || DEFAULT_CONFIG.debug,
      apiKey: config.apiKey,
      secretKey,
    };

    // Initialize HTTP client
    this.httpClient = new HttpClient(fullConfig);

    // Initialize resource modules
    this.payments = new Payments(this.httpClient);
    this.paymentLinks = new PaymentLinks(this.httpClient);
    this.webhooks = new Webhooks(this.httpClient);
  }

  /**
   * Get the last known rate limit information from API responses
   *
   * Returns rate limit details including:
   * - limit: Maximum requests allowed per time window
   * - remaining: Requests remaining in current window
   * - reset: Unix timestamp when the limit resets
   *
   * @returns Rate limit info or undefined if no requests have been made yet
   *
   * @example
   * ```typescript
   * await client.payments.list();
   *
   * const rateLimit = client.getRateLimitInfo();
   * if (rateLimit) {
   *   console.log(`Rate limit: ${rateLimit.remaining}/${rateLimit.limit} remaining`);
   *
   *   if (rateLimit.remaining < 10) {
   *     const resetDate = new Date(rateLimit.reset * 1000);
   *     console.warn(`Approaching rate limit! Resets at ${resetDate}`);
   *   }
   * }
   * ```
   */
  getRateLimitInfo(): RateLimitInfo | undefined {
    return this.httpClient.getRateLimitInfo();
  }
}
