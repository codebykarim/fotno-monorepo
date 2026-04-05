"use client";

import { use } from "react";
import { AlbumConfigForm } from "@/components/smart-albums/album-config-form";
import { ProductList } from "@/components/smart-albums/product-list";
import { SubmissionList } from "@/components/smart-albums/submission-list";
import { useHasFeature } from "@/lib/hooks/use-features";
import { LockedPage } from "@/components/dashboard/feature-gate";

export default function GallerySmartAlbumsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: galleryId } = use(params);
  const hasSmartAlbums = useHasFeature("SMART_ALBUMS");

  if (!hasSmartAlbums) {
    return (
      <LockedPage
        featureKey="SMART_ALBUMS"
        title="Smart Albums"
        description="Allow clients to design and order physical photo albums from your galleries."
      />
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Smart Albums</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Allow clients to design and order physical photo albums from this gallery
        </p>
      </div>

      <AlbumConfigForm />

      <ProductList />

      <div className="pt-4 border-t">
        <h3 className="text-lg font-semibold mb-4">Submissions</h3>
        <SubmissionList galleryId={galleryId} basePath={`/galleries/${galleryId}/smart-albums/submissions`} />
      </div>
    </div>
  );
}
