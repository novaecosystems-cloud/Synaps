/**
 * Gumroad Merchant of Record Utility
 * Official Live Checkout Integration: https://novaverse33.gumroad.com/l/synaps
 */

export const GUMROAD_PRODUCT_URL = 'https://novaverse33.gumroad.com/l/synaps';

export function getGumroadCheckoutUrl(planId?: 'pro' | 'enterprise', userEmail?: string, discountCode: string = 'LAUNCH100'): string {
  const baseUrl = GUMROAD_PRODUCT_URL;
  const params: string[] = [`wanted=true`];
  if (discountCode) {
    params.push(`discount_code=${encodeURIComponent(discountCode)}`);
  }
  if (userEmail) {
    params.push(`email=${encodeURIComponent(userEmail)}`);
  }
  return `${baseUrl}?${params.join('&')}`;
}
