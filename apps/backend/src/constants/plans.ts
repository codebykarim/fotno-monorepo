export const STORAGE_TIERS = [
  {
    gb: 50,
    priceCents: 500,
    label: "50 GB",
    lsVariantId: process.env.LS_VARIANT_50GB || "",
  },
  {
    gb: 100,
    priceCents: 900,
    label: "100 GB",
    lsVariantId: process.env.LS_VARIANT_100GB || "",
  },
  {
    gb: 250,
    priceCents: 1900,
    label: "250 GB",
    lsVariantId: process.env.LS_VARIANT_250GB || "",
  },
  {
    gb: 500,
    priceCents: 3500,
    label: "500 GB",
    lsVariantId: process.env.LS_VARIANT_500GB || "",
  },
  {
    gb: 1000,
    priceCents: 5900,
    label: "1 TB",
    lsVariantId: process.env.LS_VARIANT_1TB || "",
  },
  {
    gb: 2000,
    priceCents: 9900,
    label: "2 TB",
    lsVariantId: process.env.LS_VARIANT_2TB || "",
  },
] as const;

export type StorageTier = (typeof STORAGE_TIERS)[number];

export const findTierByVariantId = (variantId: string): StorageTier | undefined =>
  STORAGE_TIERS.find((t) => t.lsVariantId === variantId);

export const findTierByGb = (gb: number): StorageTier | undefined =>
  STORAGE_TIERS.find((t) => t.gb === gb);

export const TRIAL_DAYS = 14;
