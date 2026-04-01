"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { ArrowLeft } from "lucide-react";
import { AlbumDesigner } from "../../../../components/album/album-designer";
import { SubmitDialog } from "../../../../components/album/submit-dialog";
import { useAlbumAutoSave } from "../../../../lib/useAlbumAutoSave";
import type { SmartAlbumDesign } from "../../../../lib/album-types";

export default function AlbumDesignerPage() {
  const params = useParams<{ shareToken: string; designId: string }>();
  const router = useRouter();

  const [design, setDesign] = useState<SmartAlbumDesign | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [layouts, setLayouts] = useState<any>(null);
  const [photos, setPhotos] = useState<
    Array<{
      id: string;
      thumbnailSrc: string;
      previewSrc?: string;
      fileName?: string;
    }>
  >([]);
  const [photographerNotes, setPhotographerNotes] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  const { shareToken, designId } = params;

  // Auto-save hook
  useAlbumAutoSave(shareToken, designId, !!design);

  const albumListUrl = `/${encodeURIComponent(shareToken)}/album`;

  // Fetch data via proxy routes
  useEffect(() => {
    if (!shareToken || !designId) return;

    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [designRes, productsRes, layoutsRes, galleryRes] =
          await Promise.all([
            fetch(
              `/api/gallery/${encodeURIComponent(shareToken)}/smart-album/designs/${encodeURIComponent(designId)}`,
              { signal: controller.signal },
            ),
            fetch(
              `/api/gallery/${encodeURIComponent(shareToken)}/smart-album/products`,
              { signal: controller.signal },
            ),
            fetch(
              `/api/gallery/${encodeURIComponent(shareToken)}/smart-album/layouts`,
              { signal: controller.signal },
            ),
            fetch(`/api/gallery/${encodeURIComponent(shareToken)}`, {
              signal: controller.signal,
            }),
          ]);

        if (!designRes.ok) {
          throw new Error("Failed to load design");
        }

        const designData = await designRes.json();
        const productsData = await productsRes.json();
        const layoutsData = await layoutsRes.json();
        const galleryData = galleryRes.ok ? await galleryRes.json() : null;

        setDesign(designData);
        setProducts(productsData || []);
        setLayouts(layoutsData);
        setPhotos(
          (galleryData?.gallery?.photos || []).map((p: any) => ({
            id: p.id,
            thumbnailSrc: p.thumbnailSrc,
            previewSrc: p.previewSrc || p.thumbnailSrc,
            fileName: p.fileName,
          })),
        );
        setPhotographerNotes(designData.photographerNotes ?? null);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Failed to load design");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => controller.abort();
  }, [shareToken, designId]);

  const handleSubmitConfirm = async () => {
    const submitRes = await fetch(
      `/api/gallery/${encodeURIComponent(shareToken)}/smart-album/designs/${encodeURIComponent(designId)}/submit`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
    );

    if (!submitRes.ok) {
      const data = await submitRes.json().catch(() => null);
      throw new Error(data?.error || "Failed to submit design");
    }

    const data = await submitRes.json();
    if (data.payment?.clientSecret) {
      return { payment: data.payment };
    }
  };

  const handleConfirmPayment = async (paymentIntentId: string) => {
    const confirmRes = await fetch(
      `/api/gallery/${encodeURIComponent(shareToken)}/smart-album/designs/${encodeURIComponent(designId)}/confirm-payment`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentIntentId }),
      },
    );

    if (!confirmRes.ok) {
      const data = await confirmRes.json().catch(() => null);
      throw new Error(data?.error || "Failed to confirm payment");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <div className="border-b p-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-5 w-40" />
          </div>
          <div className="flex gap-2 mt-2">
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-8 w-24 rounded-md" />
            <Skeleton className="h-8 w-28 rounded-md" />
          </div>
        </div>
        <div className="flex flex-1 gap-4 p-4">
          <Skeleton className="w-48 h-full rounded" />
          <Skeleton className="flex-1 h-96 rounded" />
          <Skeleton className="w-48 h-full rounded" />
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

  const designData = design.designData as any;
  const pageCount =
    1 + 1 + (designData?.spreads?.length || 0) + 1;

  const product = products.find((p: any) => p.id === design.productId);

  return (
    <>
      <AlbumDesigner
        design={design}
        products={products}
        layouts={layouts}
        photos={photos}
        photographerNotes={photographerNotes}
        shareToken={shareToken}
        designId={designId}
        onBack={() => router.push(albumListUrl)}
        onPreview={() => {
          router.push(
            `/${encodeURIComponent(shareToken)}/album/${encodeURIComponent(designId)}/preview`,
          );
        }}
        onSubmit={() => setShowSubmitDialog(true)}
      />

      <SubmitDialog
        open={showSubmitDialog}
        onOpenChange={setShowSubmitDialog}
        albumTitle={design.title || "Untitled Album"}
        productName={product?.name || ""}
        pageCount={pageCount}
        onConfirm={handleSubmitConfirm}
        onConfirmPayment={handleConfirmPayment}
        onDone={() => router.push(albumListUrl)}
      />
    </>
  );
}
