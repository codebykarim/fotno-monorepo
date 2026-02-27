"use client";

import Link from "next/link";
import useSWR from "swr";
import { Button } from "@workspace/ui/components/button";
import { jsonFetcher } from "@/lib/api/client";
import type { StorageSummaryResponse } from "@/lib/types/api";

const toNumber = (value: string): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatGb = (bytes: string): string => {
  return `${(toNumber(bytes) / 1024 ** 3).toFixed(1)} GB`;
};

const toUsd = (cents: number): string => {
  return `$${(Math.max(0, cents) / 100).toFixed(2)}`;
};

export const StorageWidget = ({ compact = false }: { compact?: boolean }) => {
  const { data } = useSWR<StorageSummaryResponse>("/api/storage/summary", jsonFetcher, {
    revalidateOnFocus: true,
  });

  if (!data || compact) {
    return null;
  }

  const percent = Math.max(0, Math.min(100, data.percentage));
  const is95 = percent >= 95;
  const is80 = percent >= 80;
  const overageBytes = toNumber(data.overageBytes);

  return (
    <div className="mx-2 mt-4 rounded-xl border border-border/70 bg-background/60 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Storage</p>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full transition-all ${
            is95 ? "bg-destructive" : is80 ? "bg-primary/70" : "bg-primary"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="mt-2 text-xs text-foreground">
        {formatGb(data.used)} of {formatGb(data.limit)} used ({percent}%)
      </p>

      {overageBytes > 0 && (
        <p className="mt-2 text-xs text-red-600">
          {`\u26a0 ${(data.overageGB ?? 0).toFixed(1)} GB over limit — ${toUsd(
            data.overageCostCents,
          )} will be charged next billing cycle`}
        </p>
      )}

      <Button asChild size="sm" className="mt-3 w-full">
        <Link href="/billing">Upgrade Plan</Link>
      </Button>
    </div>
  );
};
