import { prisma } from "@workspace/db";
import { storageTierToBytes } from "./storage";
import { DEFAULT_TIER_FEATURES, FEATURE_LABELS } from "./features";

// ── DB-backed tier cache (5 min TTL) ───────────────────────────
type DBTier = {
  id: string;
  gb: number;
  label: string;
  priceCents: number;
  priceCentsAnnual: number | null;
  stripePriceId: string | null;
  stripePriceIdAnnual: string | null;
  galleryLimit: number | null;
  sortOrder: number;
  active: boolean;
};

export type BillingInterval = "monthly" | "annual";

let _tierCache: DBTier[] | null = null;
let _tierCacheExpiresAt = 0;
const TIER_CACHE_TTL_MS = 5 * 60 * 1000;

/**
 * Fetch active pricing tiers from the database.
 * Returns cached data within the 5-minute TTL window.
 * Falls back to the hardcoded STORAGE_TIERS if the DB query fails.
 */
export function invalidateTierCache(): void {
  _tierCache = null;
  _tierCacheExpiresAt = 0;
}

export async function fetchTiersFromDB(): Promise<DBTier[]> {
  if (_tierCache && Date.now() < _tierCacheExpiresAt) {
    return _tierCache;
  }

  try {
    const tiers: DBTier[] = await prisma.pricingTier.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    });

    if (tiers.length === 0) {
      // DB has no rows yet — fall back to constants
      return STORAGE_TIERS.map((t, i) => ({
        id: "",
        gb: t.gb,
        label: t.label,
        priceCents: t.priceCents,
        priceCentsAnnual: t.priceCentsAnnual,
        stripePriceId: t.stripePriceId || null,
        stripePriceIdAnnual: t.stripePriceIdAnnual || null,
        galleryLimit: t.gb === 10 ? 2 : null,
        sortOrder: i,
        active: true,
      }));
    }

    _tierCache = tiers;
    _tierCacheExpiresAt = Date.now() + TIER_CACHE_TTL_MS;
    return tiers;
  } catch (err) {
    console.warn(
      "[fetchTiersFromDB] DB query failed, using hardcoded fallback:",
      err,
    );
    return STORAGE_TIERS.map((t, i) => ({
      id: "",
      gb: t.gb,
      label: t.label,
      priceCents: t.priceCents,
      priceCentsAnnual: t.priceCentsAnnual,
      stripePriceId: t.stripePriceId || null,
      stripePriceIdAnnual: t.stripePriceIdAnnual || null,
      galleryLimit: t.gb === 10 ? 2 : null,
      sortOrder: i,
      active: true,
    }));
  }
}

// ── DB-backed feature cache (5 min TTL) ──────────────────────────
let _featureCache: Map<number, string[]> | null = null;
let _featureCacheExpiresAt = 0;

export function invalidateFeatureCache(): void {
  _featureCache = null;
  _featureCacheExpiresAt = 0;
}

/**
 * Fetch features for a given tier (by GB value).
 * Loads all tier→feature mappings in one query and caches the result.
 * Falls back to DEFAULT_TIER_FEATURES if DB has no TierFeature rows.
 */
export async function fetchFeaturesForTier(tierGb: number): Promise<string[]> {
  if (_featureCache && Date.now() < _featureCacheExpiresAt) {
    return _featureCache.get(tierGb) ?? [];
  }

  try {
    const tiers = await prisma.pricingTier.findMany({
      where: { active: true },
      include: { features: { select: { featureKey: true } } },
    });

    const map = new Map<number, string[]>();

    for (const tier of tiers) {
      const keys = tier.features.map((f: { featureKey: string }) => f.featureKey);
      // Use DB features if present, otherwise fall back to defaults for this tier
      map.set(tier.gb, keys.length > 0 ? keys : (DEFAULT_TIER_FEATURES[tier.label] ?? []));
    }

    _featureCache = map;
    _featureCacheExpiresAt = Date.now() + TIER_CACHE_TTL_MS;

    return map.get(tierGb) ?? [];
  } catch (err) {
    console.warn("[fetchFeaturesForTier] DB query failed, using hardcoded fallback:", err);
    // Fall back to default features based on hardcoded tier labels
    const tier = STORAGE_TIERS.find((t) => t.gb === tierGb);
    return tier ? (DEFAULT_TIER_FEATURES[tier.label] ?? []) : [];
  }
}

// ── Hardcoded fallback tiers ───────────────────────────────────

export const STORAGE_TIERS = [
  {
    gb: 10,
    priceCents: 0,
    priceCentsAnnual: 0,
    label: "Free",
    stripePriceId: "",
    stripePriceIdAnnual: "",
  },
  {
    gb: 30,
    priceCents: 700,
    priceCentsAnnual: 7000,
    label: "Solo",
    stripePriceId: process.env.STRIPE_PRICE_SOLO_MONTHLY || "",
    stripePriceIdAnnual: process.env.STRIPE_PRICE_SOLO_ANNUAL || "",
  },
  {
    gb: 150,
    priceCents: 1700,
    priceCentsAnnual: 17000,
    label: "Studio",
    stripePriceId: process.env.STRIPE_PRICE_STUDIO_MONTHLY || "",
    stripePriceIdAnnual: process.env.STRIPE_PRICE_STUDIO_ANNUAL || "",
  },
  {
    gb: 600,
    priceCents: 3500,
    priceCentsAnnual: 35000,
    label: "Pro Studio",
    stripePriceId: process.env.STRIPE_PRICE_PRO_STUDIO_MONTHLY || "",
    stripePriceIdAnnual: process.env.STRIPE_PRICE_PRO_STUDIO_ANNUAL || "",
  },
] as const;

