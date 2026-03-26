"use client";

import useSWR from "swr";
import { jsonFetcher } from "@/lib/api/client";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { formatBytes } from "@/lib/format";
import type { AdminStorageOverview } from "@/lib/types/admin";
import { HardDrive, Database, Gauge } from "lucide-react";

export function StoragePage() {
  const { data, isLoading } = useSWR<AdminStorageOverview>(
    "/api/storage",
    jsonFetcher,
    { refreshInterval: 30000 }
  );

  if (isLoading || !data) {
    return <div className="text-muted-foreground">Loading storage data...</div>;
  }

  const topUsers = data.users.slice(0, 10);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Storage</h1>

      <div className="grid grid-cols-3 gap-4">
        <StatCard title="Total Used" value={formatBytes(data.totalUsed)} icon={HardDrive} />
        <StatCard title="Total Allocated" value={formatBytes(data.totalAllocated)} icon={Database} />
        <StatCard title="Utilization" value={`${data.utilizationPercent}%`} icon={Gauge} />
      </div>

      {/* Top 10 users by storage */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-medium text-muted-foreground mb-4">Top Users by Storage</h2>
        <div className="space-y-3">
          {topUsers.map((u) => {
            const userBytes = Number(u.storageUsed);
            const limitBytes = Number(u.storageLimit || "1");
            const barWidth = limitBytes > 0 ? (userBytes / limitBytes) * 100 : 0;

            return (
              <div key={u.id} className="flex items-center gap-3">
                <div className="w-48 truncate text-sm">
                  <span className="font-medium">{u.name}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{u.email}</span>
                </div>
                <StatusBadge status={u.plan} />
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-20 text-right">
                  {formatBytes(u.storageUsed)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full user storage table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">User</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Plan</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Used</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Limit</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Usage</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Overage</th>
            </tr>
          </thead>
          <tbody>
            {data.users.map((u) => (
              <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3">
                  <p className="font-medium">{u.name}</p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </td>
                <td className="px-4 py-3"><StatusBadge status={u.plan} /></td>
                <td className="px-4 py-3">{formatBytes(u.storageUsed)}</td>
                <td className="px-4 py-3">{formatBytes(u.storageLimit)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${Math.min(100, u.usagePercent)}%` }}
                      />
                    </div>
                    <span className="text-xs">{u.usagePercent}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs">
                  {Number(u.overageBytes) > 0 ? formatBytes(u.overageBytes) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
