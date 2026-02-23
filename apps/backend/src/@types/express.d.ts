declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      role?: string;
    };
    toCache: boolean;
    privateCache: boolean;
    storageSummary?: {
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
      freePlanBlocked?: boolean;
    };
  }
}
