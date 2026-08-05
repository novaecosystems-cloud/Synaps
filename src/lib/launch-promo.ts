export const LAUNCH_PROMO_CONFIG = {
  code: 'LAUNCH100',
  discountPercentage: 30,
  maxRedemptions: 100,
  expirationDateISO: '2026-09-05T23:59:59Z',
  expirationDateFormatted: 'September 5, 2026',
};

/**
 * Checks whether the LAUNCH100 promo code is currently valid.
 */
export function isLaunchPromoValid(claimedCount: number = 78): {
  isValid: boolean;
  reason?: 'EXPIRED_BY_DATE' | 'SLOTS_FULL';
  remainingSlots: number;
} {
  const now = new Date();
  const expDate = new Date(LAUNCH_PROMO_CONFIG.expirationDateISO);

  if (now > expDate) {
    return {
      isValid: false,
      reason: 'EXPIRED_BY_DATE',
      remainingSlots: 0,
    };
  }

  const remaining = Math.max(0, LAUNCH_PROMO_CONFIG.maxRedemptions - claimedCount);

  if (remaining <= 0) {
    return {
      isValid: false,
      reason: 'SLOTS_FULL',
      remainingSlots: 0,
    };
  }

  return {
    isValid: true,
    remainingSlots: remaining,
  };
}

/**
 * Formats the promo status badge for UI components.
 */
export function getLaunchPromoBadgeInfo(claimedCount: number = 78) {
  const { isValid, reason, remainingSlots } = isLaunchPromoValid(claimedCount);

  if (!isValid) {
    if (reason === 'EXPIRED_BY_DATE') {
      return {
        badgeText: 'Offer Expired (Passed Sept 5, 2026)',
        isValid: false,
      };
    }
    return {
      badgeText: 'Offer Sold Out (100/100 Slots Claimed)',
      isValid: false,
    };
  }

  return {
    badgeText: `LIMITED LAUNCH OFFER: ${claimedCount}/100 CLAIMED · EXPIRES SEPT 5, 2026`,
    isValid: true,
    remainingSlots,
    claimedCount,
  };
}