export type StorageTier = (typeof STORAGE_TIERS)[number];

export const PLAN_FEATURES = [
  FEATURE_LABELS.UNLIMITED_GALLERIES,
  FEATURE_LABELS.CLIENT_FAVORITES,
  FEATURE_LABELS.DOWNLOAD,
  FEATURE_LABELS.PASSWORD_PROTECTION,
  FEATURE_LABELS.CUSTOM_SLUGS,
  FEATURE_LABELS.GOOGLE_IMPORT,
  FEATURE_LABELS.SLIDESHOW_SHARING,
];

/** Build free-tier feature list dynamically from actual tier data + admin-toggled features */
export async function buildFreeFeatures(freeTier: {
  gb: number;
  galleryLimit: number | null;
}): Promise<string[]> {
  const storage = freeTier.gb <= 0 ? "1 GB" : `${freeTier.gb} GB`;
  const galleries = freeTier.galleryLimit ?? 2;
  const featureKeys = await fetchFeaturesForTier(freeTier.gb);
  const featureLabels = featureKeys
    .map((key) => FEATURE_LABELS[key as keyof typeof FEATURE_LABELS])
    .filter((label): label is string => Boolean(label));
  return [
    `${storage} storage`,
    `Up to ${galleries} ${galleries === 1 ? "gallery" : "galleries"}`,
    ...featureLabels,
  ];
}

/** @deprecated Use buildFreeFeatures() with actual tier data */
export const FREE_PLAN_FEATURES = [
  "1 GB storage",
  "Up to 2 galleries",
  FEATURE_LABELS.CLIENT_FAVORITES,
  FEATURE_LABELS.DOWNLOAD,
  FEATURE_LABELS.PASSWORD_PROTECTION,
];

/**
 * Get the current free tier limits from DB (cached).
 * Used by resolveUserAccess, createGallery, auth signup, etc.
 *
 * `galleryLimit` is `null` when the admin has left the field empty
 * (= unlimited galleries on the free tier).
 */
export async function getFreeTierLimits(): Promise<{
  storageLimitBytes: bigint;
  galleryLimit: number | null;
  gb: number;
}> {
  const tiers = await fetchTiersFromDB();
  const freeTier = tiers.find((t) => t.priceCents === 0);
  if (freeTier) {
    return {
      storageLimitBytes: storageTierToBytes(freeTier.gb),
      galleryLimit: freeTier.galleryLimit,
      gb: freeTier.gb,
    };
  }
  return { storageLimitBytes: BigInt(1073741824), galleryLimit: 2, gb: 1 };
}

export const findTierByPriceId = (priceId: string): StorageTier | undefined =>
  STORAGE_TIERS.find((t) => t.stripePriceId === priceId);

export const findTierByGb = (gb: number): StorageTier | undefined =>
  STORAGE_TIERS.find((t) => t.gb === gb);

/** DB-backed version of findTierByGb. Falls back to hardcoded STORAGE_TIERS. */
export async function findTierByGbFromDB(gb: number): Promise<DBTier | undefined> {
  const tiers = await fetchTiersFromDB();
  return tiers.find((t) => t.gb === gb);
}

/** DB-backed version of findTierByPriceId. Matches both monthly and annual price IDs. */
export async function findTierByPriceIdFromDB(priceId: string): Promise<DBTier | undefined> {
  const tiers = await fetchTiersFromDB();
  return tiers.find(
    (t) => t.stripePriceId === priceId || t.stripePriceIdAnnual === priceId,
  );
}

/**
 * Look up a tier by gb regardless of `active` flag — for resolving an
 * existing subscriber's tier even after the tier has been retired from
 * the public pricing page. Always queries the DB directly.
 */
export async function findAnyTierByGbFromDB(gb: number): Promise<DBTier | undefined> {
  try {
    const tier = await prisma.pricingTier.findFirst({ where: { gb } });
    return tier ?? undefined;
  } catch (err) {
    console.warn("[findAnyTierByGbFromDB] DB query failed:", err);
    return undefined;
  }
}

/**
 * Look up a tier by Stripe price ID (monthly OR annual) regardless of
 * `active` flag — for webhook resolution of subscribers on retired tiers.
 */
export async function findAnyTierByPriceIdFromDB(priceId: string): Promise<DBTier | undefined> {
  try {
    const tier = await prisma.pricingTier.findFirst({
      where: {
        OR: [{ stripePriceId: priceId }, { stripePriceIdAnnual: priceId }],
      },
    });
    return tier ?? undefined;
  } catch (err) {
    console.warn("[findAnyTierByPriceIdFromDB] DB query failed:", err);
    return undefined;
  }
}

/** Pick the right Stripe price ID for the chosen billing interval */
export function priceIdForInterval(
  tier: Pick<DBTier, "stripePriceId" | "stripePriceIdAnnual">,
  interval: BillingInterval,
): string | null {
  return interval === "annual"
    ? (tier.stripePriceIdAnnual ?? null)
    : (tier.stripePriceId ?? null);
}
