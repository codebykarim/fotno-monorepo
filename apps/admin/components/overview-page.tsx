"use client";

import useSWR from "swr";
import { jsonFetcher } from "@/lib/api/client";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { formatBytes, formatNumber } from "@/lib/format";
import type { AdminOverview } from "@/lib/types/admin";
import { Users, Image, Camera, UserPlus, ImagePlus, Upload, HardDrive } from "lucide-react";

export function OverviewPage() {
  const { data, isLoading } = useSWR<AdminOverview>(
    "/api/overview",
    jsonFetcher,
    { refreshInterval: 30000 }
  );

  if (isLoading || !data) {
    return <div className="text-muted-foreground">Loading overview...</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Overview</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Total Users" value={formatNumber(data.totalUsers)} icon={Users} />
        <StatCard title="Galleries" value={formatNumber(data.totalGalleries)} icon={Image} />
        <StatCard title="Photos" value={formatNumber(data.totalPhotos)} icon={Camera} />
        <StatCard title="New Users (Month)" value={formatNumber(data.newUsersThisMonth)} icon={UserPlus} />
        <StatCard title="New Galleries (Month)" value={formatNumber(data.newGalleriesThisMonth)} icon={ImagePlus} />
        <StatCard title="Uploads (Week)" value={formatNumber(data.uploadsThisWeek)} icon={Upload} />
        <StatCard title="Storage Used" value={formatBytes(data.platformStorageUsed)} icon={HardDrive} />
      </div>

      {/* Plan distribution */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-medium text-muted-foreground mb-4">Plan Distribution</h2>
        <div className="flex flex-wrap gap-4">
          {data.planBreakdown.map((item) => (
            <div key={item.plan} className="flex items-center gap-2">
              <StatusBadge status={item.plan} />
              <span className="text-sm font-medium">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
