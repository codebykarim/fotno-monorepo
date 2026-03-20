export const ONE_MB_BYTES = BigInt(1024 ** 2);
export const ONE_GB_BYTES = BigInt(1024 ** 3);

export const STORAGE_TIERS = [
  { gb: 20, priceCents: 900, label: "Starter" },
  { gb: 100, priceCents: 1900, label: "Professional" },
  { gb: 500, priceCents: 3500, label: "Business" },
  { gb: -1, priceCents: 4900, label: "Unlimited" },
] as const;

// -1 = unlimited (internal soft cap: 3 TB — marketed as "Unlimited")
const UNLIMITED_BYTES = BigInt(3) * BigInt(1000) * ONE_GB_BYTES;

export const STORAGE_TIER_LIMITS: Record<number, bigint> = {
  20: BigInt(20) * ONE_GB_BYTES,
  100: BigInt(100) * ONE_GB_BYTES,
  250: BigInt(250) * ONE_GB_BYTES,
  500: BigInt(500) * ONE_GB_BYTES,
  [-1]: UNLIMITED_BYTES,
};

export const OVERAGE_PRICE_PER_GB_CENTS = 10;
export const WARNING_THRESHOLD_80 = 0.8;
export const WARNING_THRESHOLD_95 = 0.95;
