import { listVariants } from "@lemonsqueezy/lemonsqueezy.js";
import { STORAGE_TIERS, type StorageTier } from "../../constants/plans";

export type PlanInfo = {
  gb: number;
  priceCents: number;
  label: string;
};

// ── In-memory cache (10 min TTL) ────────────────────────────────
let cachedPlans: PlanInfo[] | null = null;
let cacheExpiresAt = 0;
const CACHE_TTL_MS = 10 * 60 * 1000;

/**
 * Build a variantId → StorageTier lookup from the STORAGE_TIERS constant.
 * Only tiers with a configured lsVariantId are included.
 */
const buildVariantMap = (): Map<string, StorageTier> => {
  const map = new Map<string, StorageTier>();
  for (const tier of STORAGE_TIERS) {
    if (tier.lsVariantId) {
      map.set(tier.lsVariantId, tier);
    }
  }
  return map;
};

/**
 * Fetch pricing from the Lemon Squeezy API and merge it with the
 * known storage tiers.  Falls back to the hardcoded STORAGE_TIERS
 * when the API is unreachable or the key is not configured.
 */
export const fetchPlans = async (): Promise<PlanInfo[]> => {
  // Return cached data if still fresh
  if (cachedPlans && Date.now() < cacheExpiresAt) {
    return cachedPlans;
  }

  // If the API key isn't set we can't call LS — return hardcoded tiers
  if (!process.env.LEMONSQUEEZY_API_KEY) {
    return fallbackPlans();
  }

  try {
    const variantMap = buildVariantMap();
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

    // If some tiers are missing from the API response, fill them from constants
    for (const tier of STORAGE_TIERS) {
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
};

function fallbackPlans(): PlanInfo[] {
  return STORAGE_TIERS.map(({ gb, priceCents, label }) => ({
    gb,
    priceCents,
    label,
  }));
}
