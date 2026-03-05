"use client";

import { useState } from "react";
import useSWR from "swr";
import { jsonFetcher } from "@/lib/api/client";
import { StatCard } from "@/components/stat-card";
import { DataTable, type Column } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { formatCurrency, formatDate } from "@/lib/format";
import type { AdminPaymentsOverview, AdminPayment } from "@/lib/types/admin";
import { DollarSign, CheckCircle, XCircle, Clock } from "lucide-react";

const STATUS_OPTIONS = ["all", "ACTIVE", "CANCELLED", "EXPIRED"];

export function PaymentsPage() {
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const queryParams = new URLSearchParams({
    status,
    page: String(page),
    pageSize: "50",
  }).toString();

  const { data, isLoading } = useSWR<AdminPaymentsOverview & { total: number; page: number; pageSize: number }>(
    `/api/payments?${queryParams}`,
    jsonFetcher,
    { refreshInterval: 60000 }
  );

  const columns: Column<AdminPayment>[] = [
    {
      key: "user",
      header: "User",
      render: (p) => p.user ? (
        <div>
          <p className="font-medium">{p.user.name}</p>
          <p className="text-xs text-muted-foreground">{p.user.email}</p>
        </div>
      ) : "—",
    },
    {
      key: "plan",
      header: "Plan",
      render: (p) => <StatusBadge status={p.plan} />,
    },
    {
      key: "status",
      header: "Status",
      render: (p) => <StatusBadge status={p.status} />,
    },
    {
      key: "amount",
      header: "Amount",
      render: (p) => <span className="font-medium">{formatCurrency(p.amount_cents)}</span>,
    },
    {
      key: "started",
      header: "Started",
      render: (p) => p.planStartedAt ? formatDate(p.planStartedAt) : "—",
    },
    {
      key: "expires",
      header: "Expires",
      render: (p) => p.planExpiresAt ? formatDate(p.planExpiresAt) : "—",
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Payments</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={data ? formatCurrency(data.totalRevenue) : "—"}
          icon={DollarSign}
        />
        <StatCard
          title="Active Subs"
          value={data?.activeCount ?? "—"}
          icon={CheckCircle}
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
        data={data?.payments ?? []}
        total={data?.total}
        page={page}
        pageSize={50}
        onPageChange={setPage}
        isLoading={isLoading}
        filters={
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
        }
      />
    </div>
  );
}
