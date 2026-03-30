export const ONE_MB_BYTES = BigInt(1024 ** 2);
export const ONE_GB_BYTES = BigInt(1024 ** 3);

export const STORAGE_TIERS = [
  { gb: 20, priceCents: 900, label: "Solo" },
  { gb: 100, priceCents: 1900, label: "Studio" },
  { gb: 500, priceCents: 3500, label: "Pro Studio" },
  { gb: -1, priceCents: 4900, label: "Unlimited" },
] as const;

// -1 = unlimited (use a very large value: 100 TB)
const UNLIMITED_BYTES = BigInt(100) * BigInt(1000) * ONE_GB_BYTES;

/**
 * Convert a storage tier GB value to bytes.
 *  -1 → unlimited (100 TB cap)
 *   0 → free tier (1 GB)
 *   N → N * 1 GiB
 */
export function storageTierToBytes(gb: number): bigint {
  if (gb === -1) return UNLIMITED_BYTES;
  if (gb === 0) return ONE_GB_BYTES; // Free tier: 1 GB
  return BigInt(gb) * ONE_GB_BYTES;
}

/** @deprecated Use storageTierToBytes() for dynamic lookup */
export const STORAGE_TIER_LIMITS: Record<number, bigint> = {
  0: BigInt(1) * ONE_GB_BYTES,
  20: BigInt(20) * ONE_GB_BYTES,
  100: BigInt(100) * ONE_GB_BYTES,
  500: BigInt(500) * ONE_GB_BYTES,
  [-1]: UNLIMITED_BYTES,
};
