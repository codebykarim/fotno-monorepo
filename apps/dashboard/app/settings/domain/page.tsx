"use client";

import useSWR from "swr";
import { jsonFetcher } from "@/lib/api/client";
import { DomainSettings } from "@/components/dashboard/settings/domain-settings";
import { Loader2 } from "lucide-react";

export default function DomainPage() {
  const { data, isLoading, mutate } = useSWR<{ data: any }>(
    "/api/settings/domain",
    jsonFetcher,
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const domain = data?.data ?? null;

  return <DomainSettings data={domain} mutate={() => mutate()} />;
}
