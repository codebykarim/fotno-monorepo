"use client";

import useSWR from "swr";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { jsonFetcher } from "@/lib/api/client";
import type {
  StorageEventsResponse,
  StorageSummaryResponse,
} from "@/lib/types/api";

const bytesToGb = (value: string): string =>
  `${(Number(value) / 1024 ** 3).toFixed(2)} GB`;
const bytesToMb = (value: string): string =>
  `${(Number(value) / 1024 ** 2).toFixed(2)} MB`;
const toUsd = (cents: number): string =>
  `$${(Math.max(0, cents) / 100).toFixed(2)}`;

export function StorageSettingsContent() {
  const { data: summary } = useSWR<StorageSummaryResponse>(
    "/api/storage/summary",
    jsonFetcher,
    {
      revalidateOnFocus: true,
    },
  );

  const { data: events } = useSWR<StorageEventsResponse>(
    "/api/storage/events?limit=10&offset=0",
    jsonFetcher,
    { revalidateOnFocus: true },
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="dashboard-title text-3xl font-semibold tracking-tight">
          Settings
        </h1>
        <p className="mt-1 text-muted-foreground">
          Storage usage and billing visibility.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Storage Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-2 text-muted-foreground">Used</td>
                <td className="py-2 text-right font-medium">
                  {summary?.formatted.used ?? "-"}
                </td>
              </tr>
              <tr>
                <td className="py-2 text-muted-foreground">Limit</td>
                <td className="py-2 text-right font-medium">
                  {summary?.formatted.limit ?? "-"}
                </td>
              </tr>
              <tr>
                <td className="py-2 text-muted-foreground">Usage</td>
                <td className="py-2 text-right font-medium">
                  {summary?.percentage ?? 0}%
                </td>
              </tr>
              <tr>
                <td className="py-2 text-muted-foreground">Overage</td>
                <td className="py-2 text-right font-medium">
                  {summary ? bytesToGb(summary.overageBytes) : "0.00 GB"}
                </td>
              </tr>
            </tbody>
          </table>

          <p className="mt-4 rounded-lg border border-primary/30 bg-primary/8 p-3 text-sm text-foreground">
            Current billing cycle overage:{" "}
            {summary ? bytesToGb(summary.overageBytes) : "0.00 GB"} (
            {summary ? toUsd(summary.overageCostCents) : "$0.00"} est.)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Storage Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {(events?.events ?? []).map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
              >
                <div>
                  <p className="font-medium">{event.reason}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(event.createdAt).toLocaleString()}
                  </p>
                </div>
                <p
                  className={
                    Number(event.delta) < 0
                      ? "text-emerald-600"
                      : "text-foreground"
                  }
                >
                  {Number(event.delta) < 0 ? "-" : "+"}
                  {/* event.delta < 100mb */}
                  {Number(event.delta) < 1024 ** 2 * 100
                    ? bytesToMb(String(Math.abs(Number(event.delta))))
                    : bytesToGb(String(Math.abs(Number(event.delta))))}
                </p>
              </div>
            ))}

            {(events?.events?.length ?? 0) === 0 && (
              <p className="text-sm text-muted-foreground">
                No storage events yet.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
