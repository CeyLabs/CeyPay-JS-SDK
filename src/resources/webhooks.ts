import { HttpClient } from '../utils/http-client';
import { WebhookConfig, WebhookTestRequest, WebhookTestResponse } from '../types';

/**
 * Webhooks resource for managing webhook configuration
 */
export class Webhooks {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Get webhook configuration including webhook secret for signature verification
   *
   * @returns Webhook configuration with secret
   *
   * @example
   * ```typescript
   * const config = await client.webhooks.getConfig();
   * console.log('Webhook secret:', config.webhookSecret);
   * console.log('Signature header:', config.signatureHeader);
   * console.log('Timestamp header:', config.timestampHeader);
   *
   * // Use the secret to verify webhook signatures
   * import { verifyWebhook } from 'ceypay-sdk';
   * const isValid = verifyWebhook({
   *   signature: req.headers['x-webhook-signature'],
   *   timestamp: req.headers['x-webhook-timestamp'],
   *   rawBody: JSON.stringify(req.body),
   *   webhookSecret: config.webhookSecret
   * });
   * ```
   */
  async getConfig(): Promise<WebhookConfig> {
    return this.httpClient.request<WebhookConfig>('GET', '/api/v1/webhooks/config');
  }

  /**
   * Test webhook delivery to your endpoint
   *
   * This sends a test webhook event to verify your endpoint is correctly configured
   * and can receive webhook notifications.
   *
   * @param webhookUrl - Your webhook endpoint URL (must be HTTPS in production)
   * @returns Test result with delivery status and time
   *
   * @example
   * ```typescript
   * try {
   *   const result = await client.webhooks.test('https://myapp.com/webhooks/ceypay');
   *
   *   if (result.success) {
   *     console.log('Webhook test successful!');
   *     console.log('Delivery time:', result.deliveryTime, 'ms');
   *   } else {
   *     console.error('Webhook test failed:', result.message);
   *   }
   * } catch (error) {
   *   console.error('Failed to test webhook:', error.message);
   * }
   * ```
   */
  async test(webhookUrl: string): Promise<WebhookTestResponse> {
    const request: WebhookTestRequest = { webhookUrl };
    return this.httpClient.request<WebhookTestResponse>('POST', '/api/v1/webhooks/test', request);
  }
}
