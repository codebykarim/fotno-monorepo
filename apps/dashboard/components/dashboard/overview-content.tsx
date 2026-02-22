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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">Business snapshot across your galleries and client delivery.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Galleries</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            {isLoading ? <Skeleton className="h-8 w-20" /> : <p className="text-3xl font-bold">{data?.totalGalleries ?? 0}</p>}
            <LayoutGrid className="h-5 w-5 text-muted-foreground" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Photos</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            {isLoading ? <Skeleton className="h-8 w-20" /> : <p className="text-3xl font-bold">{data?.totalPhotos ?? 0}</p>}
            <Images className="h-5 w-5 text-muted-foreground" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Storage Used</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            {isLoading ? <Skeleton className="h-8 w-28" /> : <p className="text-3xl font-bold">{formatStorage(data?.totalStorageUsedMb ?? 0)}</p>}
            <Database className="h-5 w-5 text-muted-foreground" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            {isLoading ? <Skeleton className="h-8 w-20" /> : <p className="text-3xl font-bold">{data?.recentActivity.length ?? 0}</p>}
            <Activity className="h-5 w-5 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>

      <Card>
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
              <div key={item.id} className="flex items-center justify-between rounded-lg border p-3">
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
