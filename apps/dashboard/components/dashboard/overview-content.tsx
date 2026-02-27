"use client";

import useSWR from "swr";
import {
  Activity,
  CheckCircle2,
  Clock3,
  Database,
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
import { OverviewResponse, StorageSummaryResponse } from "@/lib/types/api";

function formatStorage(mb: number) {
  if (mb < 1024) {
    return `${mb.toFixed(1)} MB`;
  }
  return `${(mb / 1024).toFixed(2)} GB`;
}

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
    {
      revalidateOnFocus: true,
    },
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
      value: summary?.formatted.used ?? "",
      helper: "Estimated active footprint",
      icon: Database,
    },
  ] as const;

  return (
    <div className="space-y-7">
      <div>
        <h1 className="dashboard-title text-3xl font-semibold tracking-tight">
          Overview
        </h1>
        <p className="mt-1 text-muted-foreground">
          Production metrics and human-readable activity from your live
          galleries.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="relative overflow-hidden border-border/70 bg-card shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <CardHeader className="relative pb-2">
                <CardTitle className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative flex items-end justify-between">
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
                <div className="rounded-full bg-primary/10 p-2.5">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-border/70 bg-card shadow-sm">
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

            {data?.recentActivity.map((item) => {
              const toneClass =
                activityTone[item.type ?? "system"] ?? activityTone.system;
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-border/70 bg-background/85 p-3"
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
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
