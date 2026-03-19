"use client";

import { useState } from "react";
import useSWR from "swr";
import { jsonFetcher } from "@/lib/api/client";
import { StatCard } from "@/components/stat-card";
import { DataTable, type Column } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { formatCurrency, formatDate } from "@/lib/format";
import type { AdminSubscriptionsOverview, AdminSubscription } from "@/lib/types/admin";
import { DollarSign, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";

const STORAGE_TIER_LABELS: Record<number, string> = {
  20: "Starter (20 GB)",
  100: "Professional (100 GB)",
  500: "Business (500 GB)",
  [-1]: "Unlimited",
};

const STATUS_OPTIONS = ["all", "ACTIVE", "CANCELLED", "EXPIRED", "PAST_DUE"];
const SOURCE_OPTIONS = ["all", "LEMON_SQUEEZY", "MANUAL"];

export function PaymentsPage() {
  const [status, setStatus] = useState("all");
  const [source, setSource] = useState("all");
  const [page, setPage] = useState(1);

  const queryParams = new URLSearchParams({
    status,
    source,
    page: String(page),
    pageSize: "50",
  }).toString();

  const { data, isLoading } = useSWR<AdminSubscriptionsOverview & { total: number; page: number; pageSize: number }>(
    `/api/payments?${queryParams}`,
    jsonFetcher,
    { refreshInterval: 60000 }
  );

  const columns: Column<AdminSubscription>[] = [
    {
      key: "user",
      header: "User",
      render: (s) => s.user ? (
        <div>
          <p className="font-medium">{s.user.name}</p>
          <p className="text-xs text-muted-foreground">{s.user.email}</p>
        </div>
      ) : "—",
    },
    {
      key: "source",
      header: "Source",
      render: (s) => (
        <span className="text-xs font-medium">
          {s.source === "LEMON_SQUEEZY" ? "Lemon Squeezy" : "Manual"}
        </span>
      ),
    },
    {
      key: "tier",
      header: "Tier",
      render: (s) => (
        <span className="font-medium">
          {STORAGE_TIER_LABELS[s.storageTierGb] ?? `${s.storageTierGb} GB`}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (s) => <StatusBadge status={s.status} />,
    },
    {
      key: "amount",
      header: "Price",
      render: (s) => (
        <span className="font-medium">
          {formatCurrency(s.priceCents)}/{s.currency === "USD" ? "mo" : s.currency}
        </span>
      ),
    },
    {
      key: "period",
      header: "Period End",
      render: (s) => s.currentPeriodEnd ? formatDate(s.currentPeriodEnd) : s.endsAt ? formatDate(s.endsAt) : "—",
    },
    {
      key: "created",
      header: "Created",
      render: (s) => formatDate(s.createdAt),
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Subscriptions</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard
          title="Total Revenue"
          value={data ? formatCurrency(data.totalRevenue) : "—"}
          icon={DollarSign}
        />
        <StatCard
          title="Active"
          value={data?.activeCount ?? "—"}
          icon={CheckCircle}
        />
        <StatCard
          title="Past Due"
          value={data?.pastDueCount ?? "—"}
          icon={AlertTriangle}
        />
        <StatCard
          title="Cancelled"
          value={data?.cancelledCount ?? "—"}
          icon={XCircle}
        />
        <StatCard
          title="Expired"
          value={data?.expiredCount ?? "—"}
          icon={Clock}
        />
      </div>

      <DataTable
        columns={columns}
        data={data?.subscriptions ?? []}
        total={data?.total}
        page={page}
        pageSize={50}
        onPageChange={setPage}
        isLoading={isLoading}
        filters={
          <div className="flex gap-2">
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="h-9 rounded-lg border border-border bg-background px-3 text-sm"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s === "all" ? "All Statuses" : s}
                </option>
              ))}
            </select>
            <select
              value={source}
              onChange={(e) => { setSource(e.target.value); setPage(1); }}
              className="h-9 rounded-lg border border-border bg-background px-3 text-sm"
            >
              {SOURCE_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s === "all" ? "All Sources" : s === "LEMON_SQUEEZY" ? "Lemon Squeezy" : "Manual"}
                </option>
              ))}
            </select>
          </div>
        }
      />
    </div>
  );
}
