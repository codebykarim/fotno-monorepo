"use client";

import { Skeleton } from "@workspace/ui/components/skeleton";
import { useGalleryDetail } from "@/components/dashboard/gallery-detail-provider";
import { ShareTab } from "@/components/dashboard/gallery-detail-content";

export default function GallerySharePage() {
  const { galleryId, data, isLoading } = useGalleryDetail();

  if (isLoading || !data) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  return <ShareTab data={data} galleryId={galleryId} />;
}
