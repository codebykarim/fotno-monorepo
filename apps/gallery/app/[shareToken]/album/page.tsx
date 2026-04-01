"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Plus, MessageSquare, ArrowLeft, Album } from "lucide-react";
import { StatusBadge } from "../../../components/album/status-badge";
import { IdentityDialog } from "../../../components/album/identity-dialog";

// Same identity keys as gallery favorites
const getViewerIdKey = (shareToken: string) =>
  `fotno_gallery_viewer_${shareToken}`;
const getViewerNameKey = (shareToken: string) =>
  `fotno_gallery_viewer_name_${shareToken}`;

interface Design {
  id: string;
  title: string;
  status:
    | "DRAFT"
    | "SUBMITTED"
    | "APPROVED"
    | "CHANGES_REQUESTED"
    | "REJECTED";
  photographerNotes: string | null;
  product: {
    name: string;
    priceCents: number;
    currency: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function AlbumPage() {
  const { shareToken } = useParams<{ shareToken: string }>();
  const router = useRouter();

  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewerId, setViewerId] = useState("");
  const [viewerName, setViewerName] = useState("");
  const [showIdentityDialog, setShowIdentityDialog] = useState(false);

  useEffect(() => {
    const id = sessionStorage.getItem(getViewerIdKey(shareToken));
    const name = sessionStorage.getItem(getViewerNameKey(shareToken)) || "";
    if (id) {
      setViewerId(id);
      setViewerName(name);
    } else {
      setShowIdentityDialog(true);
      setLoading(false);
    }
  }, [shareToken]);

  const loadDesigns = useCallback(async () => {
    if (!viewerId) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/gallery/${encodeURIComponent(shareToken)}/smart-album/designs?clientEmail=${encodeURIComponent(viewerId)}`,
      );
      if (res.ok) {
        const data = await res.json();
        setDesigns(Array.isArray(data) ? data : []);
      }
    } catch {
      // show empty state
    } finally {
      setLoading(false);
    }
  }, [shareToken, viewerId]);

  useEffect(() => {
    if (viewerId) loadDesigns();
  }, [viewerId, loadDesigns]);

  const galleryUrl = `/${encodeURIComponent(shareToken)}`;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-4 px-4 py-3 md:px-8">
          <div className="min-w-0">
            <button
              onClick={() => router.push(galleryUrl)}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition mb-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Gallery
            </button>
            <h1 className="text-lg font-semibold tracking-tight md:text-xl">
              Your Albums
            </h1>
            {viewerName && (
              <p className="text-xs text-muted-foreground">{viewerName}</p>
            )}
          </div>

          <Button
            onClick={() =>
              router.push(`/${encodeURIComponent(shareToken)}/album/new`)
            }
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Album</span>
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1500px] px-4 py-6 md:px-8 md:py-10">
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-6">
                <div className="space-y-3">
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </Card>
            ))}
          </div>
        ) : designs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted mb-4">
              <Album className="h-7 w-7 text-muted-foreground/50" />
            </div>
            <p className="text-lg font-medium mb-1">No albums yet</p>
            <p className="text-sm text-muted-foreground mb-6">
              Create your first custom photo album
            </p>
            <Button
              onClick={() =>
                router.push(`/${encodeURIComponent(shareToken)}/album/new`)
              }
            >
              <Plus className="h-4 w-4" />
              Create Album
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {designs.map((design) => {
              const price = (design.product.priceCents / 100).toFixed(2);
              const isEditable =
                design.status === "DRAFT" ||
                design.status === "CHANGES_REQUESTED";

              return (
                <Card
                  key={design.id}
                  className="group cursor-pointer transition-shadow hover:shadow-lg"
                  onClick={() =>
                    router.push(
                      isEditable
                        ? `/${encodeURIComponent(shareToken)}/album/${design.id}`
                        : `/${encodeURIComponent(shareToken)}/album/${design.id}/preview`,
                    )
                  }
                >
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg truncate">
                        {design.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {design.product.name}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Status</span>
                        <StatusBadge status={design.status} />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Price</span>
                        <span className="font-semibold">
                          ${price} {design.product.currency}
                        </span>
                      </div>
                    </div>

                    {design.status === "CHANGES_REQUESTED" &&
                      design.photographerNotes && (
                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm dark:border-amber-800 dark:bg-amber-950/30">
                          <div className="flex items-start gap-2">
                            <MessageSquare className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                            <div>
                              <p className="font-medium text-amber-800 dark:text-amber-200 mb-0.5">
                                Feedback
                              </p>
                              <p className="text-amber-700 dark:text-amber-300">
                                {design.photographerNotes}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                    <p className="text-xs text-muted-foreground pt-3 border-t">
                      Updated{" "}
                      {new Date(design.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      {/* Identity Dialog — same phone UI as favorites */}
      <IdentityDialog
        open={showIdentityDialog}
        onOpenChange={(open) => {
          setShowIdentityDialog(open);
          if (!open && !viewerId) {
            // User cancelled — go back to gallery
            router.push(galleryUrl);
          }
        }}
        shareToken={shareToken}
        onIdentified={(id, name) => {
          setViewerId(id);
          setViewerName(name);
        }}
      />
    </div>
  );
}
