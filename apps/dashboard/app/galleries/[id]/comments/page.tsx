"use client";

import { use } from "react";
import { useFeaturesLoaded } from "@/lib/hooks/use-features";
import { LockedPage } from "@/components/dashboard/feature-gate";
import { GalleryCommentsPanel } from "@/components/dashboard/gallery-comments-panel";
import { Skeleton } from "@workspace/ui/components/skeleton";

export default function GalleryCommentsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: galleryId } = use(params);
  const { features, isLoaded } = useFeaturesLoaded();

  if (!isLoaded) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!features.includes("COMMENTS")) {
    return (
      <LockedPage
        featureKey="COMMENTS"
        title="Gallery Comments"
        description="Let clients leave feedback and comments on your galleries. Reply, manage, and stay connected with your clients."
      />
    );
  }

  return <GalleryCommentsPanel galleryId={galleryId} />;
}
