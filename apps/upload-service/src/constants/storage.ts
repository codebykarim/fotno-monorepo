export const PLAN_STORAGE_LIMITS: Record<string, bigint> = {
  FREE: BigInt(5 * 1024 ** 3),
  STARTER: BigInt(50 * 1024 ** 3),
  PROFESSIONAL: BigInt(500 * 1024 ** 3),
  STUDIO: BigInt(2048 * 1024 ** 3),
  ENTERPRISE: BigInt(10240 * 1024 ** 3),
}
