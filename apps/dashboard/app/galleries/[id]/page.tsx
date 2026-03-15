"use client";

import { Skeleton } from "@workspace/ui/components/skeleton";
import { useGalleryDetail } from "@/components/dashboard/gallery-detail-provider";
import { PhotosTab } from "@/components/dashboard/gallery-detail-content";

export default function GalleryPhotosPage() {
  const { galleryId, data, mutate, isLoading } = useGalleryDetail();

  if (isLoading || !data) {
    return (
      <div className="columns-2 gap-4 md:columns-3 xl:columns-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton
            key={i}
            className={`mb-4 w-full rounded-xl ${i % 2 === 0 ? "h-[280px]" : "h-[200px]"}`}
          />
        ))}
      </div>
    );
  }

  return (
    <PhotosTab
      galleryId={galleryId}
      mutate={mutate}
      photos={data.gallery.photos}
    />
  );
}
