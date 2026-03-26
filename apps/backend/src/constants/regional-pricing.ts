import { prisma } from "@workspace/db";

// ── DB-backed regional pricing cache (5 min TTL) ──────────────
type DBRegionalPricing = {
  currency: string;
  symbol: string;
  locale: string;
  pppMultiplier: number;
  tierPrices: Record<number, number>;
  tierCheckoutCents?: Record<number, number>;
  tierStorageOverrides?: Record<number, number>;
};

let _regionalCache: Map<string, DBRegionalPricing> | null = null;
let _regionalCacheExpiresAt = 0;
const REGIONAL_CACHE_TTL_MS = 5 * 60 * 1000;

/**
 * Fetch regional pricing for a country from the database.
 * Returns cached data within the 5-minute TTL window.
 * Falls back to the hardcoded REGIONAL_PRICING if the DB query fails.
 */
export function invalidateRegionalCache(): void {
  _regionalCache = null;
  _regionalCacheExpiresAt = 0;
}

export async function fetchRegionalPricingFromDB(
  countryCode: string | null | undefined,
): Promise<RegionalPricing | null> {
  if (!countryCode) return null;
  const cc = countryCode.toUpperCase();

  // Return from cache if fresh
  if (_regionalCache && Date.now() < _regionalCacheExpiresAt) {
    return _regionalCache.get(cc) ?? null;
  }

  try {
    const regions = await (prisma as any).regionalPricing.findMany({
      where: { active: true },
      include: { tierOverrides: true },
    });

    const cache = new Map<string, DBRegionalPricing>();

    for (const region of regions) {
      const tierPrices: Record<number, number> = {};
      const tierCheckoutCents: Record<number, number> = {};
      const tierStorageOverrides: Record<number, number> = {};
      let hasCheckoutCents = false;
      let hasStorageOverrides = false;

      for (const override of region.tierOverrides) {
        tierPrices[override.tierGb] = override.localPriceCents;
        if (override.checkoutCents != null) {
          tierCheckoutCents[override.tierGb] = override.checkoutCents;
          hasCheckoutCents = true;
        }
        if (override.storageOverrideGb != null) {
          tierStorageOverrides[override.tierGb] = override.storageOverrideGb;
          hasStorageOverrides = true;
        }
      }

      cache.set(region.countryCode, {
        currency: region.currency,
        symbol: region.symbol,
        locale: region.locale,
        pppMultiplier: region.pppMultiplier,
        tierPrices,
        ...(hasCheckoutCents && { tierCheckoutCents }),
        ...(hasStorageOverrides && { tierStorageOverrides }),
      });
    }

    _regionalCache = cache;
    _regionalCacheExpiresAt = Date.now() + REGIONAL_CACHE_TTL_MS;

    return cache.get(cc) ?? null;
  } catch (err) {
    console.warn("[fetchRegionalPricingFromDB] DB query failed, using hardcoded fallback:", err);
    return REGIONAL_PRICING[cc] ?? null;
  }
}

// ── Types & hardcoded fallback ─────────────────────────────────

export type RegionalPricing = {
  /** ISO 4217 currency code */
  currency: string;
  /** Display symbol, e.g. "EGP", "₹" */
  symbol: string;
  /** BCP 47 locale for Intl.NumberFormat */
  locale: string;
  /**
   * Prices per tier in local currency minor units (piasters, paisa, etc.).
   * Keyed by the global `gb` value. Tiers NOT listed here are excluded
   * from this region (e.g. omit -1 to hide the Unlimited tier).
   */
  tierPrices: Record<number, number>;
  /** Fallback multiplier applied to USD priceCents for Stripe checkout (used when tierCheckoutCents is missing for a tier) */
  pppMultiplier: number;
  /**
   * Per-tier USD checkout prices in cents for Stripe.
   * Overrides `pppMultiplier` for individual tiers.
   * Key = global gb value, Value = USD cents Stripe will charge.
   */
  tierCheckoutCents?: Record<number, number>;
  /**
   * Override the storage allocation for specific tiers in this region.
   * Key = global gb value, Value = regional gb value.
   */
  tierStorageOverrides?: Record<number, number>;
};

/**
 * Regional pricing overrides keyed by ISO 3166-1 alpha-2 country code.
 *
 * To add a new country, add one entry here. No Stripe dashboard
 * changes needed — the `pppMultiplier` is applied via Stripe `customPrice`
 * at checkout time.
 */
export const REGIONAL_PRICING: Record<string, RegionalPricing> = {
  EG: {
    currency: "EGP",
    symbol: "EGP",
    locale: "en-EG",
    pppMultiplier: 0.33,
    tierPrices: {
      20: 15000,    // 150 EGP
      100: 30000,   // 300 EGP
      500: 110000,  // 1,100 EGP
      // Unlimited (-1) omitted: hidden for this region
    },
    tierCheckoutCents: {
      20: 300,      // $3.00
      100: 627,     // $6.27
      500: 2200,    // $22.00 (~1,100 EGP at ~50 EGP/USD)
    },
  },
};

export const getRegionalPricing = (
  countryCode: string | null | undefined,
): RegionalPricing | null => {
  if (!countryCode) return null;
  return REGIONAL_PRICING[countryCode.toUpperCase()] ?? null;
};
