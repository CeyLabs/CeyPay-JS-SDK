import * as crypto from 'crypto';

/**
 * HMAC-SHA256 signature generation for CeyPay API authentication
 */

/**
 * Generate HMAC-SHA256 signature for API request
 *
 * Message format: timestamp + method + path + body
 * Signature: HMAC-SHA256(message, secretKey)
 *
 * @param timestamp - Unix timestamp in milliseconds (as string)
 * @param method - HTTP method in UPPERCASE (GET, POST, PATCH, DELETE)
 * @param path - Full request path including query parameters
 * @param body - Request body as JSON string (empty string for GET/DELETE)
 * @param secretKey - Secret key portion of API key (sk_live_xxx)
 * @returns Hex-encoded HMAC-SHA256 signature
 *
 * @example
 * ```typescript
 * const timestamp = Date.now().toString();
 * const method = 'POST';
 * const path = '/api/v1/payments';
 * const body = JSON.stringify({ amount: 100, currency: 'USDT', ... });
 * const secretKey = 'sk_live_xyz789...';
 *
 * const signature = generateSignature(timestamp, method, path, body, secretKey);
 * ```
 */
export function generateSignature(
  timestamp: string,
  method: string,
  path: string,
  body: string,
  secretKey: string
): string {
  // Concatenate message components (no separators)
  const message = timestamp + method + path + body;

  // Generate HMAC-SHA256 signature
  const signature = crypto.createHmac('sha256', secretKey).update(message).digest('hex');

  return signature;
}

/**
 * Extract public and secret keys from full API key
 *
 * @param apiKey - Full API key in format: ak_live_xxx.sk_live_xxx
 * @returns Object with publicKey and secretKey
 * @throws Error if API key format is invalid
 *
 * @example
 * ```typescript
 * const { publicKey, secretKey } = parseApiKey('ak_live_abc.sk_live_xyz');
 * // publicKey: 'ak_live_abc'
 * // secretKey: 'sk_live_xyz'
 * ```
 */
export function parseApiKey(apiKey: string): { publicKey: string; secretKey: string } {
  const parts = apiKey.split('.');

  if (parts.length !== 2) {
    throw new Error(
      'Invalid API key format. Expected format: ak_live_xxx.sk_live_xxx or ak_test_xxx.sk_test_xxx'
    );
  }

  const [publicKey, secretKey] = parts;

  // Validate key prefixes
  if (!publicKey.startsWith('ak_')) {
    throw new Error('Invalid public key prefix. Expected ak_live_ or ak_test_');
  }

  if (!secretKey.startsWith('sk_')) {
    throw new Error('Invalid secret key prefix. Expected sk_live_ or sk_test_');
  }

  return { publicKey, secretKey };
}

/**
 * Generate current timestamp for API requests
 *
 * @returns Current Unix timestamp in milliseconds as string
 *
 * @example
 * ```typescript
 * const timestamp = getCurrentTimestamp();
 * // Returns: "1705315800000"
 * ```
 */
export function getCurrentTimestamp(): string {
  return Date.now().toString();
}
