export const STORAGE_TIERS = [
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

export const findTierByVariantId = (variantId: string): StorageTier | undefined =>
  STORAGE_TIERS.find((t) => t.lsVariantId === variantId);

export const findTierByGb = (gb: number): StorageTier | undefined =>
  STORAGE_TIERS.find((t) => t.gb === gb);
