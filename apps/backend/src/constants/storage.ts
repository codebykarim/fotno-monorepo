export const ONE_MB_BYTES = BigInt(1024 ** 2);
export const ONE_GB_BYTES = BigInt(1024 ** 3);

export const STORAGE_TIERS = [
  { gb: 50, priceCents: 500, label: "50 GB" },
  { gb: 100, priceCents: 900, label: "100 GB" },
  { gb: 250, priceCents: 1900, label: "250 GB" },
  { gb: 500, priceCents: 3500, label: "500 GB" },
  { gb: 1000, priceCents: 5900, label: "1 TB" },
  { gb: 2000, priceCents: 9900, label: "2 TB" },
] as const;

export const STORAGE_TIER_LIMITS: Record<number, bigint> = {
  50: BigInt(50) * ONE_GB_BYTES,
  100: BigInt(100) * ONE_GB_BYTES,
  250: BigInt(250) * ONE_GB_BYTES,
  500: BigInt(500) * ONE_GB_BYTES,
  1000: BigInt(1000) * ONE_GB_BYTES,
  2000: BigInt(2000) * ONE_GB_BYTES,
};

export const OVERAGE_PRICE_PER_GB_CENTS = 10;
export const WARNING_THRESHOLD_80 = 0.8;
export const WARNING_THRESHOLD_95 = 0.95;
