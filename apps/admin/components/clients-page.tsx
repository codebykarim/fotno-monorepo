"use client";

import { useState } from "react";
import useSWR from "swr";
import { jsonFetcher } from "@/lib/api/client";
import { DataTable, type Column } from "@/components/data-table";
import { formatDate } from "@/lib/format";
import type { AdminClient, PaginatedResponse } from "@/lib/types/admin";

export function ClientsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const queryParams = new URLSearchParams({
    q: search,
    page: String(page),
    pageSize: "50",
  }).toString();

  const { data, isLoading } = useSWR<PaginatedResponse<AdminClient>>(
    `/api/clients?${queryParams}`,
    jsonFetcher,
    { refreshInterval: 30000 }
  );

  const columns: Column<AdminClient>[] = [
    {
      key: "name",
      header: "Name",
      render: (c) => <span className="font-medium">{c.name}</span>,
    },
    {
      key: "email",
      header: "Email",
      render: (c) => c.email,
    },
    {
      key: "phone",
      header: "Phone",
      render: (c) => c.phone ?? "—",
    },
    {
      key: "owner",
      header: "Photographer",
      render: (c) => (
        <div>
          <p className="text-sm">{c.owner.name}</p>
          <p className="text-xs text-muted-foreground">{c.owner.email}</p>
        </div>
      ),
    },
    {
      key: "galleries",
      header: "Galleries",
      render: (c) => c.galleryCount,
    },
    {
      key: "created",
      header: "Created",
      render: (c) => formatDate(c.createdAt),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Clients</h1>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        total={data?.total}
        page={page}
        pageSize={50}
        onPageChange={setPage}
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        searchPlaceholder="Search by client name or email..."
        isLoading={isLoading}
      />
    </div>
  );
}
