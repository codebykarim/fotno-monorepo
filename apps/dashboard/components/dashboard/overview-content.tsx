"use client";

import useSWR from "swr";
import { Activity, Database, Images, LayoutGrid } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { jsonFetcher } from "@/lib/api/client";
import { OverviewResponse } from "@/lib/types/api";

function formatStorage(mb: number) {
  if (mb < 1024) {
    return `${mb.toFixed(1)} MB`;
  }
  return `${(mb / 1024).toFixed(2)} GB`;
}

export function OverviewContent() {
  const { data, isLoading } = useSWR<OverviewResponse>("/api/overview", jsonFetcher);

  const stats = [
    {
      label: "Total Galleries",
      value: data?.totalGalleries ?? 0,
      icon: LayoutGrid,
      gradient: "from-blue-500/20 via-blue-400/10 to-transparent",
    },
    {
      label: "Total Photos",
      value: data?.totalPhotos ?? 0,
      icon: Images,
      gradient: "from-cyan-500/20 via-cyan-400/10 to-transparent",
    },
    {
      label: "Total Storage Used",
      value: formatStorage(data?.totalStorageUsedMb ?? 0),
      icon: Database,
      gradient: "from-indigo-500/20 via-violet-400/10 to-transparent",
    },
    {
      label: "Recent Activity",
      value: data?.recentActivity.length ?? 0,
      icon: Activity,
      gradient: "from-emerald-500/20 via-teal-400/10 to-transparent",
    },
  ] as const;

  return (
    <div className="space-y-7">
      <div>
        <h1 className="dashboard-title text-3xl font-semibold tracking-tight">Overview</h1>
        <p className="mt-1 text-muted-foreground">
          Business snapshot across your galleries and client delivery.
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
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <p className="text-3xl font-semibold tracking-tight">{stat.value}</p>
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
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {isLoading && (
              <>
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-[90%]" />
                <Skeleton className="h-5 w-[75%]" />
              </>
            )}

            {!isLoading && data?.recentActivity.length === 0 && (
              <p className="text-sm text-muted-foreground">No activity yet.</p>
            )}

            {data?.recentActivity.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl border border-border/70 bg-background/80 p-3"
              >
                <p className="text-sm font-medium">{item.message}</p>
                <p className="text-xs text-muted-foreground">{new Date(item.at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
