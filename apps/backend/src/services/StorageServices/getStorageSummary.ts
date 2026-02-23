import {
  ONE_GB_BYTES,
  OVERAGE_PRICE_PER_GB_CENTS,
} from "../../constants/storage";
import { formatBytes } from "../../utils/formatBytes";
import {
  fetchUserStorage,
  resolvePlanLimit,
  safeBigInt,
} from "./_shared";
import type { StorageSummary } from "./types";

export const getStorageSummary = async (userId: string): Promise<StorageSummary> => {
  const user = await fetchUserStorage(userId);
  const used = safeBigInt(user.storageUsed);
  const rawLimit = safeBigInt(user.storageLimit);
  const limit = rawLimit > 0n ? rawLimit : resolvePlanLimit(user.plan);
  const overageBytes = safeBigInt(user.overageBytes);
  const percentage = limit > 0n ? Number((used * 100n) / limit) : 0;

  const overageGBRaw = Number(overageBytes) / Number(ONE_GB_BYTES);
  const overageGB = Number(overageGBRaw.toFixed(2));
  const overageCostCents = Math.round(overageGB * OVERAGE_PRICE_PER_GB_CENTS);

  return {
    used,
    limit,
    overageBytes,
    percentage,
    overageGB,
    overageCostCents,
    formatted: {
      used: formatBytes(used),
      limit: formatBytes(limit),
      overage: overageBytes > 0n ? `${formatBytes(overageBytes)} over limit` : "0.0 B over limit",
    },
  };
};
