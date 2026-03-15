"use client";

import { Skeleton } from "@workspace/ui/components/skeleton";
import { useGalleryDetail } from "@/components/dashboard/gallery-detail-provider";
import { GallerySettings } from "@/components/dashboard/gallery-settings/settings-layout";

export default function GallerySettingsPage() {
  const { galleryId, data, mutate, isLoading } = useGalleryDetail();

  if (isLoading || !data) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  return <GallerySettings galleryId={galleryId} data={data} mutate={mutate} />;
}
