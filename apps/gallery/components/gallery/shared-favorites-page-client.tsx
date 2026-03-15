"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  DownloadCloud,
  Heart,
  Lock,
  Minus,
  Pause,
  Play,
  Plus,
  X,
} from "lucide-react";
import { toast } from "sonner";
import type { SharedFavoritesData, SharedFavoritesPhoto } from "@/lib/gallery-types";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@workspace/ui/components/input-otp";

type Props = {
  data: SharedFavoritesData;
  favoriteShareToken: string;
};

const MIN_ZOOM = 1;
const MAX_ZOOM = 5;

export default function SharedFavoritesPageClient({
  data,
  favoriteShareToken,
}: Props) {
  const { viewerName, gallery, photos } = data;
  const settings = gallery.settings;
  const downloadsEnabled = settings?.downloadEnabled !== false;
  const hasDownloadPin = settings?.hasDownloadPin === true;
  const slideshowEnabled = settings?.slideshowEnabled !== false;

  const [activePhotoId, setActivePhotoId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const panStartRef = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);
  const panRef = useRef(pan);
  const modalViewportRef = useRef<HTMLDivElement>(null);

  // Download state
  const [downloadingPhotoId, setDownloadingPhotoId] = useState<string | null>(null);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [pinDialogOpen, setPinDialogOpen] = useState(false);
  const [pinValue, setPinValue] = useState("");
  const [pinVerifying, setPinVerifying] = useState(false);
  const [pinVerified, setPinVerified] = useState(false);
  const pendingDownloadRef = useRef<(() => void) | null>(null);
  const [sizePickerPhoto, setSizePickerPhoto] = useState<SharedFavoritesPhoto | null>(null);

  // Slideshow state
  const [slideshowActive, setSlideshowActive] = useState(false);
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const slideshowTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activePhoto = useMemo(
    () => photos.find((p) => p.id === activePhotoId) ?? null,
    [activePhotoId, photos],
  );

  const photoCountLabel = `${photos.length} ${photos.length === 1 ? "photo" : "photos"}`;

  useEffect(() => {
    panRef.current = pan;
  }, [pan]);

  useEffect(() => {
    if (!activePhotoId) {
      setZoom(MIN_ZOOM);
      setPan({ x: 0, y: 0 });
    }
  }, [activePhotoId]);

  // Keyboard navigation
  useEffect(() => {
    if (!activePhotoId) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActivePhotoId(null);
        setZoom(MIN_ZOOM);
        setPan({ x: 0, y: 0 });
      } else if (e.key === "ArrowRight") {
        navigateModal(1);
      } else if (e.key === "ArrowLeft") {
        navigateModal(-1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePhotoId, photos]);

  // Slideshow
  const stopSlideshow = () => {
    setSlideshowActive(false);
    if (slideshowTimerRef.current) {
      clearInterval(slideshowTimerRef.current);
      slideshowTimerRef.current = null;
    }
  };

  useEffect(() => {
    if (!slideshowActive) return;
    slideshowTimerRef.current = setInterval(() => {
      setSlideshowIndex((prev) => {
        if (prev >= photos.length - 1) {
          stopSlideshow();
          return prev;
        }
        return prev + 1;
      });
    }, 4000);
    return () => {
      if (slideshowTimerRef.current) {
        clearInterval(slideshowTimerRef.current);
        slideshowTimerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideshowActive, photos.length]);

  useEffect(() => {
    if (!slideshowActive) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") stopSlideshow();
      else if (e.key === "ArrowRight")
        setSlideshowIndex((p) => Math.min(photos.length - 1, p + 1));
      else if (e.key === "ArrowLeft")
        setSlideshowIndex((p) => Math.max(0, p - 1));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideshowActive, photos.length]);

  const slideshowPhoto = slideshowActive ? photos[slideshowIndex] : null;

  const withFavoriteShareToken = (src: string): string => {
    if (!src.startsWith("/api/photos/")) return src;
    const sep = src.includes("?") ? "&" : "?";
    return `${src}${sep}favoriteShareToken=${encodeURIComponent(favoriteShareToken)}`;
  };

  // Zoom/pan helpers
  const clampZoom = useCallback(
    (v: number) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, Number(v.toFixed(2)))),
    [],
  );

  const getPanLimits = useCallback(
    (zoomLevel: number) => {
      const vp = modalViewportRef.current;
      if (!vp || !activePhoto) return { maxX: 0, maxY: 0 };
      const cw = vp.clientWidth;
      const ch = vp.clientHeight;
      if (cw <= 0 || ch <= 0) return { maxX: 0, maxY: 0 };
      const iw = activePhoto.width ?? 1600;
      const ih = activePhoto.height ?? 1200;
      const s = Math.min(cw / iw, ch / ih);
      return {
        maxX: Math.max(0, (iw * s * zoomLevel - cw) / 2),
        maxY: Math.max(0, (ih * s * zoomLevel - ch) / 2),
      };
    },
    [activePhoto],
  );

  const setPanClamped = useCallback(
    (x: number, y: number, z = zoom) => {
      const { maxX, maxY } = getPanLimits(z);
      setPan({
        x: Math.max(-maxX, Math.min(maxX, Number(x.toFixed(2)))),
        y: Math.max(-maxY, Math.min(maxY, Number(y.toFixed(2)))),
      });
    },
    [getPanLimits, zoom],
  );

  const setZoomClamped = useCallback(
    (value: number) => {
      const next = clampZoom(value);
      if (next <= MIN_ZOOM) {
        setZoom(MIN_ZOOM);
        setPan({ x: 0, y: 0 });
        return;
      }
      const ratio = next / zoom;
      setZoom(next);
      setPanClamped(panRef.current.x * ratio, panRef.current.y * ratio, next);
    },
    [clampZoom, setPanClamped, zoom],
  );

  const navigateModal = (dir: 1 | -1) => {
    if (!activePhotoId) return;
    const idx = photos.findIndex((p) => p.id === activePhotoId);
    if (idx < 0) return;
    const next = idx + dir;
    if (next < 0 || next >= photos.length) return;
    setActivePhotoId(photos[next]?.id ?? null);
    setZoom(MIN_ZOOM);
    setPan({ x: 0, y: 0 });
  };

  const handleModalWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoomClamped(zoom - e.deltaY * 0.002);
  };

  const handleModalMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || zoom <= MIN_ZOOM) return;
    e.preventDefault();
    setIsDragging(true);
    panStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: panRef.current.x,
      originY: panRef.current.y,
    };
  };

  const handleModalMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !panStartRef.current || zoom <= MIN_ZOOM) return;
    e.preventDefault();
    setPanClamped(
      panStartRef.current.originX + e.clientX - panStartRef.current.startX,
      panStartRef.current.originY + e.clientY - panStartRef.current.startY,
    );
  };

  const stopDrag = () => {
    panStartRef.current = null;
    setIsDragging(false);
  };

  // Download helpers — same pattern as main gallery
  const availableDownloadSizes = useMemo(() => {
    const sizes: { key: string; label: string; variant: string }[] = [];
    const ds = settings?.downloadSizes;
    if (!ds || ds.original)
      sizes.push({ key: "original", label: "Original", variant: "original" });
    if (ds?.highRes)
      sizes.push({ key: "highRes", label: "High Resolution", variant: "original" });
    if (!ds || ds.web)
      sizes.push({ key: "web", label: "Web Size", variant: "preview" });
    return sizes;
  }, [settings]);

  const requirePin = (cb: () => void): boolean => {
    if (!hasDownloadPin || pinVerified) return false;
    pendingDownloadRef.current = cb;
    setPinValue("");
    setPinDialogOpen(true);
    return true;
  };

  const handleVerifyPin = async () => {
    setPinVerifying(true);
    try {
      const res = await fetch(
        `/api/gallery/${encodeURIComponent(gallery.shareToken)}/verify-pin`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pin: pinValue }),
        },
      );
      const result = await res.json();
      if (result.valid) {
        setPinVerified(true);
        setPinDialogOpen(false);
        pendingDownloadRef.current?.();
        pendingDownloadRef.current = null;
      } else {
        toast.error("Incorrect PIN");
        setPinValue("");
      }
    } catch {
      toast.error("Failed to verify PIN");
    } finally {
      setPinVerifying(false);
    }
  };

  const trackDownloadEvent = async (
    type: string,
    photoId?: string,
  ): Promise<boolean> => {
    try {
      const res = await fetch(
        `/api/gallery/${encodeURIComponent(gallery.shareToken)}/download-event`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type,
            photoId: photoId ?? null,
            viewerName,
          }),
        },
      );
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        if (d.limitReached) {
          toast.error("Download limit reached for this photo");
          return false;
        }
      }
      return true;
    } catch {
      return true;
    }
  };

  const downloadPhotoWithVariant = async (
    photo: SharedFavoritesPhoto,
    variant: string,
  ) => {
    setDownloadingPhotoId(photo.id);
    setSizePickerPhoto(null);
    try {
      const allowed = await trackDownloadEvent("single", photo.id);
      if (!allowed) return;

      const response = await fetch(
        `/api/photos/${photo.id}/download?shareToken=${encodeURIComponent(gallery.shareToken)}&fileName=${encodeURIComponent(photo.originalFilename)}&variant=${encodeURIComponent(variant)}&favoriteShareToken=${encodeURIComponent(favoriteShareToken)}`,
      );

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = photo.originalFilename;
      link.click();
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Download failed";
      toast.error(message);
    } finally {
      setDownloadingPhotoId(null);
    }
  };

  const handleSingleDownload = async (photo: SharedFavoritesPhoto) => {
    const doDownload = async () => {
      if (availableDownloadSizes.length > 1) {
        setSizePickerPhoto(photo);
        return;
      }
      const variant = availableDownloadSizes[0]?.variant ?? "original";
      await downloadPhotoWithVariant(photo, variant);
    };
    if (requirePin(doDownload)) return;
    await doDownload();
  };

  const handleDownloadAll = async () => {
    const doDownload = async () => {
      setIsDownloadingAll(true);
      try {
        const response = await fetch(
          `/api/gallery/${encodeURIComponent(gallery.shareToken)}/download-all`,
        );

        if (!response.ok) {
          throw new Error("Failed to prepare download");
        }

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = objectUrl;
        link.download = `${viewerName}_favorites.zip`;
        link.click();
        URL.revokeObjectURL(objectUrl);
      } catch {
        toast.error("Download failed");
      } finally {
        setIsDownloadingAll(false);
      }
    };
    if (requirePin(doDownload)) return;
    await doDownload();
  };

  if (photos.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-2">
          <Heart className="mx-auto h-10 w-10 text-muted-foreground" />
          <h1 className="text-xl font-semibold">No favorites to display</h1>
          <p className="text-sm text-muted-foreground">
            This favorites list is empty.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen select-none bg-background relative">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 px-4 py-4 backdrop-blur-md md:px-8">
        <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {viewerName}&apos;s Favorites
            </h1>
            <p className="text-sm text-muted-foreground">
              {gallery.title} • {gallery.photographer.name} • {photoCountLabel}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {slideshowEnabled && photos.length > 1 && (
              <button
                type="button"
                onClick={() => {
                  setSlideshowIndex(0);
                  setSlideshowActive(true);
                }}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border/80 bg-muted px-4 text-sm font-medium text-foreground transition hover:bg-accent"
              >
                <Play className="h-4 w-4" />
                Slideshow
              </button>
            )}
            {downloadsEnabled && (
              <button
                type="button"
                onClick={() => void handleDownloadAll()}
                disabled={isDownloadingAll}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background shadow-sm transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <DownloadCloud className="h-4 w-4" />
                {isDownloadingAll ? "Preparing ZIP..." : "Download All"}
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-[1500px] gap-6 px-4 py-6 md:px-8 md:py-10">
        <section className="min-w-0">
          <div className="columns-2 gap-3 space-y-3 md:columns-3 md:gap-4 md:space-y-4 xl:columns-3">
            {photos.map((photo, index) => (
              <article
                key={photo.id}
                className="group relative mb-3 break-inside-avoid overflow-hidden rounded-2xl bg-foreground md:mb-4"
                style={{ contentVisibility: "auto" }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setActivePhotoId(photo.id);
                    setZoom(MIN_ZOOM);
                    setPan({ x: 0, y: 0 });
                  }}
                  className="block w-full"
                >
                  <Image
                    src={withFavoriteShareToken(photo.thumbnailSrc)}
                    alt={photo.aiCaption ?? photo.originalFilename}
                    width={photo.width ?? 1200}
                    height={photo.height ?? 900}
                    sizes="(max-width: 768px) 50vw, (max-width: 1300px) 33vw, 25vw"
                    placeholder="blur"
                    blurDataURL={photo.blurDataUrl}
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                    className="h-auto w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                    priority={index < 8}
                  />
                </button>

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                {/* Note badge */}
                {photo.note && (
                  <div className="absolute left-3 bottom-3 max-w-[calc(100%-4rem)] pointer-events-none">
                    <span className="inline-block truncate rounded-full bg-black/60 px-2.5 py-1 text-[11px] text-white/90 backdrop-blur">
                      &ldquo;{photo.note}&rdquo;
                    </span>
                  </div>
                )}

                {/* Loved indicator */}
                <div className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur pointer-events-none">
                  <Heart className="h-4 w-4 fill-primary text-primary" />
                </div>

                {downloadsEnabled && (
                  <button
                    type="button"
                    onClick={() => void handleSingleDownload(photo)}
                    disabled={downloadingPhotoId === photo.id}
                    className="absolute right-3 bottom-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-card/90 text-foreground opacity-0 shadow-sm transition group-hover:opacity-100"
                    aria-label="Download photo"
                  >
                    <Download
                      className={`h-4 w-4 ${downloadingPhotoId === photo.id ? "animate-pulse" : ""}`}
                    />
                  </button>
                )}
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* Photo modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 bg-black/88 backdrop-blur-sm">
          <div className="absolute right-4 top-4 z-10 flex items-center gap-2 md:right-8 md:top-8">
            <button
              type="button"
              onClick={() => setZoomClamped(zoom - 0.2)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white"
              aria-label="Zoom out"
            >
              <Minus className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setZoomClamped(zoom + 0.2)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white"
              aria-label="Zoom in"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setZoomClamped(1)}
              className="rounded-full border border-white/25 bg-black/45 px-3 py-2 text-xs text-white"
            >
              {Math.round(zoom * 100)}%
            </button>
            {downloadsEnabled && (
              <button
                type="button"
                onClick={() => void handleSingleDownload(activePhoto)}
                disabled={downloadingPhotoId === activePhoto.id}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-white/25 bg-black/45 px-4 text-sm text-white"
              >
                <Download className="h-4 w-4" />
                {downloadingPhotoId === activePhoto.id
                  ? "Downloading..."
                  : "Download"}
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setActivePhotoId(null);
                setZoomClamped(1);
              }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex h-full items-center justify-center px-4 py-20 md:px-8">
            <button
              type="button"
              onClick={() => navigateModal(-1)}
              className="mr-3 hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white md:inline-flex"
              aria-label="Previous"
            >
              ←
            </button>

            <div
              ref={modalViewportRef}
              className={`relative flex h-full max-h-[85vh] w-full max-w-6xl items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/60 ${
                zoom > MIN_ZOOM
                  ? isDragging
                    ? "cursor-grabbing"
                    : "cursor-grab"
                  : "cursor-zoom-in"
              }`}
              onWheel={handleModalWheel}
              onMouseDown={handleModalMouseDown}
              onMouseMove={handleModalMouseMove}
              onMouseUp={stopDrag}
              onMouseLeave={stopDrag}
              style={{ touchAction: "none" }}
            >
              <Image
                src={withFavoriteShareToken(activePhoto.previewSrc)}
                alt={activePhoto.aiCaption ?? activePhoto.originalFilename}
                width={activePhoto.width ?? 1600}
                height={activePhoto.height ?? 1200}
                sizes="90vw"
                draggable={false}
                className="max-h-[85vh] w-auto object-contain transition-transform duration-150"
                style={{
                  transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
                  transformOrigin: "center center",
                  transition: isDragging ? "none" : undefined,
                }}
                onContextMenu={(e) => e.preventDefault()}
                priority
                unoptimized
              />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.28)_100%)]" />
            </div>

            <button
              type="button"
              onClick={() => navigateModal(1)}
              className="ml-3 hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white md:inline-flex"
              aria-label="Next"
            >
              →
            </button>
          </div>

          {/* Note in modal */}
          {activePhoto.note && (
            <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/70 px-4 py-2 text-sm text-white/90 backdrop-blur">
                <Heart className="h-3.5 w-3.5 fill-primary text-primary" />
                &ldquo;{activePhoto.note}&rdquo;
              </span>
            </div>
          )}
        </div>
      )}

      {/* Slideshow */}
      {slideshowActive && slideshowPhoto && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black">
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              key={slideshowPhoto.id}
              src={withFavoriteShareToken(slideshowPhoto.previewSrc)}
              alt={slideshowPhoto.aiCaption ?? slideshowPhoto.originalFilename}
              width={slideshowPhoto.width ?? 1600}
              height={slideshowPhoto.height ?? 1200}
              sizes="100vw"
              draggable={false}
              className="max-h-screen max-w-full object-contain animate-in fade-in duration-700"
              onContextMenu={(e) => e.preventDefault()}
              priority
              unoptimized
            />
          </div>
          <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3">
            <button
              type="button"
              onClick={() => setSlideshowIndex((p) => Math.max(0, p - 1))}
              disabled={slideshowIndex === 0}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/60 text-white transition hover:bg-black/80 disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={stopSlideshow}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/60 text-white transition hover:bg-black/80"
            >
              <Pause className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() =>
                setSlideshowIndex((p) => Math.min(photos.length - 1, p + 1))
              }
              disabled={slideshowIndex >= photos.length - 1}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/60 text-white transition hover:bg-black/80 disabled:opacity-30"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <button
            type="button"
            onClick={stopSlideshow}
            className="absolute right-6 top-6 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/60 text-white transition hover:bg-black/80"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
            <div
              className="h-full bg-white/60 transition-all duration-300"
              style={{
                width: `${((slideshowIndex + 1) / photos.length) * 100}%`,
              }}
            />
          </div>
          <div className="absolute left-6 top-6 z-10 rounded-full bg-black/60 px-3 py-1.5 text-sm text-white/80">
            {slideshowIndex + 1} / {photos.length}
          </div>
        </div>
      )}

      {/* Download Size Picker */}
      <Dialog
        open={sizePickerPhoto !== null}
        onOpenChange={(open) => {
          if (!open) setSizePickerPhoto(null);
        }}
      >
        <DialogContent className="sm:max-w-[360px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Choose Download Size
            </DialogTitle>
            <DialogDescription>
              Select the image quality you&apos;d like to download.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            {availableDownloadSizes.map((size) => (
              <button
                key={size.key}
                type="button"
                onClick={() => {
                  if (sizePickerPhoto) {
                    void downloadPhotoWithVariant(sizePickerPhoto, size.variant);
                  }
                }}
                disabled={downloadingPhotoId !== null}
                className="flex w-full items-center justify-between rounded-lg border border-border px-4 py-3 text-left transition hover:bg-accent disabled:opacity-50"
              >
                <div>
                  <p className="text-sm font-medium">{size.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {size.key === "original" && "Full resolution as uploaded"}
                    {size.key === "highRes" && "High resolution"}
                    {size.key === "web" && "Optimized for web & social"}
                  </p>
                </div>
                <Download className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Download PIN Dialog */}
      <Dialog open={pinDialogOpen} onOpenChange={setPinDialogOpen}>
        <DialogContent className="sm:max-w-[360px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Download PIN
            </DialogTitle>
            <DialogDescription>
              Enter the 4-digit PIN to download photos.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <InputOTP
              maxLength={4}
              value={pinValue}
              onChange={setPinValue}
              onComplete={() => void handleVerifyPin()}
              autoFocus
              type="numeric"
              inputMode="numeric"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setPinDialogOpen(false);
                pendingDownloadRef.current = null;
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => void handleVerifyPin()}
              disabled={pinValue.length !== 4 || pinVerifying}
            >
              {pinVerifying ? "Verifying..." : "Verify"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <footer className="border-t border-border/70 px-4 py-6 text-center text-sm text-muted-foreground md:px-8">
        Powered by <span className="font-semibold text-primary">FOTNO</span>
      </footer>
    </div>
  );
}
