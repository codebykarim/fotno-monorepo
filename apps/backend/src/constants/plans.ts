import { prisma } from "@workspace/db";

// ── DB-backed tier cache (5 min TTL) ───────────────────────────
type DBTier = {
  id: string;
  gb: number;
  label: string;
  priceCents: number;
  lsVariantId: string | null;
  galleryLimit: number | null;
  sortOrder: number;
  active: boolean;
};

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
    const tiers: DBTier[] = await (prisma as any).pricingTier.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    });

    if (tiers.length === 0) {
      // DB has no rows yet — fall back to constants
      return STORAGE_TIERS.map((t) => ({
        id: "",
        gb: t.gb,
        label: t.label,
        priceCents: t.priceCents,
        lsVariantId: t.lsVariantId || null,
        galleryLimit: t.gb === 0 ? 2 : null,
        sortOrder: 0,
        active: true,
      }));
    }

    _tierCache = tiers;
    _tierCacheExpiresAt = Date.now() + TIER_CACHE_TTL_MS;
    return tiers;
  } catch (err) {
    console.warn("[fetchTiersFromDB] DB query failed, using hardcoded fallback:", err);
    return STORAGE_TIERS.map((t) => ({
      id: "",
      gb: t.gb,
      label: t.label,
      priceCents: t.priceCents,
      lsVariantId: t.lsVariantId || null,
      galleryLimit: t.gb === 0 ? 2 : null,
      sortOrder: 0,
      active: true,
    }));
  }
}

// ── Hardcoded fallback tiers ───────────────────────────────────

export const STORAGE_TIERS = [
  {
    gb: 0,
    priceCents: 0,
    label: "Free",
    lsVariantId: "",
  },
  {
    gb: 20,
    priceCents: 900,
    label: "Starter",
    lsVariantId: process.env.LS_VARIANT_STARTER || "",
  },
  {
    gb: 100,
    priceCents: 1900,
    label: "Professional",
    lsVariantId: process.env.LS_VARIANT_PROFESSIONAL || "",
  },
  {
    gb: 500,
    priceCents: 3500,
    label: "Business",
    lsVariantId: process.env.LS_VARIANT_BUSINESS || "",
  },
  {
    gb: -1,
    priceCents: 4900,
    label: "Unlimited",
    lsVariantId: process.env.LS_VARIANT_UNLIMITED || "",
  },
] as const;

export type StorageTier = (typeof STORAGE_TIERS)[number];

export const PLAN_FEATURES = [
  "Unlimited galleries",
  "Unlimited clients",
  "AI-powered captions",
  "Client favorites & selections",
  "Download tracking & analytics",
  "Password-protected galleries",
  "Custom gallery slugs",
  "Bulk upload with auto-retry",
  "Google Drive & Google Photos import",
  "Slideshow & social sharing",
];

export const FREE_PLAN_FEATURES = [
  "1 GB storage",
  "Up to 2 galleries",
  "AI-powered captions",
  "Client favorites & selections",
  "Download tracking & analytics",
  "Password-protected galleries",
];

export const findTierByVariantId = (variantId: string): StorageTier | undefined =>
  STORAGE_TIERS.find((t) => t.lsVariantId === variantId);

export const findTierByGb = (gb: number): StorageTier | undefined =>
  STORAGE_TIERS.find((t) => t.gb === gb);
