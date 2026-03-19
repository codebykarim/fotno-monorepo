"use client";

import { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { AnimatePresence, motion } from "motion/react";
import { jsonFetcher } from "@/lib/api/client";
import type { SubscriptionResponse } from "@/lib/types/api";

export function TrialBanner() {
  const [dismissed, setDismissed] = useState(false);
  const { data } = useSWR<SubscriptionResponse>(
    "/api/billing/subscription",
    jsonFetcher,
    { revalidateOnFocus: false },
  );

  if (!data) return null;

  const { status } = data.access;

  return (
    <AnimatePresence>
      {!dismissed && status === "no_subscription" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between gap-4 rounded-lg border border-amber-500/30 bg-amber-500/10 backdrop-blur-sm px-4 py-2 mb-4"
        >
          <p className="text-sm text-amber-800 dark:text-amber-300">
            You don&apos;t have an active plan.{" "}
            <Link href="/billing" className="underline hover:no-underline font-medium">
              Choose a plan
            </Link>{" "}
            to start uploading and creating galleries.
          </p>
          <button
            onClick={() => setDismissed(true)}
            className="shrink-0 text-xs text-amber-600 hover:text-amber-800 dark:text-amber-400 transition-colors"
          >
            Dismiss
          </button>
        </motion.div>
      )}

      {status === "past_due" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between gap-4 rounded-lg border border-red-500/30 bg-red-500/10 backdrop-blur-sm px-4 py-2 mb-4"
        >
          <p className="text-sm text-red-800 dark:text-red-300">
            Your last payment failed. Please{" "}
            <Link href="/billing" className="underline hover:no-underline font-medium">
              update your payment method
            </Link>{" "}
            to keep your access.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
