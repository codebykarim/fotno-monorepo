"use client";

import { useState } from "react";
import Image from "next/image";
import {
  AlertCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Loader2,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import { Progress } from "@workspace/ui/components/progress";
import { apiRequest } from "@/lib/api/client";
import { FailedPhoto } from "@/lib/types/gallery";
import { useGalleryDetail } from "./gallery-detail-provider";

function FailedPhotoList({
  photos,
  galleryId,
  onDeleted,
}: {
  photos: FailedPhoto[];
  galleryId: string;
  onDeleted: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const deletePhoto = async (photoId: string) => {
    setDeletingIds((prev) => new Set(prev).add(photoId));
    try {
      await apiRequest(`/api/photos/${photoId}`, { method: "DELETE" });
      onDeleted();
    } catch {
      toast.error("Failed to delete photo");
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(photoId);
        return next;
      });
    }
  };

  if (photos.length === 0) return null;

  return (
    <div className="mt-3">
      <button
        type="button"
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? (
          <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        )}
        {expanded ? "Hide" : "Show"} failed photos
      </button>

      {expanded && (
        <div className="mt-2 space-y-2">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="flex items-center gap-3 rounded-md border border-border bg-background p-2"
            >
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-muted">
                <Image
                  src={photo.url}
                  alt={photo.originalFilename}
                  fill
                  className="object-cover"
                  sizes="40px"
                  unoptimized
                />
              </div>
              <p className="min-w-0 flex-1 truncate text-xs">
                {photo.originalFilename}
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 shrink-0 p-0 text-muted-foreground hover:text-destructive"
                title="Remove photo"
                onClick={() => deletePhoto(photo.id)}
                disabled={deletingIds.has(photo.id)}
              >
                {deletingIds.has(photo.id) ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          ))}
          <p className="text-xs text-muted-foreground">
            You can remove these and re-upload them, or retry processing.
          </p>
        </div>
      )}
    </div>
  );
}

export function GalleryProcessingBanner() {
  const { galleryId, processingStatus, mutateProcessingStatus, mutate } =
    useGalleryDetail();
  const [retrying, setRetrying] = useState(false);

  if (!processingStatus || processingStatus.total === 0) return null;

  const { total, processed, failed, inProgress, stuck, done, failedPhotos } =
    processingStatus;

  // Nothing to show — all photos processed, none failed
  if (done && failed === 0) return null;

  const percent = total > 0 ? Math.round((processed / total) * 100) : 0;
  const problemCount = failed + stuck;

  const retryPhotos = async () => {
    setRetrying(true);
    try {
      await apiRequest(`/api/galleries/${galleryId}/photos/retry-failed`, {
        method: "POST",
      });
      toast.success(
        `Retrying ${problemCount} photo${problemCount !== 1 ? "s" : ""}`,
      );
      mutateProcessingStatus();
      mutate();
    } catch {
      toast.error("Failed to retry photos");
    } finally {
      setRetrying(false);
    }
  };

  const onPhotoDeleted = () => {
    mutateProcessingStatus();
    mutate();
  };

  // ── Stuck / has problems while "processing" ──
  if (!done && stuck > 0) {
    return (
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium">
                {stuck} photo{stuck !== 1 ? "s" : ""} appear stuck
                {/* {failed > 0 && (
                  <span className="text-destructive">, {failed} failed</span>
                )} */}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="h-7 gap-1.5 text-xs"
                onClick={retryPhotos}
                disabled={retrying}
              >
                {retrying ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <RefreshCw className="h-3 w-3" />
                )}
                Retry
              </Button>
            </div>
            <Progress value={percent} className="h-1.5" />
            <p className="text-xs text-muted-foreground">
              {processed} of {total} photos processed successfully
            </p>
            {failedPhotos.length > 0 && (
              <FailedPhotoList
                photos={failedPhotos}
                galleryId={galleryId}
                onDeleted={onPhotoDeleted}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Normal processing in progress ──
  if (!done) {
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-start gap-3">
          <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin text-primary" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-sm font-medium">Processing photos...</p>
              <span className="shrink-0 text-xs text-muted-foreground">
                {processed}/{total}
              </span>
            </div>
            <Progress value={percent} className="h-1.5" />
            <p className="text-xs text-muted-foreground">
              {inProgress} photo{inProgress !== 1 ? "s" : ""} remaining
              {/* {failed > 0 && (
                <span className="text-destructive">
                  {" "}&middot; {failed} failed
                </span>
              )} */}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Done but some failed ──
  if (failed > 0) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium">
                {failed} photo{failed !== 1 ? "s" : ""} failed to process
              </p>
              <Button
                variant="outline"
                size="sm"
                className="h-7 gap-1.5 text-xs"
                onClick={retryPhotos}
                disabled={retrying}
              >
                {retrying ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <RefreshCw className="h-3 w-3" />
                )}
                Retry
              </Button>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {processed} of {total} photos processed successfully
            </p>
            <FailedPhotoList
              photos={failedPhotos}
              galleryId={galleryId}
              onDeleted={onPhotoDeleted}
            />
          </div>
        </div>
      </div>
    );
  }

  return null;
}
