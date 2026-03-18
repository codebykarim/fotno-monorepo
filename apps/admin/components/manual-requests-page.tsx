"use client";

import { useState } from "react";
import useSWR from "swr";
import { jsonFetcher, apiRequest } from "@/lib/api/client";
import { DataTable, type Column } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";
import type { AdminManualRequest, AdminManualRequestsResponse } from "@/lib/types/admin";

const STORAGE_TIER_LABELS: Record<number, string> = {
  50: "50 GB",
  100: "100 GB",
  250: "250 GB",
  500: "500 GB",
  1000: "1 TB",
  2000: "2 TB",
};

const STATUS_OPTIONS = ["all", "PENDING", "APPROVED", "REJECTED"];

export function ManualRequestsPage() {
  const [status, setStatus] = useState("PENDING");
  const [page, setPage] = useState(1);
  const [approving, setApproving] = useState<string | null>(null);

  const queryParams = new URLSearchParams({
    status,
    page: String(page),
    pageSize: "50",
  }).toString();

  const { data, isLoading, mutate } = useSWR<AdminManualRequestsResponse>(
    `/api/admin/manual-requests?${queryParams}`,
    jsonFetcher,
    { refreshInterval: 30000 },
  );

  const handleApprove = async (request: AdminManualRequest) => {
    const durationMonths = prompt("Subscription duration in months:", "1");
    if (!durationMonths) return;

    const months = parseInt(durationMonths, 10);
    if (isNaN(months) || months < 1) {
      toast.error("Invalid duration");
      return;
    }

    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + months);

    const notes = prompt("Admin notes (optional):", "");

    setApproving(request.id);
    try {
      await apiRequest(`/api/admin/manual-requests/${request.id}/approve`, {
        method: "POST",
        body: JSON.stringify({
          expiresAt: expiresAt.toISOString(),
          adminNotes: notes || undefined,
        }),
      });
      toast.success(`Approved ${request.user.name}'s request for ${STORAGE_TIER_LABELS[request.storageTierGb] ?? request.storageTierGb + " GB"}`);
      await mutate();
    } catch (err) {
      toast.error("Failed to approve request");
    } finally {
      setApproving(null);
    }
  };

  const handleReject = async (request: AdminManualRequest) => {
    const notes = prompt("Rejection reason (optional):", "");

    try {
      await apiRequest(`/api/admin/manual-requests/${request.id}/reject`, {
        method: "POST",
        body: JSON.stringify({ adminNotes: notes || undefined }),
      });
      toast.success("Request rejected");
      await mutate();
    } catch (err) {
      toast.error("Failed to reject request");
    }
  };

  const columns: Column<AdminManualRequest>[] = [
    {
      key: "user",
      header: "User",
      render: (r) => (
        <div>
          <p className="font-medium">{r.user.name}</p>
          <p className="text-xs text-muted-foreground">{r.user.email}</p>
        </div>
      ),
    },
    {
      key: "tier",
      header: "Requested Tier",
      render: (r) => (
        <span className="font-medium">
          {STORAGE_TIER_LABELS[r.storageTierGb] ?? `${r.storageTierGb} GB`}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: "userPlan",
      header: "Current Plan",
      render: (r) => <StatusBadge status={r.user.plan} />,
    },
    {
      key: "date",
      header: "Requested",
      render: (r) => formatDate(r.createdAt),
    },
    {
      key: "actions",
      header: "Actions",
      render: (r) =>
        r.status === "PENDING" ? (
          <div className="flex gap-2">
            <button
              onClick={() => handleApprove(r)}
              disabled={approving === r.id}
              className="rounded bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {approving === r.id ? "..." : "Approve"}
            </button>
            <button
              onClick={() => handleReject(r)}
              className="rounded bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700"
            >
              Reject
            </button>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">
            {r.adminNotes || "—"}
          </span>
        ),
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Manual Plan Requests</h1>

      <DataTable
        columns={columns}
        data={data?.requests ?? []}
        total={data?.total}
        page={page}
        pageSize={50}
        onPageChange={setPage}
        isLoading={isLoading}
        filters={
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
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
