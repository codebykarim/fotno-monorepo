import { listVariants } from "@lemonsqueezy/lemonsqueezy.js";
import { fetchTiersFromDB } from "../../constants/plans";
import { getRegionalPricing, fetchRegionalPricingFromDB } from "../../constants/regional-pricing";

export type PlanInfo = {
  gb: number;
  priceCents: number;
  label: string;
  /** Price in local currency minor units (only when regional pricing applies) */
  localPriceCents?: number;
  /** PPP-adjusted USD price in cents (what LS will charge) */
  pppPriceCents?: number;
  /** ISO 4217 currency code */
  currency?: string;
  /** Display symbol */
  symbol?: string;
  /** BCP 47 locale for Intl.NumberFormat */
  locale?: string;
};

// ── In-memory cache (10 min TTL) ────────────────────────────────
let cachedPlans: PlanInfo[] | null = null;
let cacheExpiresAt = 0;
const CACHE_TTL_MS = 10 * 60 * 1000;

/**
 * Build a variantId → tier lookup.
 * Tries DB-backed tiers first, falls back to hardcoded STORAGE_TIERS.
 */
const buildVariantMap = async (): Promise<Map<string, { gb: number; priceCents: number; label: string; lsVariantId: string }>> => {
  const map = new Map<string, { gb: number; priceCents: number; label: string; lsVariantId: string }>();

  const dbTiers = await fetchTiersFromDB();
  for (const tier of dbTiers) {
    if (tier.lsVariantId) {
      map.set(tier.lsVariantId, {
        gb: tier.gb,
        priceCents: tier.priceCents,
        label: tier.label,
        lsVariantId: tier.lsVariantId,
      });
    }
  }

  return map;
};

/**
 * Apply regional pricing overrides to a list of base USD plans.
 * Tiers not present in `tierPrices` are excluded for this region.
 * Tiers with `tierStorageOverrides` get their displayed gb value changed.
 *
 * Tries DB-backed regional pricing first, falls back to hardcoded constants.
 */
async function applyRegionalPricing(
  plans: PlanInfo[],
  countryCode: string | null | undefined,
): Promise<PlanInfo[]> {
  // Try DB first, fall back to hardcoded
  const regional =
    (await fetchRegionalPricingFromDB(countryCode)) ?? getRegionalPricing(countryCode);
  if (!regional) return plans;

  return plans
    .filter((plan) => plan.gb in regional.tierPrices)
    .map((plan) => ({
      ...plan,
      gb: regional.tierStorageOverrides?.[plan.gb] ?? plan.gb,
      localPriceCents: regional.tierPrices[plan.gb] ?? undefined,
      pppPriceCents: regional.tierCheckoutCents?.[plan.gb] ?? Math.round(plan.priceCents * regional.pppMultiplier),
      currency: regional.currency,
      symbol: regional.symbol,
      locale: regional.locale,
    }));
}

/**
 * Fetch pricing from the Lemon Squeezy API and merge it with the
 * known storage tiers.  Falls back to the hardcoded STORAGE_TIERS
 * when the API is unreachable or the key is not configured.
 *
 * When `countryCode` is provided and regional pricing exists, each
 * plan is augmented with local currency prices and PPP info.
 */
export const fetchPlans = async (
  countryCode?: string | null,
): Promise<PlanInfo[]> => {
  const basePlans = await fetchBasePlans();
  return applyRegionalPricing(basePlans, countryCode);
};

async function fetchBasePlans(): Promise<PlanInfo[]> {
  // Return cached data if still fresh
  if (cachedPlans && Date.now() < cacheExpiresAt) {
    return cachedPlans;
  }

  // If the API key isn't set we can't call LS — return DB-backed tiers
  if (!process.env.LEMONSQUEEZY_API_KEY) {
    return fallbackPlans();
  }

  try {
    const variantMap = await buildVariantMap();
    const variantIds = [...variantMap.keys()];

    if (variantIds.length === 0) {
      return fallbackPlans();
    }

    // Fetch all variants from the store
    const { data, error } = await listVariants({
      page: { size: 100 },
    });

    if (error || !data?.data) {
      console.warn("[listPlans] Lemon Squeezy API error, using fallback:", error);
      return fallbackPlans();
    }

    const plans: PlanInfo[] = [];

    for (const variant of data.data) {
      const vid = String(variant.id);
      const tier = variantMap.get(vid);
      if (!tier) continue;

      const attrs = variant.attributes as any;
      const priceCents =
        typeof attrs.price === "number" ? attrs.price : tier.priceCents;

      plans.push({
        gb: tier.gb,
        priceCents,
        label: tier.label,
      });
    }

    // If some tiers are missing from the API response, fill them from DB / constants
    const dbTiers = await fetchTiersFromDB();
    for (const tier of dbTiers) {
      if (!plans.find((p) => p.gb === tier.gb)) {
        plans.push({
          gb: tier.gb,
          priceCents: tier.priceCents,
          label: tier.label,
        });
      }
    }

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
  } catch (err) {
    console.warn("[listPlans] Failed to fetch from Lemon Squeezy, using fallback:", err);
    return fallbackPlans();
  }
}

async function fallbackPlans(): Promise<PlanInfo[]> {
  const dbTiers = await fetchTiersFromDB();
  return dbTiers.map(({ gb, priceCents, label }) => ({
    gb,
    priceCents,
    label,
  }));
}
