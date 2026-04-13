"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import { jsonFetcher } from "@/lib/api/client";
import { StatCard } from "@/components/stat-card";
import { formatCurrency, formatBytes } from "@/lib/format";
import type { AnalyticsData } from "@/lib/types/admin";
import { cn } from "@workspace/ui/lib/utils";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "@workspace/ui/components/chart";

const PERIODS = ["7d", "30d", "90d", "1y"] as const;

const COUNTRY_COLORS = [
  "hsl(221, 83%, 53%)",
  "hsl(142, 71%, 45%)",
  "hsl(47, 96%, 53%)",
  "hsl(0, 72%, 51%)",
  "hsl(271, 76%, 53%)",
  "hsl(200, 95%, 39%)",
  "hsl(24, 95%, 53%)",
  "hsl(174, 72%, 40%)",
  "hsl(314, 72%, 51%)",
  "hsl(33, 100%, 50%)",
];

function getCountryFlag(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((c) => 0x1f1e6 + c.charCodeAt(0) - 65);
  return String.fromCodePoint(...codePoints);
}

// --- Chart wrapper components ---

function TimeSeriesAreaChart({
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
  const chartConfig: ChartConfig = {
    [valueKey]: { label: title, color: "hsl(221, 83%, 53%)" },
  };

  if (!data || data.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">{title}</h3>
        <p className="text-sm text-muted-foreground">No data for this period</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">{title}</h3>
      <ChartContainer config={chartConfig} className="h-48 w-full">
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey={data[0]?.date !== undefined ? "date" : "month"}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(v: string) => v.slice(-5)}
            fontSize={11}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={4}
            fontSize={11}
            tickFormatter={formatValue}
            width={50}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={
                  formatValue
                    ? (value: number) => formatValue(value)
                    : undefined
                }
              />
            }
          />
          <defs>
            <linearGradient id={`fill-${valueKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={`var(--color-${valueKey})`} stopOpacity={0.3} />
              <stop offset="95%" stopColor={`var(--color-${valueKey})`} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey={valueKey}
            stroke={`var(--color-${valueKey})`}
            fill={`url(#fill-${valueKey})`}
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}

function TimeSeriesBarChart({
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
  const chartConfig: ChartConfig = {
    [valueKey]: { label: title, color: "hsl(142, 71%, 45%)" },
  };

  if (!data || data.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">{title}</h3>
        <p className="text-sm text-muted-foreground">No data for this period</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">{title}</h3>
      <ChartContainer config={chartConfig} className="h-48 w-full">
        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey={data[0]?.date !== undefined ? "date" : "month"}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(v: string) => v.slice(-5)}
            fontSize={11}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={4}
            fontSize={11}
            tickFormatter={formatValue}
            width={50}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={
                  formatValue
                    ? (value: number) => formatValue(value)
                    : undefined
                }
              />
            }
          />
          <Bar
            dataKey={valueKey}
            fill={`var(--color-${valueKey})`}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}

function CountryPieChart({
  data,
}: {
  data: { country: string; count: number }[];
}) {
  const chartConfig = useMemo(() => {
    const config: ChartConfig = {};
    data.forEach((d, i) => {
      config[d.country] = {
        label: `${getCountryFlag(d.country)} ${d.country}`,
        color: COUNTRY_COLORS[i % COUNTRY_COLORS.length],
      };
    });
    return config;
  }, [data]);

  const totalUsers = useMemo(
    () => data.reduce((sum, d) => sum + d.count, 0),
    [data],
  );

  if (!data || data.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Users by Country</h3>
        <p className="text-sm text-muted-foreground">No country data available</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Users by Country</h3>
      <div className="flex items-start gap-6">
        <ChartContainer config={chartConfig} className="h-52 w-52 shrink-0">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={data}
              dataKey="count"
              nameKey="country"
              innerRadius={50}
              outerRadius={80}
              strokeWidth={2}
            >
              {data.map((d, i) => (
                <Cell
                  key={d.country}
                  fill={COUNTRY_COLORS[i % COUNTRY_COLORS.length]}
                />
              ))}
              <Label
                content={({ viewBox }: any) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {totalUsers}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 20}
                          className="fill-muted-foreground text-xs"
                        >
                          users
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="flex flex-col gap-1.5 pt-2 min-w-0">
          {data.slice(0, 10).map((d, i) => (
            <div key={d.country} className="flex items-center gap-2 text-sm">
              <div
                className="h-2.5 w-2.5 rounded-sm shrink-0"
                style={{ backgroundColor: COUNTRY_COLORS[i % COUNTRY_COLORS.length] }}
              />
              <span className="truncate">
                {getCountryFlag(d.country)} {d.country}
              </span>
              <span className="ml-auto font-medium tabular-nums">{d.count}</span>
            </div>
          ))}
          {data.length > 10 && (
            <span className="text-xs text-muted-foreground">
              +{data.length - 10} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function CountryBarChart({
  data,
}: {
  data: { country: string; count: number }[];
}) {
  const top10 = data.slice(0, 10).map((d) => ({
    ...d,
    label: `${getCountryFlag(d.country)} ${d.country}`,
  }));

  const chartConfig: ChartConfig = {
    count: { label: "Users", color: "hsl(221, 83%, 53%)" },
  };

  if (!top10.length) {
    return (
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Top Countries</h3>
        <p className="text-sm text-muted-foreground">No country data available</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Top Countries</h3>
      <ChartContainer config={chartConfig} className="h-64 w-full">
        <BarChart data={top10} layout="vertical" margin={{ top: 4, right: 4, bottom: 0, left: 60 }}>
          <CartesianGrid horizontal={false} strokeDasharray="3 3" />
          <XAxis type="number" tickLine={false} axisLine={false} fontSize={11} />
          <YAxis
            type="category"
            dataKey="label"
            tickLine={false}
            axisLine={false}
            fontSize={12}
            width={60}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="count" fill="var(--color-count)" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}

// --- Main page ---

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

          {/* Country stats */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <CountryPieChart data={data.countryDistribution} />
            <CountryBarChart data={data.countryDistribution} />
          </div>

          {/* Time series charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <TimeSeriesAreaChart title="User Signups" data={data.userSignups} />
            <TimeSeriesAreaChart title="Gallery Creations" data={data.galleryCreations} />
            <TimeSeriesBarChart title="Upload Volume (count)" data={data.uploadVolume} />
            <TimeSeriesAreaChart
              title="Upload Volume (bytes)"
              data={data.uploadVolume}
              valueKey="bytes"
              formatValue={(v) => formatBytes(v)}
            />
            <TimeSeriesBarChart
              title="Revenue by Month"
              data={data.revenueByMonth}
              valueKey="total_cents"
              formatValue={(v) => formatCurrency(v)}
            />
            <TimeSeriesAreaChart
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
