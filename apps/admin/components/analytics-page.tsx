"use client";

import { useState } from "react";
import useSWR from "swr";
import { jsonFetcher } from "@/lib/api/client";
import { StatCard } from "@/components/stat-card";
import { formatCurrency, formatBytes } from "@/lib/format";
import type { AnalyticsData } from "@/lib/types/admin";
import { cn } from "@workspace/ui/lib/utils";

const PERIODS = ["7d", "30d", "90d", "1y"] as const;

function BarChart({
  title,
  data,
  valueKey = "count",
  formatValue,
}: {
  title: string;
  data: { date?: string; month?: string; [key: string]: any }[];
  valueKey?: string;
  formatValue?: (v: number) => string;
}) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">{title}</h3>
        <p className="text-sm text-muted-foreground">No data for this period</p>
      </div>
    );
  }

  const values = data.map((d) => Number(d[valueKey] ?? 0));
  const max = Math.max(...values, 1);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">{title}</h3>
      <div className="flex items-end gap-1 h-32">
        {data.map((d, i) => {
          const value = Number(d[valueKey] ?? 0);
          const heightPct = (value / max) * 100;
          const label = d.date ?? d.month ?? "";
          return (
            <div
              key={i}
              className="flex-1 flex flex-col items-center gap-1 group relative"
            >
              <div className="w-full flex flex-col items-center justify-end h-28">
                <div
                  className="w-full max-w-[24px] rounded-t bg-primary/80 hover:bg-primary transition-colors"
                  style={{ height: `${Math.max(2, heightPct)}%` }}
                />
              </div>
              {/* Tooltip on hover */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-foreground text-background text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                {formatValue ? formatValue(value) : value} — {label}
              </div>
            </div>
          );
        })}
      </div>
      {/* X-axis labels - show first, middle, last */}
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>{data[0]?.date ?? data[0]?.month ?? ""}</span>
        {data.length > 2 && (
          <span>
            {data[Math.floor(data.length / 2)]?.date ??
              data[Math.floor(data.length / 2)]?.month ??
              ""}
          </span>
        )}
        <span>
          {data[data.length - 1]?.date ?? data[data.length - 1]?.month ?? ""}
        </span>
      </div>
    </div>
  );
}

export function AnalyticsPage() {
  const [period, setPeriod] = useState<string>("30d");

  const { data, isLoading } = useSWR<AnalyticsData>(
    `/api/analytics?period=${period}`,
    jsonFetcher,
    { refreshInterval: 60000 }
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <div className="flex rounded-lg border border-border overflow-hidden">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "px-3 py-1.5 text-sm transition-colors",
                period === p
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {isLoading || !data ? (
        <div className="text-muted-foreground">Loading analytics...</div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard title="Total Revenue" value={formatCurrency(data.summary.totalRevenue)} />
            <StatCard title="MRR" value={formatCurrency(data.summary.mrr)} />
            <StatCard
              title="Avg Galleries/User"
              value={data.summary.avgGalleriesPerUser.toFixed(1)}
            />
            <StatCard
              title="Avg Photos/Gallery"
              value={data.summary.avgPhotosPerGallery.toFixed(1)}
            />
          </div>

          {/* Plan distribution */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Plan Distribution
            </h3>
            <div className="flex gap-4">
              {data.planDistribution.map((p) => (
                <div key={p.plan} className="flex items-center gap-2">
                  <div
                    className={cn(
                      "h-3 w-3 rounded-sm",
                      p.plan === "FREE" ? "bg-green-500" :
                      p.plan === "PRO" ? "bg-emerald-500" :
                      p.plan === "EXPIRED" ? "bg-zinc-400" :
                      "bg-zinc-400"
                    )}
                  />
                  <span className="text-sm">{p.plan}</span>
                  <span className="text-sm font-medium">{p.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <BarChart title="User Signups" data={data.userSignups} />
            <BarChart title="Gallery Creations" data={data.galleryCreations} />
            <BarChart title="Upload Volume (count)" data={data.uploadVolume} />
            <BarChart
              title="Upload Volume (bytes)"
              data={data.uploadVolume}
              valueKey="bytes"
              formatValue={(v) => formatBytes(v)}
            />
            <BarChart
              title="Revenue by Month"
              data={data.revenueByMonth}
              valueKey="total_cents"
              formatValue={(v) => formatCurrency(v)}
            />
            <BarChart
              title="Storage Growth"
              data={data.storageGrowth}
              valueKey="delta"
              formatValue={(v) => formatBytes(v)}
            />
          </div>
        </>
      )}
    </div>
  );
}
