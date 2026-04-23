"use client";

import Link from "next/link";
import useSWR from "swr";
import { motion } from "motion/react";
import {
  Activity,
  ArrowRight,
  ChevronRight,
  Heart,
  Image as ImageIcon,
  Inbox,
  LayoutGrid,
  Plus,
  Sparkles,
  Sprout,
} from "lucide-react";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { jsonFetcher } from "@/lib/api/client";
import {
  OverviewResponse,
  StorageEventsResponse,
  StorageSummaryResponse,
} from "@/lib/types/api";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/motion";

function formatRelativeTime(isoString: string) {
  const timestamp = new Date(isoString).getTime();
  const diffSeconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (diffSeconds < 60) return "just now";
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

const bytesToGb = (value: string): string =>
  `${(Number(value) / 1024 ** 3).toFixed(2)} GB`;
const bytesToMb = (value: string): string =>
  `${(Number(value) / 1024 ** 2).toFixed(2)} MB`;
const toUsd = (cents: number): string =>
  `$${(Math.max(0, cents) / 100).toFixed(2)}`;

const activityKindLabel: Record<string, string> = {
  upload: "Upload",
  gallery_update: "Update",
  delivery: "Delivery",
  system: "Event",
};

export function OverviewContent() {
  const { data, isLoading } = useSWR<OverviewResponse>(
    "/api/overview",
    jsonFetcher,
  );

  const { data: summary } = useSWR<StorageSummaryResponse>(
    "/api/storage/summary",
    jsonFetcher,
    { revalidateOnFocus: true },
  );

  const { data: events } = useSWR<StorageEventsResponse>(
    "/api/storage/events?limit=10&offset=0",
    jsonFetcher,
    { revalidateOnFocus: true },
  );

  const smallStats = [
    {
      label: "Total galleries",
      value: data?.totalGalleries ?? 0,
      sub: `${data?.publishedGalleries ?? 0} published`,
      icon: LayoutGrid,
    },
    {
      label: "Total photos",
      value: data?.totalPhotos ?? 0,
      sub: `${data?.recentUploads7d ?? 0} uploaded this week`,
      icon: ImageIcon,
    },
    {
      label: "Loved photos",
      value: data?.lovedPhotos ?? 0,
      sub: "Client favorites",
      icon: Heart,
    },
  ] as const;

  const storagePercent = Math.max(0, Math.min(100, summary?.percentage ?? 0));
  const is95 = storagePercent >= 95;
  const is80 = storagePercent >= 80;
  const ringRadius = 58;
  const ringCirc = 2 * Math.PI * ringRadius;

  const recentEvents = events?.events ?? [];
  const recentActivity = data?.recentActivity ?? [];

  return (
    <div className="space-y-8">
      {/* ── Page header ─────────────────────────── */}
      <motion.div
        className="flex flex-wrap items-end justify-between gap-4"
        initial={fadeInUp.initial}
        animate={fadeInUp.animate}
        transition={fadeInUp.transition}
      >
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            <span>Studio</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground/80">Overview</span>
          </div>
          <h1 className="dashboard-title mt-3 text-3xl font-semibold tracking-tight">
            Overview
          </h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Production metrics and human-readable activity from your live
            galleries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="gap-1.5">
            <Link href="/galleries/new">
              <Plus className="h-4 w-4" />
              New gallery
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* ── Stat strip (3 cells) ─────────────────── */}
      <motion.div
        className="grid gap-3 md:grid-cols-3"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {smallStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} variants={staggerItem}>
              <Card className="border-border/60 bg-card shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md">
                <CardContent className="flex items-center gap-4 px-5 py-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-foreground/80">
                      {stat.label}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {stat.sub}
                    </p>
                  </div>
                  {isLoading ? (
                    <Skeleton className="h-8 w-10" />
                  ) : (
                    <p className="text-3xl font-semibold tracking-tight tabular-nums">
                      {stat.value}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── Storage feature + Activity log ─────────────── */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Storage feature card with radial ring */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <Card className="h-full border-border/60 bg-card shadow-sm">
            <CardContent className="px-6 py-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-foreground whitespace-nowrap">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Storage used
                </div>
                <Link
                  href="/billing"
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary whitespace-nowrap hover:underline"
                >
                  Manage plan
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="grid grid-cols-[150px_1fr] items-center gap-7">
                {/* Ring */}
                <div className="relative h-[150px] w-[150px]">
                  <svg width="150" height="150" viewBox="0 0 150 150">
                    <circle
                      cx="75"
                      cy="75"
                      r={ringRadius}
                      fill="none"
                      className="stroke-muted"
                      strokeWidth="6"
                    />
                    <circle
                      cx="75"
                      cy="75"
                      r={ringRadius}
                      fill="none"
                      className={cn(
                        is95
                          ? "stroke-destructive"
                          : is80
                            ? "stroke-primary/70"
                            : "stroke-primary",
                        "transition-[stroke-dasharray] duration-500",
                      )}
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${(storagePercent / 100) * ringCirc} ${ringCirc}`}
                      transform="rotate(-90 75 75)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <p className="text-3xl font-semibold tracking-tight tabular-nums">
                      {summary?.formatted.used ?? "—"}
                    </p>
                    <p className="mt-1 text-[11.5px] text-muted-foreground">
                      of {summary?.formatted.limit ?? "—"}
                    </p>
                  </div>
                </div>

                {/* Side rows */}
                <div className="flex flex-col">
                  <div className="flex items-center justify-between border-b border-border/50 py-2.5 text-sm">
                    <span className="text-muted-foreground">Usage</span>
                    <span className="font-medium tabular-nums whitespace-nowrap">
                      {storagePercent}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-border/50 py-2.5 text-sm">
                    <span className="text-muted-foreground">Overage</span>
                    <span className="font-medium tabular-nums whitespace-nowrap">
                      {summary ? bytesToGb(summary.overageBytes) : "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-border/50 py-2.5 text-sm">
                    <span className="text-muted-foreground">Est. cost</span>
                    <span className="font-medium tabular-nums whitespace-nowrap">
                      {summary ? toUsd(summary.overageCostCents) : "—"}
                    </span>
                  </div>
                  <p className="mt-3 text-[11.5px] italic text-muted-foreground">
                    Estimated active footprint
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity Log — timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="h-full border-border/60 bg-card shadow-sm">
            <CardContent className="flex h-full flex-col px-6 py-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/10">
                    <Sparkles className="h-3 w-3 text-primary" />
                  </span>
                  Activity Log
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[10.5px] font-medium uppercase tracking-wide text-primary whitespace-nowrap">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                  </span>
                  Live feed
                </div>
              </div>

              <div className="relative flex-1">
                {isLoading && (
                  <div className="space-y-3">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-[92%]" />
                  </div>
                )}

                {!isLoading &&
                  recentActivity.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="grid grid-cols-[24px_1fr] gap-3.5"
                    >
                      <div className="relative flex flex-col items-center">
                        <span className="z-10 flex h-[22px] w-[22px] items-center justify-center rounded-full border-[1.5px] border-primary bg-primary/10">
                          <Activity className="h-2.5 w-2.5 text-primary" />
                        </span>
                        <span className="absolute top-[22px] bottom-[-8px] left-1/2 w-px -translate-x-1/2 bg-[repeating-linear-gradient(to_bottom,var(--border)_0,var(--border)_3px,transparent_3px,transparent_6px)]" />
                      </div>
                      <div className="pb-4">
                        <div className="mb-1 flex items-center gap-2.5">
                          <span className="rounded bg-primary/10 px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wider text-primary">
                            {activityKindLabel[item.type ?? "system"] ??
                              "Event"}
                          </span>
                          <span className="text-[11.5px] tabular-nums text-muted-foreground">
                            {formatRelativeTime(item.at)}
                          </span>
                        </div>
                        <p className="text-[13.5px] leading-[1.5] text-foreground">
                          {item.message}
                        </p>
                      </div>
                    </motion.div>
                  ))}

                {/* Empty-state hint row */}
                <div className="grid grid-cols-[24px_1fr] gap-3.5">
                  <div className="flex flex-col items-center">
                    <span className="mt-1.5 ml-[7px] h-2 w-2 rounded-full border-[1.5px] border-dashed border-muted-foreground" />
                  </div>
                  <p className="text-[12.5px] italic leading-[1.5] text-muted-foreground">
                    {recentActivity.length === 0
                      ? "Create a gallery or upload a photo to see activity here."
                      : "Upload a gallery or invite a client to see more activity here."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ── Recent Events ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <Card className="border-border/60 bg-card shadow-sm">
          <CardContent className="px-6 py-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/10">
                  <Inbox className="h-3 w-3 text-primary" />
                </span>
                Recent Events
              </div>
              <span className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-[11px] font-semibold tabular-nums text-foreground/80">
                {recentEvents.length}
              </span>
            </div>

            {recentEvents.length === 0 ? (
              <div className="flex flex-col items-center px-5 py-6 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-muted">
                  <Sprout className="h-[22px] w-[22px] text-muted-foreground" />
                </div>
                <p className="text-sm font-semibold text-foreground">
                  No storage events yet
                </p>
                <p className="mt-1 max-w-sm text-[12.5px] text-muted-foreground">
                  Uploads, deletions, and plan changes will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentEvents.map((event) => {
                  const delta = Number(event.delta);
                  const magnitude = Math.abs(delta);
                  return (
                    <div
                      key={event.id}
                      className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2 text-sm transition-colors duration-200 hover:border-border hover:bg-muted/30"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">{event.reason}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(event.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <p
                        className={cn(
                          "ml-3 shrink-0 font-medium tabular-nums",
                          delta < 0 ? "text-emerald-600" : "text-foreground",
                        )}
                      >
                        {delta < 0 ? "-" : "+"}
                        {magnitude < 1024 ** 2 * 100
                          ? bytesToMb(String(magnitude))
                          : bytesToGb(String(magnitude))}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
