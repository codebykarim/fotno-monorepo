"use client";

import { useState } from "react";
import useSWR from "swr";
import { jsonFetcher } from "@/lib/api/client";
import { DataTable, type Column } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { formatBytes, formatDate } from "@/lib/format";
import type { AdminGallery, PaginatedResponse } from "@/lib/types/admin";

const STATUSES = ["all", "published", "draft"];

export function GalleriesPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const queryParams = new URLSearchParams({
    q: search,
    status,
    page: String(page),
    pageSize: "50",
  }).toString();

  const { data, isLoading } = useSWR<PaginatedResponse<AdminGallery>>(
    `/api/galleries?${queryParams}`,
    jsonFetcher,
    { refreshInterval: 30000 }
  );

  const columns: Column<AdminGallery>[] = [
    {
      key: "title",
      header: "Title",
      render: (g) => (
        <div>
          <p className="font-medium">{g.title}</p>
          <p className="text-xs text-muted-foreground">{g.slug}</p>
        </div>
      ),
    },
    {
      key: "owner",
      header: "Owner",
      render: (g) => (
        <div>
          <p className="text-sm">{g.owner.name}</p>
          <p className="text-xs text-muted-foreground">{g.owner.email}</p>
        </div>
      ),
    },
    {
      key: "photos",
      header: "Photos",
      render: (g) => g.photoCount,
    },
    {
      key: "albums",
      header: "Albums",
      render: (g) => g.albumCount,
    },
    {
      key: "status",
      header: "Status",
      render: (g) => (
        <StatusBadge status={g.isPublished ? "published" : "draft"} />
      ),
    },
    {
      key: "storage",
      header: "Storage",
      render: (g) => formatBytes(g.storageUsed),
    },
    {
      key: "created",
      header: "Created",
      render: (g) => formatDate(g.createdAt),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Galleries</h1>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        total={data?.total}
        page={page}
        pageSize={50}
        onPageChange={setPage}
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        searchPlaceholder="Search by title or owner..."
        isLoading={isLoading}
        filters={
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="h-9 rounded-lg border border-border bg-background px-3 text-sm"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All Statuses" : s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        }
      />
    </div>
  );
}
