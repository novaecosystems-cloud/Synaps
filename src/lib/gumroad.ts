/**
 * Gumroad Merchant of Record Utility
 * Official Live Checkout Integration: https://novaverse33.gumroad.com/l/synaps
 */

export const GUMROAD_PRODUCT_URL = 'https://novaverse33.gumroad.com/l/synaps';

export function getGumroadCheckoutUrl(planId?: 'pro' | 'enterprise', userEmail?: string): string {
  const baseUrl = GUMROAD_PRODUCT_URL;
  const params: string[] = [];
  if (userEmail) {
    params.push(`email=${encodeURIComponent(userEmail)}`);
  }
  return params.length > 0 ? `${baseUrl}?${params.join('&')}` : baseUrl;
}
