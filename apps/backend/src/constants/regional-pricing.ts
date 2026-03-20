export type RegionalPricing = {
  /** ISO 4217 currency code */
  currency: string;
  /** Display symbol, e.g. "EGP", "₹" */
  symbol: string;
  /** BCP 47 locale for Intl.NumberFormat */
  locale: string;
  /** Prices per tier in local currency minor units (piasters, paisa, etc.) */
  tierPrices: Record<number, number>;
  /** Multiplier applied to USD priceCents for Lemon Squeezy checkout */
  pppMultiplier: number;
};

/**
 * Regional pricing overrides keyed by ISO 3166-1 alpha-2 country code.
 *
 * To add a new country, add one entry here. No Lemon Squeezy dashboard
 * changes needed — the `pppMultiplier` is applied via LS `customPrice`
 * at checkout time.
 */
export const REGIONAL_PRICING: Record<string, RegionalPricing> = {
  EG: {
    currency: "EGP",
    symbol: "EGP",
    locale: "en-EG",
    pppMultiplier: 0.33,
    tierPrices: {
      20: 15000,   // 150 EGP
      100: 30000,  // 300 EGP
      500: 55000,  // 550 EGP
      [-1]: 80000, // 800 EGP
    },
  },
};

export const getRegionalPricing = (
  countryCode: string | null | undefined,
): RegionalPricing | null => {
  if (!countryCode) return null;
  return REGIONAL_PRICING[countryCode.toUpperCase()] ?? null;
};
