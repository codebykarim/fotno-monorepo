"use client";

import { Skeleton } from "@workspace/ui/components/skeleton";
import { useGalleryDetail } from "@/components/dashboard/gallery-detail-provider";
import { AlbumsTab } from "@/components/dashboard/gallery-detail-content";
import { useFeaturesLoaded } from "@/lib/hooks/use-features";
import { LockedPage } from "@/components/dashboard/feature-gate";

export default function GalleryAlbumsPage() {
  const { galleryId, data, mutate, isLoading } = useGalleryDetail();
  const { features, isLoaded } = useFeaturesLoaded();

  if (isLoading || !data || !isLoaded) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!features.includes("ALBUMS")) {
    return (
      <LockedPage
        featureKey="ALBUMS"
        title="Albums"
        description="Organize gallery photos into curated albums."
      />
    );
  }

  return (
    <AlbumsTab
      galleryId={galleryId}
      albums={data.gallery.albums}
      mutate={mutate}
    />
  );
}
