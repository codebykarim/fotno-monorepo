"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Download,
  Eye,
  Heart,
  Users,
  TrendingUp,
  RefreshCw,
  Gauge,
  Image as ImageIcon,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@workspace/ui/components/chart";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { FeatureGate } from "@/components/dashboard/feature-gate";

type PhotoInfo = {
  id: string;
  thumbnailUrl: string;
  previewUrl: string;
  originalFilename: string;
};

type TopPhoto = {
  photoId: string;
  count: number;
  photo: PhotoInfo | null;
};

type ActivityEvent = {
  type: "view" | "download";
  createdAt: string;
  viewerName: string | null;
  photoId: string | null;
  eventType: string | null;
  photo: PhotoInfo | null;
};

type EngagementBreakdown = {
  reach: number;
  downloads: number;
  favorites: number;
  returning: number;
};

type AnalyticsData = {
  totalViews: number;
  uniqueViews: number;
  totalDownloads: number;
  totalFavorites: number;
  conversionRate: number;
  engagementScore: number;
  engagementBreakdown: EngagementBreakdown;
  viewsByDay: { date: string; count: number; uniqueCount: number }[];
  downloadsByDay: { date: string; count: number }[];
  topDownloadedPhotos: TopPhoto[];
  recentActivity: ActivityEvent[];
};

type Props = {
  galleryId: string;
};

