import { fetchTiersFromDB, PLAN_FEATURES, buildFreeFeatures, invalidateTierCache, invalidateFeatureCache, fetchFeaturesForTier } from "../../constants/plans";
import {
  getRegionalPricing,
  fetchRegionalPricingFromDB,
  invalidateRegionalCache,
} from "../../constants/regional-pricing";

export type PlanInfo = {
  gb: number;
  priceCents: number;
  label: string;
  galleryLimit?: number | null;
  features: string[];
  /** Price in local currency minor units (only when regional pricing applies) */
  localPriceCents?: number;
  /** PPP-adjusted USD price in cents (what Stripe will charge) */
  pppPriceCents?: number;
  /** ISO 4217 currency code */
  currency?: string;
  /** Display symbol */
  symbol?: string;
  /** BCP 47 locale for Intl.NumberFormat */
  locale?: string;
};

export type PlansResponse = {
  tiers: PlanInfo[];
  features: string[];
  freeFeatures: string[];
};

// ── In-memory cache (5 min TTL) ────────────────────────────────
let cachedPlans: PlanInfo[] | null = null;
let cacheExpiresAt = 0;
const CACHE_TTL_MS = 5 * 60 * 1000;

/**
 * Apply regional pricing overrides to a list of base USD plans.
 * Tiers not present in `tierPrices` are excluded for this region.
 * Tiers with `tierStorageOverrides` get their displayed gb value changed.
 * Free tiers (priceCents=0) are always preserved regardless of regional config.
 *
 * Tries DB-backed regional pricing first, falls back to hardcoded constants.
 */
async function applyRegionalPricing(
  plans: PlanInfo[],
  countryCode: string | null | undefined,
): Promise<PlanInfo[]> {
  // Try DB first, fall back to hardcoded
  const regional =
    (await fetchRegionalPricingFromDB(countryCode)) ??
    getRegionalPricing(countryCode);
  if (!regional) return plans;

  // Always keep free tiers; only filter paid tiers by regional config
  const freeTiers = plans.filter((p) => p.priceCents === 0);
  const paidTiers = plans
    .filter((p) => p.priceCents > 0)
    .filter((plan) => plan.gb in regional.tierPrices)
    .map((plan) => ({
      ...plan,
      gb: regional.tierStorageOverrides?.[plan.gb] ?? plan.gb,
      localPriceCents: regional.tierPrices[plan.gb] ?? undefined,
      pppPriceCents:
        regional.tierCheckoutCents?.[plan.gb] ??
        Math.round(plan.priceCents * regional.pppMultiplier),
      currency: regional.currency,
      symbol: regional.symbol,
      locale: regional.locale,
    }));

  return [...freeTiers, ...paidTiers];
}

/**
 * Fetch pricing tiers from the database (with hardcoded fallback).
 * The DB `PricingTier` table is the single source of truth for
 * display prices — the Stripe API is only used at checkout time.
 *
 * When `countryCode` is provided and regional pricing exists, each
 * plan is augmented with local currency prices and PPP info.
 */
/** Invalidate all pricing caches (tiers, regional, features, and plans). */
export function invalidatePricingCaches(): void {
  invalidateTierCache();
  invalidateFeatureCache();
  invalidateRegionalCache();
  cachedPlans = null;
  cacheExpiresAt = 0;
}

export const fetchPlans = async (
  countryCode?: string | null,
): Promise<PlansResponse> => {
  const basePlans = await fetchBasePlans();
  const tiers = await applyRegionalPricing(basePlans, countryCode);
  const freeTier = tiers.find((t) => t.priceCents === 0);
  const freeFeatures = freeTier
    ? buildFreeFeatures({ gb: freeTier.gb, galleryLimit: freeTier.galleryLimit ?? null })
    : buildFreeFeatures({ gb: 1, galleryLimit: 2 });
  return { tiers, features: PLAN_FEATURES, freeFeatures };
};

async function fetchBasePlans(): Promise<PlanInfo[]> {
  // Return cached data if still fresh
  if (cachedPlans && Date.now() < cacheExpiresAt) {
    return cachedPlans;
  }

  const dbTiers = await fetchTiersFromDB();
  const plans: PlanInfo[] = await Promise.all(
    dbTiers.map(async ({ gb, priceCents, label, galleryLimit }) => ({
      gb,
      priceCents,
      label,
      galleryLimit: galleryLimit ?? null,
      features: await fetchFeaturesForTier(gb),
    })),
  );

  // Sort by GB so the order is deterministic (-1 = unlimited goes last)
  plans.sort((a, b) => {
    const aSort = a.gb === -1 ? Infinity : a.gb;
    const bSort = b.gb === -1 ? Infinity : b.gb;
    return aSort - bSort;
  });

  // Cache the result
  cachedPlans = plans;
  cacheExpiresAt = Date.now() + CACHE_TTL_MS;

  return plans;
}
