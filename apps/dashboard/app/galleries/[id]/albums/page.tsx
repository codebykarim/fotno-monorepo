"use client";

import { Skeleton } from "@workspace/ui/components/skeleton";
import { useGalleryDetail } from "@/components/dashboard/gallery-detail-provider";
import { AlbumsTab } from "@/components/dashboard/gallery-detail-content";

export default function GalleryAlbumsPage() {
  const { galleryId, data, mutate, isLoading } = useGalleryDetail();

  if (isLoading || !data) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <AlbumsTab
      galleryId={galleryId}
      albums={data.gallery.albums}
      photos={data.gallery.photos}
      mutate={mutate}
    />
  );
}
