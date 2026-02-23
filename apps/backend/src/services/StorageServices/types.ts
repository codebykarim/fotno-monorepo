export type StorageReason =
  | "upload"
  | "processing"
  | "delete"
  | "reconcile"
  | "billing_cycle_reset";

export type StorageSummary = {
  used: bigint;
  limit: bigint;
  overageBytes: bigint;
  percentage: number;
  overageGB: number;
  overageCostCents: number;
  formatted: {
    used: string;
    limit: string;
    overage: string;
  };
};
