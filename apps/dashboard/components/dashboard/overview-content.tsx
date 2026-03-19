"use client";

import useSWR from "swr";
import { motion } from "motion/react";
import {
  Activity,
  CheckCircle2,
  Database,
  HardDrive,
  Heart,
  Images,
  LayoutGrid,
  UploadCloud,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Badge } from "@workspace/ui/components/badge";
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

  if (diffSeconds < 60) {
    return "just now";
  }

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  return `${Math.floor(diffHours / 24)}d ago`;
}

const bytesToGb = (value: string): string =>
  `${(Number(value) / 1024 ** 3).toFixed(2)} GB`;
const bytesToMb = (value: string): string =>
  `${(Number(value) / 1024 ** 2).toFixed(2)} MB`;
const toUsd = (cents: number): string =>
  `$${(Math.max(0, cents) / 100).toFixed(2)}`;

const activityTone: Record<string, string> = {
  upload: "border-border bg-primary/8 text-foreground",
  gallery_update: "border-border bg-primary/8 text-foreground",
  delivery: "border-border bg-primary/8 text-foreground",
  system: "border-border bg-muted text-foreground",
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

  const stats = [
    {
      label: "Total Galleries",
      value: data?.totalGalleries ?? 0,
      helper: `${data?.publishedGalleries ?? 0} published`,
      icon: LayoutGrid,
    },
    {
      label: "Total Photos",
      value: data?.totalPhotos ?? 0,
      helper: `${data?.recentUploads7d ?? 0} uploaded this week`,
      icon: Images,
    },
    {
      label: "Loved Photos",
      value: data?.lovedPhotos ?? 0,
      helper: "Client favorites",
      icon: Heart,
    },
    {
      label: "Storage Used",
      value: summary?.formatted.used || "—",
      helper: "Estimated active footprint",
      icon: Database,
    },
  ] as const;

  const storagePercent = Math.max(0, Math.min(100, summary?.percentage ?? 0));
  const is95 = storagePercent >= 95;
  const is80 = storagePercent >= 80;

  return (
    <div className="space-y-8">
      <motion.div
        initial={fadeInUp.initial}
        animate={fadeInUp.animate}
        transition={fadeInUp.transition}
      >
        <h1 className="dashboard-title text-3xl font-semibold tracking-tight">
          Overview
        </h1>
        <p className="mt-1 text-muted-foreground">
          Production metrics and human-readable activity from your live
          galleries.
        </p>
      </motion.div>

      <motion.div
        className="grid gap-5 md:grid-cols-2 xl:grid-cols-4"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} variants={staggerItem}>
              <Card className="relative overflow-hidden border-border/50 bg-card shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/20">
                <CardHeader className="relative pb-2 pt-5 px-5">
                  <CardTitle className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {stat.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative flex items-end justify-between px-5 pb-5">
                  {isLoading ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    <div>
                      <p className="text-4xl font-light tracking-tight text-foreground">
                        {stat.value}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {stat.helper}
                      </p>
                    </div>
                  )}
                  <div className="rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 p-3 ring-1 ring-inset ring-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Activity Log + Storage side by side on desktop */}
      <div className="grid gap-6 lg:grid-cols-5 lg:gap-8">
        {/* Activity Log — takes 3/5 */}
        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-border/50 bg-card shadow-sm h-full">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 pb-4">
              <CardTitle className="text-lg font-medium">Activity Log</CardTitle>
              <Badge
                variant="outline"
                className="gap-1.5 rounded-full px-3 py-1 bg-primary/8 text-xs font-normal border-primary/30"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Live feed
              </Badge>
            </CardHeader>
            <CardContent className="pt-5">
              <div className="space-y-3">
                {isLoading && (
                  <>
                    <Skeleton className="h-14 w-full" />
                    <Skeleton className="h-14 w-[92%]" />
                    <Skeleton className="h-14 w-[78%]" />
                  </>
                )}

                {!isLoading && data?.recentActivity.length === 0 && (
                  <p className="text-sm text-muted-foreground">No activity yet.</p>
                )}

                {data?.recentActivity.map((item, index) => {
                  const toneClass =
                    activityTone[item.type ?? "system"] ?? activityTone.system;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="flex items-center justify-between rounded-xl border border-border/50 bg-background/85 p-3 transition-colors duration-200 hover:border-border"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span
                          className={`rounded-full border px-2 py-1 text-[11px] font-medium ${toneClass}`}
                        >
                          {item.type === "upload" ? (
                            <span className="inline-flex items-center gap-1">
                              <UploadCloud className="h-3 w-3" /> Upload
                            </span>
                          ) : item.type === "gallery_update" ? (
                            <span className="inline-flex items-center gap-1">
                              <Activity className="h-3 w-3" /> Update
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" /> Event
                            </span>
                          )}
                        </span>
                        <p className="truncate text-sm font-medium text-foreground">
                          {item.message}
                        </p>
                      </div>
                      <p className="shrink-0 text-xs text-muted-foreground">
                        {formatRelativeTime(item.at)}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Storage Panel — takes 2/5 */}
        <motion.div
          className="lg:col-span-2 space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {/* Storage Breakdown */}
          <Card className="border-border/50 bg-card shadow-sm">
            <CardHeader className="border-b border-border/40 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-medium">
                <div className="rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 p-1.5 ring-1 ring-inset ring-primary/10">
                  <HardDrive className="h-3.5 w-3.5 text-primary" />
                </div>
                Storage
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 pb-6 space-y-5">
              {/* Progress bar */}
              <div>
                <div className="flex items-center justify-between text-sm mb-2.5">
                  <span className="text-muted-foreground">
                    {summary?.formatted.used || "0 GB"} of {summary?.formatted.limit || "0 GB"}
                  </span>
                  <span className="font-medium">{storagePercent}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      is95 ? "bg-destructive" : is80 ? "bg-primary/70" : "bg-primary"
                    }`}
                    style={{ width: `${storagePercent}%` }}
                  />
                </div>
              </div>

              {/* Breakdown rows */}
              <table className="w-full text-sm">
                <tbody className="divide-y divide-border/50">
                  <tr className="transition-colors hover:bg-muted/30">
                    <td className="py-2 text-muted-foreground">Overage</td>
                    <td className="py-2 text-right font-medium">
                      {summary ? bytesToGb(summary.overageBytes) : "0.00 GB"}
                    </td>
                  </tr>
                  <tr className="transition-colors hover:bg-muted/30">
                    <td className="py-2 text-muted-foreground">Est. cost</td>
                    <td className="py-2 text-right font-medium">
                      {summary ? toUsd(summary.overageCostCents) : "$0.00"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Recent Storage Events */}
          <Card className="border-border/50 bg-card shadow-sm">
            <CardHeader className="border-b border-border/40 pb-4">
              <CardTitle className="text-base font-medium">Recent Events</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2">
                {(events?.events ?? []).length === 0 && (
                  <p className="text-sm text-muted-foreground">No storage events yet.</p>
                )}

                {(events?.events ?? []).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2 text-sm transition-colors duration-200 hover:bg-muted/30 hover:border-border"
                  >
                    <div className="min-w-0">
                      <p className="font-medium truncate">{event.reason}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <p
                      className={`shrink-0 ml-3 font-medium ${
                        Number(event.delta) < 0 ? "text-emerald-600" : "text-foreground"
                      }`}
                    >
                      {Number(event.delta) < 0 ? "-" : "+"}
                      {Number(event.delta) < 1024 ** 2 * 100
                        ? bytesToMb(String(Math.abs(Number(event.delta))))
                        : bytesToGb(String(Math.abs(Number(event.delta))))}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
