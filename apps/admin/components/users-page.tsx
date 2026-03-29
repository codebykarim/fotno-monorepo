"use client";

import { useState, useCallback } from "react";
import useSWR from "swr";
import { jsonFetcher, apiRequest } from "@/lib/api/client";
import { DataTable, type Column } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { formatBytes, formatDate } from "@/lib/format";
import type { AdminUser, AdminUserDetail, PaginatedResponse } from "@/lib/types/admin";
import { toast } from "sonner";

const PLANS = ["all", "FREE", "PRO", "EXPIRED"];

export function UsersPage() {
  const [search, setSearch] = useState("");
  const [plan, setPlan] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const queryParams = new URLSearchParams({
    q: search,
    plan,
    page: String(page),
    pageSize: "50",
  }).toString();

  const { data, isLoading, mutate } = useSWR<PaginatedResponse<AdminUser>>(
    `/api/users?${queryParams}`,
    jsonFetcher,
    { refreshInterval: 30000 }
  );

  const handleBan = useCallback(async (userId: string) => {
    if (!confirm("Ban this user?")) return;
    try {
      await apiRequest(`/api/users/${userId}/ban`, { method: "POST", body: JSON.stringify({}) });
      toast.success("User banned");
      mutate();
    } catch (e: any) {
      toast.error(e.message);
    }
  }, [mutate]);

  const handleUnban = useCallback(async (userId: string) => {
    try {
      await apiRequest(`/api/users/${userId}/unban`, { method: "POST", body: JSON.stringify({}) });
      toast.success("User unbanned");
      mutate();
    } catch (e: any) {
      toast.error(e.message);
    }
  }, [mutate]);

  const handleRoleChange = useCallback(async (userId: string, newRole: string) => {
    if (!confirm(`Set role to "${newRole}"?`)) return;
    try {
      await apiRequest(`/api/users/${userId}/role`, {
        method: "POST",
        body: JSON.stringify({ role: newRole }),
      });
      toast.success(`Role set to ${newRole}`);
      mutate();
    } catch (e: any) {
      toast.error(e.message);
    }
  }, [mutate]);

  const columns: Column<AdminUser>[] = [
    {
      key: "name",
      header: "User",
      render: (u) => (
        <div className="flex items-center gap-3">
          {u.image ? (
            <img src={u.image} alt="" className="h-8 w-8 rounded-full object-cover" />
          ) : (
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
              {u.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-medium">{u.name}</p>
            <p className="text-xs text-muted-foreground">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "plan",
      header: "Plan",
      render: (u) => <StatusBadge status={u.plan} />,
    },
    {
      key: "role",
      header: "Role",
      render: (u) => <StatusBadge status={u.banned ? "banned" : (u.role ?? "user")} />,
    },
    {
      key: "storage",
      header: "Storage",
      render: (u) => {
        const used = Number(u.storageUsed);
        const limit = Number(u.storageLimit);
        const pct = limit > 0 ? Math.min(100, (used / limit) * 100) : 0;
        return (
          <div className="min-w-[120px]">
            <div className="flex justify-between text-xs mb-1">
              <span>{formatBytes(u.storageUsed)}</span>
              <span className="text-muted-foreground">{formatBytes(u.storageLimit)}</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: "galleries",
      header: "Galleries",
      render: (u) => u.galleryCount,
    },
    {
      key: "created",
      header: "Created",
      render: (u) => formatDate(u.createdAt),
    },
    {
      key: "actions",
      header: "",
      render: (u) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSelectedUser(selectedUser === u.id ? null : u.id)}
            className="rounded px-2 py-1 text-xs hover:bg-muted"
          >
            Details
          </button>
          {u.banned ? (
            <button
              onClick={() => handleUnban(u.id)}
              className="rounded px-2 py-1 text-xs text-emerald-600 hover:bg-emerald-500/10"
            >
              Unban
            </button>
          ) : (
            <button
              onClick={() => handleBan(u.id)}
              className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-500/10"
            >
              Ban
            </button>
          )}
          <button
            onClick={() => handleRoleChange(u.id, u.role === "admin" ? "user" : "admin")}
            className="rounded px-2 py-1 text-xs hover:bg-muted"
          >
            {u.role === "admin" ? "Demote" : "Promote"}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Users</h1>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        total={data?.total}
        page={page}
        pageSize={50}
        onPageChange={setPage}
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        searchPlaceholder="Search by name or email..."
        isLoading={isLoading}
        filters={
          <select
            value={plan}
            onChange={(e) => { setPlan(e.target.value); setPage(1); }}
            className="h-9 rounded-lg border border-border bg-background px-3 text-sm"
          >
            {PLANS.map((p) => (
              <option key={p} value={p}>
                {p === "all" ? "All Plans" : p}
              </option>
            ))}
          </select>
        }
      />

      {selectedUser && <UserDetailPanel userId={selectedUser} onClose={() => setSelectedUser(null)} />}
    </div>
  );
}

function UserDetailPanel({ userId, onClose }: { userId: string; onClose: () => void }) {
  const { data, isLoading } = useSWR<AdminUserDetail>(
    `/api/users/${userId}`,
    jsonFetcher
  );

  if (isLoading || !data) {
    return (
      <div className="fixed inset-y-0 right-0 w-96 border-l border-border bg-card p-6 shadow-lg z-40">
        <button onClick={onClose} className="text-sm text-muted-foreground mb-4">Close</button>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-y-0 right-0 w-96 border-l border-border bg-card p-6 shadow-lg z-40 overflow-y-auto">
      <button onClick={onClose} className="text-sm text-muted-foreground mb-4 hover:text-foreground">
        &times; Close
      </button>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg">{data.name}</h3>
          <p className="text-sm text-muted-foreground">{data.email}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">Plan</p>
            <StatusBadge status={data.plan} />
          </div>
          <div>
            <p className="text-muted-foreground">Role</p>
            <StatusBadge status={data.banned ? "banned" : (data.role ?? "user")} />
          </div>
          <div>
            <p className="text-muted-foreground">Storage Used</p>
            <p className="font-medium">{formatBytes(data.storageUsed)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Storage Limit</p>
            <p className="font-medium">{formatBytes(data.storageLimit)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Galleries</p>
            <p className="font-medium">{data.galleryCount}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Joined</p>
            <p className="font-medium">{formatDate(data.createdAt)}</p>
          </div>
        </div>

        {data.subscriptions.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Subscriptions</h4>
            <div className="space-y-2">
              {data.subscriptions.map((s) => (
                <div key={s.id} className="flex items-center justify-between text-sm rounded-lg border border-border p-2">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={s.status} />
                    <span>{s.storageTierGb >= 1000 ? `${s.storageTierGb / 1000} TB` : `${s.storageTierGb} GB`}</span>
                    <span className="text-xs text-muted-foreground">
                      {s.source === "STRIPE" ? "Stripe" : "Manual"}
                    </span>
                  </div>
                  <span className="font-medium">${(s.priceCents / 100).toFixed(2)}/mo</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
