"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { ArrowLeft } from "lucide-react";

// Same identity keys as gallery favorites
const getViewerIdKey = (shareToken: string) =>
  `fotno_gallery_viewer_${shareToken}`;
const getViewerNameKey = (shareToken: string) =>
  `fotno_gallery_viewer_name_${shareToken}`;

interface Product {
  id: string;
  name: string;
  size: string;
  coverType: string;
  paperType: string;
  maxPages: number;
  priceCents: number;
  currency: string;
}

export default function NewAlbumPage() {
  const { shareToken } = useParams<{ shareToken: string }>();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const albumListUrl = `/${encodeURIComponent(shareToken)}/album`;

  // Redirect to album list if not identified (identity gate is there)
  useEffect(() => {
    const id = sessionStorage.getItem(getViewerIdKey(shareToken));
    if (!id) {
      router.replace(albumListUrl);
    }
  }, [shareToken, router, albumListUrl]);

  useEffect(() => {
    if (!shareToken) return;
    fetch(
      `/api/gallery/${encodeURIComponent(shareToken)}/smart-album/products`,
    )
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [shareToken]);

  const handleCreate = async (productId: string) => {
    const viewerId = sessionStorage.getItem(getViewerIdKey(shareToken));
    const viewerName =
      sessionStorage.getItem(getViewerNameKey(shareToken)) || "Guest";

    if (!viewerId) {
      router.replace(albumListUrl);
      return;
    }

    setCreating(productId);
    setError(null);
    try {
      const res = await fetch(
        `/api/gallery/${encodeURIComponent(shareToken)}/smart-album/designs`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId,
            clientName: viewerName,
            clientEmail: viewerId,
          }),
        },
      );
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to create album");
      }
      const design = await res.json();
      router.replace(
        `/${encodeURIComponent(shareToken)}/album/${design.id}`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create album");
      setCreating(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-4 px-4 py-3 md:px-8">
          <div className="min-w-0">
            <button
              onClick={() => router.push(albumListUrl)}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition mb-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Albums
            </button>
            <h1 className="text-lg font-semibold tracking-tight md:text-xl">
              Choose a Product
            </h1>
            <p className="text-xs text-muted-foreground">
              Select an album style to start designing
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1500px] px-4 py-6 md:px-8 md:py-10">
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-6">
                <div className="space-y-3">
                  <Skeleton className="h-6 w-36" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full mt-2" />
                </div>
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-muted-foreground">
              No album products are available yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Card
                key={product.id}
                className="group transition-shadow hover:shadow-lg"
              >
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {product.size}
                    </p>
                  </div>

                  <div className="space-y-1.5 text-sm text-muted-foreground">
                    <p>Cover: {product.coverType}</p>
                    <p>Paper: {product.paperType}</p>
                    <p>Up to {product.maxPages} spreads</p>
                  </div>

                  <div className="pt-3 border-t flex items-center justify-between">
                    <span className="text-lg font-semibold">
                      ${(product.priceCents / 100).toFixed(2)}{" "}
                      <span className="text-sm font-normal text-muted-foreground">
                        {product.currency}
                      </span>
                    </span>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => handleCreate(product.id)}
                    disabled={creating !== null}
                  >
                    {creating === product.id
                      ? "Creating..."
                      : "Start Designing"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
