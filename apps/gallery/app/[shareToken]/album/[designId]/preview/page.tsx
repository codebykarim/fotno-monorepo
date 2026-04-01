"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { ArrowLeft } from "lucide-react";
import { AlbumPreview } from "../../../../../components/album/album-preview";
import type { SmartAlbumDesign } from "../../../../../lib/album-types";

export default function AlbumPreviewPage() {
  const params = useParams<{ shareToken: string; designId: string }>();
  const router = useRouter();

  const [design, setDesign] = useState<SmartAlbumDesign | null>(null);
  const [photos, setPhotos] = useState<
    Array<{
      id: string;
      thumbnailSrc: string;
      previewSrc?: string;
      fileName?: string;
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { shareToken, designId } = params;
  const editorUrl = `/${encodeURIComponent(shareToken)}/album/${encodeURIComponent(designId)}`;
  const albumListUrl = `/${encodeURIComponent(shareToken)}/album`;

  useEffect(() => {
    if (!shareToken || !designId) return;

    const controller = new AbortController();

    const fetchDesign = async () => {
      try {
        setIsLoading(true);
        const [designRes, galleryRes] = await Promise.all([
          fetch(
            `/api/gallery/${encodeURIComponent(shareToken)}/smart-album/designs/${encodeURIComponent(designId)}`,
            { signal: controller.signal },
          ),
          fetch(`/api/gallery/${encodeURIComponent(shareToken)}`, {
            signal: controller.signal,
          }),
        ]);

        if (!designRes.ok) {
          throw new Error("Failed to load design");
        }

        const data = await designRes.json();
        const galleryData = galleryRes.ok ? await galleryRes.json() : null;

        setDesign(data);
        setPhotos(
          (galleryData?.gallery?.photos || []).map((p: any) => ({
            id: p.id,
            thumbnailSrc: p.thumbnailSrc,
            previewSrc: p.previewSrc || p.thumbnailSrc,
            fileName: p.fileName,
          })),
        );
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Failed to load design");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchDesign();

    return () => controller.abort();
  }, [shareToken, designId]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <div className="border-b p-4 flex items-center gap-4">
          <Skeleton className="h-8 w-32 rounded-md" />
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="flex-1 p-8">
          <Skeleton className="h-96 w-full max-w-3xl mx-auto rounded-lg" />
        </div>
      </div>
    );
  }

  if (error || !design) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <p className="text-destructive mb-4 text-sm">
          {error || "Failed to load design"}
        </p>
        <Button variant="outline" onClick={() => router.push(albumListUrl)}>
          <ArrowLeft className="h-4 w-4" />
          Back to Albums
        </Button>
      </div>
    );
  }

  const isEditable =
    design.status === "DRAFT" || design.status === "CHANGES_REQUESTED";

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur-md p-3 flex items-center gap-3">
        <button
          onClick={() =>
            router.push(isEditable ? editorUrl : albumListUrl)
          }
          className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent transition"
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-sm font-semibold">{design.title}</h1>
          <p className="text-xs text-muted-foreground">Full Preview</p>
        </div>
        {isEditable && (
          <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            onClick={() => router.push(editorUrl)}
          >
            Back to Editor
          </Button>
        )}
      </header>

      <div className="flex-1 overflow-y-auto">
        <AlbumPreview designData={design.designData} photos={photos} />
      </div>
    </div>
  );
}