const overviewChartConfig = {
  uniqueViews: {
    label: "Unique Views",
    color: "var(--chart-1)",
  },
  downloads: {
    label: "Downloads",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const viewsChartConfig = {
  count: {
    label: "Total Views",
    color: "var(--chart-1)",
  },
  uniqueCount: {
    label: "Unique Views",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

const downloadsChartConfig = {
  downloads: {
    label: "Downloads",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function formatTime(isoString: string) {
  const now = Date.now();
  const time = new Date(isoString).getTime();
  const diffSec = Math.round((now - time) / 1000);

  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return new Date(isoString).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

/* ─── Stat Card ───────────────────────────────────────────────── */

function StatCard({
  label,
  value,
  subtitle,
  icon: Icon,
  loading,
}: {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: typeof Eye;
  loading: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{label}</p>
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2">
          {loading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <>
              <p className="text-3xl font-bold tabular-nums tracking-tight">
                {typeof value === "number" ? value.toLocaleString() : value}
              </p>
              {subtitle && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {subtitle}
                </p>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Engagement Score ─────────────────────────────────────────── */

function getScoreColor(score: number) {
  if (score >= 70) return "text-emerald-500";
  if (score >= 40) return "text-amber-500";
  return "text-muted-foreground";
}

function getScoreLabel(score: number) {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Strong";
  if (score >= 40) return "Growing";
  if (score >= 20) return "Early";
  return "New";
}

function getScoreRingColor(score: number) {
  if (score >= 70) return "stroke-emerald-500";
  if (score >= 40) return "stroke-amber-500";
  return "stroke-muted-foreground/40";
}

function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/50"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`transition-all duration-700 ${getScoreRingColor(score)}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-xl font-bold tabular-nums ${getScoreColor(score)}`}>
          {score}
        </span>
      </div>
    </div>
  );
}

function BreakdownRow({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: typeof Eye;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon className="h-3.5 w-3.5" style={{ color }} />
      <span className="flex-1 text-xs text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <div className="h-2 w-16 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${value}%`, backgroundColor: color }}
          />
        </div>
        <span className="w-8 text-right text-[10px] tabular-nums text-muted-foreground">
          {value}%
        </span>
      </div>
    </div>
  );
}

function EngagementScoreCard({
  score,
  breakdown,
  loading,
}: {
  score: number;
  breakdown: EngagementBreakdown | null;
  loading: boolean;
}) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center gap-5">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start gap-5">
          <ScoreRing score={score} />
          <div className="flex-1 min-w-0">
            <div className="mb-3">
              <p className="text-sm font-medium">
                Engagement Score:{" "}
                <span className={getScoreColor(score)}>
                  {getScoreLabel(score)}
                </span>
              </p>
              <p className="text-[11px] text-muted-foreground">
                Composite of reach, conversions, and return visits
              </p>
            </div>
            <div className="space-y-2">
              <BreakdownRow
                label="Reach"
                value={breakdown?.reach ?? 0}
                icon={Users}
                color="var(--chart-1)"
              />
              <BreakdownRow
                label="Downloads"
                value={breakdown?.downloads ?? 0}
                icon={Download}
                color="var(--chart-2)"
              />
              <BreakdownRow
                label="Favorites"
                value={breakdown?.favorites ?? 0}
                icon={Heart}
                color="var(--chart-4)"
              />
              <BreakdownRow
                label="Returning"
                value={breakdown?.returning ?? 0}
                icon={RefreshCw}
                color="var(--chart-5)"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Top Photos ──────────────────────────────────────────────── */

function TopDownloadedPhotos({
  photos,
  loading,
  onPhotoClick,
}: {
  photos: TopPhoto[];
  loading: boolean;
  onPhotoClick: (photo: PhotoInfo) => void;
}) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded" />
            <div className="flex-1">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="mt-1 h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="flex h-[120px] items-center justify-center">
        <p className="text-sm text-muted-foreground">No downloads yet</p>
      </div>
    );
  }

  const maxCount = photos[0]?.count ?? 1;

  return (
    <div className="space-y-3">
      {photos.map((item, index) => (
        <div key={item.photoId} className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => item.photo && onPhotoClick(item.photo)}
            className="relative h-10 w-10 shrink-0 overflow-hidden rounded border border-border bg-muted transition-shadow hover:ring-2 hover:ring-primary/40 cursor-pointer"
          >
            {item.photo ? (
              <img
                src={item.photo.thumbnailUrl}
                alt={item.photo.originalFilename}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
            <div className="absolute top-0 left-0 flex h-4 w-4 items-center justify-center rounded-br bg-background/80 text-[9px] font-bold text-foreground">
              {index + 1}
            </div>
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium">
              {item.photo?.originalFilename ?? "Deleted photo"}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(item.count / maxCount) * 100}%`,
                    backgroundColor: "var(--chart-2)",
                  }}
                />
              </div>
              <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">
                {item.count}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Activity Feed ───────────────────────────────────────────── */

function ActivityFeed({
  events,
  loading,
  onPhotoClick,
}: {
  events: ActivityEvent[];
  loading: boolean;
  onPhotoClick: (photo: PhotoInfo) => void;
}) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <Skeleton className="mt-0.5 h-6 w-6 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-3.5 w-48" />
              <Skeleton className="mt-1 h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex h-[120px] items-center justify-center">
        <p className="text-sm text-muted-foreground">No activity yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {events.map((event, i) => {
        const isView = event.type === "view";
        const isGalleryDownload = event.eventType === "gallery";
        const who = event.viewerName || "Someone";

        let description: string;
        if (isView) {
          description = "Viewed the gallery";
        } else if (isGalleryDownload) {
          description = `${who} downloaded all photos`;
        } else if (event.photo) {
          description = `${who} downloaded ${event.photo.originalFilename}`;
        } else {
          description = `${who} downloaded a photo`;
        }

        return (
          <div
            key={`${event.type}-${event.createdAt}-${i}`}
            className="flex items-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted/50"
          >
            <div
              className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                isView
                  ? "bg-chart-1/15 text-chart-1"
                  : "bg-chart-2/15 text-chart-2"
              }`}
            >
              {isView ? (
                <Eye className="h-3 w-3" />
              ) : (
                <Download className="h-3 w-3" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-foreground">{description}</p>
              <p className="text-[10px] text-muted-foreground">
                {formatTime(event.createdAt)}
              </p>
            </div>
            {!isView && event.photo && (
              <button
                type="button"
                onClick={() => event.photo && onPhotoClick(event.photo)}
                className="h-8 w-8 shrink-0 overflow-hidden rounded border border-border bg-muted transition-shadow hover:ring-2 hover:ring-primary/40 cursor-pointer"
              >
                <img
                  src={event.photo.thumbnailUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Main Component ──────────────────────────────────────────── */

export function AnalyticsSettings({ galleryId }: Props) {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d" | "all">("30d");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxPhoto, setLightboxPhoto] = useState<PhotoInfo | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/galleries/${galleryId}/analytics?period=${period}`,
      );
      if (res.ok) {
        setData(await res.json());
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [galleryId, period]);

  useEffect(() => {
    void fetchAnalytics();
  }, [fetchAnalytics]);

  // Merge views and downloads for the overview chart
  const combinedData = useMemo(() => {
    if (!data) return [];

    const dateMap = new Map<
      string,
      { date: string; uniqueViews: number; downloads: number }
    >();

    for (const v of data.viewsByDay) {
      dateMap.set(v.date, {
        date: v.date,
        uniqueViews: v.uniqueCount,
        downloads: 0,
      });
    }

    for (const d of data.downloadsByDay) {
      const existing = dateMap.get(d.date);
      if (existing) {
        existing.downloads = d.count;
      } else {
        dateMap.set(d.date, {
          date: d.date,
          uniqueViews: 0,
          downloads: d.count,
        });
      }
    }

    return Array.from(dateMap.values()).sort((a, b) =>
      a.date.localeCompare(b.date),
    );
  }, [data]);

  const viewsData = useMemo(
    () =>
      (data?.viewsByDay ?? []).map((d) => ({
        date: d.date,
        count: d.count,
        uniqueCount: d.uniqueCount,
      })),
    [data],
  );

  const downloadsData = useMemo(
    () =>
      (data?.downloadsByDay ?? []).map((d) => ({
        date: d.date,
        downloads: d.count,
      })),
    [data],
  );

  const hasData = combinedData.length > 0;

  return (
    <FeatureGate featureKey="ANALYTICS">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Analytics</h2>
            <p className="text-sm text-muted-foreground">
              Track gallery views, downloads, and engagement
            </p>
          </div>
          <Select
            value={period}
            onValueChange={(v) => setPeriod(v as typeof period)}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stat Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Unique Views"
            value={data?.uniqueViews ?? 0}
            subtitle={`${data?.totalViews ?? 0} total page loads`}
            icon={Users}
            loading={loading}
          />
          <StatCard
            label="Total Downloads"
            value={data?.totalDownloads ?? 0}
            icon={Download}
            loading={loading}
          />
          <StatCard
            label="Conversion Rate"
            value={data ? `${data.conversionRate}%` : "0%"}
            subtitle="Downloads / unique views"
            icon={TrendingUp}
            loading={loading}
          />
          <StatCard
            label="Favorites"
            value={data?.totalFavorites ?? 0}
            icon={Heart}
            loading={loading}
          />
        </div>

        {/* Engagement Score */}
        <EngagementScoreCard
          score={data?.engagementScore ?? 0}
          breakdown={data?.engagementBreakdown ?? null}
          loading={loading}
        />

        {/* Overview Area Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Overview</CardTitle>
            <CardDescription>
              Unique views and downloads over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[250px] w-full" />
            ) : !hasData ? (
              <div className="flex h-[250px] items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  No data for this period
                </p>
              </div>
            ) : (
              <ChartContainer
                config={overviewChartConfig}
                className="h-[250px] w-full"
              >
                <AreaChart data={combinedData} accessibilityLayer>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={formatDate}
                    fontSize={12}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    allowDecimals={false}
                    fontSize={12}
                    width={32}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value: string) =>
                          formatDate(String(value))
                        }
                      />
                    }
                  />
                  <defs>
                    <linearGradient
                      id="fillUniqueViews"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--color-uniqueViews)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-uniqueViews)"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                    <linearGradient
                      id="fillDownloads"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--color-downloads)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-downloads)"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    dataKey="uniqueViews"
                    type="monotone"
                    fill="url(#fillUniqueViews)"
                    stroke="var(--color-uniqueViews)"
                    strokeWidth={2}
                  />
                  <Area
                    dataKey="downloads"
                    type="monotone"
                    fill="url(#fillDownloads)"
                    stroke="var(--color-downloads)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Views + Downloads side by side */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Views Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Eye className="h-4 w-4 text-muted-foreground" />
                Views
              </CardTitle>
              <CardDescription>Total vs unique views per day</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[180px] w-full" />
              ) : viewsData.length === 0 ? (
                <div className="flex h-[180px] items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    No views for this period
                  </p>
                </div>
              ) : (
                <ChartContainer
                  config={viewsChartConfig}
                  className="h-[180px] w-full"
                >
                  <BarChart data={viewsData} accessibilityLayer>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={formatDate}
                      fontSize={12}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      allowDecimals={false}
                      fontSize={12}
                      width={32}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          labelFormatter={(value: string) =>
                            formatDate(String(value))
                          }
                        />
                      }
                    />
                    <Bar
                      dataKey="count"
                      fill="var(--color-count)"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="uniqueCount"
                      fill="var(--color-uniqueCount)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          {/* Downloads Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Download className="h-4 w-4 text-muted-foreground" />
                Downloads
              </CardTitle>
              <CardDescription>
                Confirmed file downloads per day
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[180px] w-full" />
              ) : downloadsData.length === 0 ? (
                <div className="flex h-[180px] items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    No downloads for this period
                  </p>
                </div>
              ) : (
                <ChartContainer
                  config={downloadsChartConfig}
                  className="h-[180px] w-full"
                >
                  <BarChart data={downloadsData} accessibilityLayer>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={formatDate}
                      fontSize={12}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      allowDecimals={false}
                      fontSize={12}
                      width={32}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          labelFormatter={(value: string) =>
                            formatDate(String(value))
                          }
                        />
                      }
                    />
                    <Bar
                      dataKey="downloads"
                      fill="var(--color-downloads)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top Photos + Activity Feed side by side */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Top Downloaded Photos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                Top Downloaded Photos
              </CardTitle>
              <CardDescription>
                Most popular photos by download count
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TopDownloadedPhotos
                photos={data?.topDownloadedPhotos ?? []}
                loading={loading}
                onPhotoClick={setLightboxPhoto}
              />
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest views and downloads</CardDescription>
            </CardHeader>
            <CardContent className="max-h-[350px] overflow-y-auto">
              <ActivityFeed
                events={data?.recentActivity ?? []}
                loading={loading}
                onPhotoClick={setLightboxPhoto}
              />
            </CardContent>
          </Card>
        </div>
        {/* Photo Lightbox */}
        <Dialog
          open={!!lightboxPhoto}
          onOpenChange={(open) => !open && setLightboxPhoto(null)}
        >
          <DialogContent className="max-w-3xl p-2 sm:p-4">
            <DialogTitle></DialogTitle>
            {lightboxPhoto && (
              <div className="flex flex-col items-center gap-3">
                <img
                  src={lightboxPhoto.previewUrl}
                  alt={lightboxPhoto.originalFilename}
                  className="max-h-[70vh] w-auto rounded-lg object-contain"
                />
                <p className="text-sm text-muted-foreground">
                  {lightboxPhoto.originalFilename}
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </FeatureGate>
  );
}
