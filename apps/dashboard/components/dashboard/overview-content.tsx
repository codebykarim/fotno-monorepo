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
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Badge } from "@workspace/ui/components/badge";
import { jsonFetcher } from "@/lib/api/client";
import { OverviewResponse } from "@/lib/types/api";

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
  upload: "border-emerald-200 bg-emerald-50 text-emerald-700",
  gallery_update: "border-blue-200 bg-blue-50 text-blue-700",
  delivery: "border-violet-200 bg-violet-50 text-violet-700",
  system: "border-slate-200 bg-slate-50 text-slate-700",
};

export function OverviewContent() {
  const { data, isLoading } = useSWR<OverviewResponse>("/api/overview", jsonFetcher);

  const stats = [
    {
      label: "Total Galleries",
      value: data?.totalGalleries ?? 0,
      helper: `${data?.publishedGalleries ?? 0} published`,
      icon: LayoutGrid,
      gradient: "from-blue-500/20 via-blue-400/10 to-transparent",
    },
    {
      label: "Total Photos",
      value: data?.totalPhotos ?? 0,
      helper: `${data?.recentUploads7d ?? 0} uploaded this week`,
      icon: Images,
      gradient: "from-cyan-500/20 via-cyan-400/10 to-transparent",
    },
    {
      label: "Loved Photos",
      value: data?.lovedPhotos ?? 0,
      helper: "Client favorites",
      icon: Heart,
      gradient: "from-rose-500/20 via-rose-400/10 to-transparent",
    },
    {
      label: "Storage Used",
      value: formatStorage(data?.totalStorageUsedMb ?? 0),
      helper: "Estimated active footprint",
      icon: Database,
      gradient: "from-indigo-500/20 via-violet-400/10 to-transparent",
    },
  ] as const;

  return (
    <div className="space-y-7">
      <div>
        <h1 className="dashboard-title text-3xl font-semibold tracking-tight">Overview</h1>
        <p className="mt-1 text-muted-foreground">
          Production metrics and human-readable activity from your live galleries.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="relative overflow-hidden border-border/70 bg-white/75 shadow-[0_18px_45px_-35px_rgba(2,6,23,0.8)]"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient}`} />
              <CardHeader className="relative pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative flex items-center justify-between">
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div>
                    <p className="text-3xl font-semibold tracking-tight">{stat.value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{stat.helper}</p>
                  </div>
                )}
                <div className="rounded-xl border border-white/50 bg-white/70 p-2 shadow-sm">
                  <Icon className="h-4 w-4 text-foreground/75" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-border/70 bg-white/78 shadow-[0_18px_45px_-35px_rgba(2,6,23,0.7)]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Activity Log</CardTitle>
          <Badge variant="outline" className="gap-1 rounded-full px-2.5 py-1">
            <Clock3 className="h-3.5 w-3.5" />
            Live feed
          </Badge>
        </CardHeader>
        <CardContent>
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
              const toneClass = activityTone[item.type ?? "system"] ?? activityTone.system;
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-border/70 bg-background/85 p-3"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className={`rounded-full border px-2 py-1 text-[11px] font-medium ${toneClass}`}>
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
                    <p className="truncate text-sm font-medium text-foreground">{item.message}</p>
                  </div>
                  <p className="shrink-0 text-xs text-muted-foreground">{formatRelativeTime(item.at)}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
