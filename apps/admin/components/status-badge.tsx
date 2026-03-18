"use client";

import { cn } from "@workspace/ui/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusColors: Record<string, string> = {
  // Service health
  healthy: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  degraded: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  down: "bg-red-500/15 text-red-700 dark:text-red-400",
  // Gallery status
  published: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  draft: "bg-zinc-500/15 text-zinc-700 dark:text-zinc-400",
  // Payment status
  ACTIVE: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  CANCELLED: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  EXPIRED: "bg-red-500/15 text-red-700 dark:text-red-400",
  // User status
  admin: "bg-violet-500/15 text-violet-700 dark:text-violet-400",
  user: "bg-zinc-500/15 text-zinc-700 dark:text-zinc-400",
  banned: "bg-red-500/15 text-red-700 dark:text-red-400",
  // Plans
  TRIAL: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  PRO: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  // Subscription status
  PAST_DUE: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  // Manual request status
  PENDING: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  APPROVED: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  REJECTED: "bg-red-500/15 text-red-700 dark:text-red-400",
  // Subscription source
  LEMON_SQUEEZY: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400",
  MANUAL: "bg-zinc-500/15 text-zinc-700 dark:text-zinc-400",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const colorClass = statusColors[status] ?? "bg-zinc-500/15 text-zinc-700 dark:text-zinc-400";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        colorClass,
        className
      )}
    >
      {status}
    </span>
  );
}
