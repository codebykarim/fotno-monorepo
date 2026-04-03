"use client";

import useSWR from "swr";
import { jsonFetcher } from "@/lib/api/client";
import { ProfileSettings } from "@/components/dashboard/settings/profile-settings";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { data, isLoading, mutate } = useSWR<{ data: any }>(
    "/api/settings/profile",
    jsonFetcher,
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const profile = data?.data ?? {
    id: "",
    name: "",
    email: "",
    image: null,
    providers: [],
    canChangeEmail: true,
  };

  return <ProfileSettings data={profile} mutate={() => mutate()} />;
}
