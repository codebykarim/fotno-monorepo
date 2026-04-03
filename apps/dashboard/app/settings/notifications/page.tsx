"use client";

import useSWR from "swr";
import { jsonFetcher } from "@/lib/api/client";
import { NotificationSettings } from "@/components/dashboard/settings/notification-settings";
import { Loader2 } from "lucide-react";

export default function NotificationsPage() {
  const { data, isLoading, mutate } = useSWR<{ data: any }>(
    "/api/settings/notifications",
    jsonFetcher,
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const notifications = data?.data ?? {
    galleryExpiryBrowser: false,
    galleryExpiryEmail: false,
    storageWarningBrowser: false,
    storageWarningEmail: false,
    billingFailedBrowser: false,
    billingFailedEmail: false,
  };

  return <NotificationSettings data={notifications} mutate={() => mutate()} />;
}
