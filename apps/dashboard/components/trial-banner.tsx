"use client";

import { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { jsonFetcher } from "@/lib/api/client";
import type { SubscriptionResponse } from "@/lib/types/api";

export function TrialBanner() {
  const [dismissed, setDismissed] = useState(false);
  const { data } = useSWR<SubscriptionResponse>(
    "/api/billing/subscription",
    jsonFetcher,
    { revalidateOnFocus: false },
  );

  if (dismissed || !data) return null;

  const { status, trialDaysRemaining } = data.access;

  if (status === "trial" && trialDaysRemaining !== undefined && trialDaysRemaining <= 3) {
    return (
      <div className="flex items-center justify-between gap-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2">
        <p className="text-sm text-amber-800 dark:text-amber-300">
          Your free trial ends in{" "}
          <strong>
            {trialDaysRemaining} day{trialDaysRemaining !== 1 ? "s" : ""}
          </strong>
          .{" "}
          <Link href="/billing" className="underline hover:no-underline">
            Subscribe now
          </Link>{" "}
          to keep your access.
        </p>
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 text-xs text-amber-600 hover:text-amber-800 dark:text-amber-400"
        >
          Dismiss
        </button>
      </div>
    );
  }

  if (status === "expired") {
    return (
      <div className="flex items-center justify-between gap-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2">
        <p className="text-sm text-red-800 dark:text-red-300">
          Your trial has ended. Uploads and gallery creation are disabled.{" "}
          <Link href="/billing" className="underline hover:no-underline">
            Subscribe to continue
          </Link>
          .
        </p>
      </div>
    );
  }

  return null;
}
