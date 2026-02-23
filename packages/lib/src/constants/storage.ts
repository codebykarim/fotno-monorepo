export const PLAN_STORAGE_LIMITS: Record<string, bigint> = {
  FREE: BigInt(5 * 1024 ** 3),
  STARTER: BigInt(50 * 1024 ** 3),
  PROFESSIONAL: BigInt(500 * 1024 ** 3),
  STUDIO: BigInt(2048 * 1024 ** 3),
  ENTERPRISE: BigInt(10240 * 1024 ** 3),
};

export const OVERAGE_PRICE_PER_GB_CENTS = 10;
export const WARNING_THRESHOLD_80 = 0.8;
export const WARNING_THRESHOLD_95 = 0.95;
