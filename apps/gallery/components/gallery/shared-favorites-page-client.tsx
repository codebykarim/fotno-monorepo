"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  DownloadCloud,
  ImageIcon,
  Minus,
  Pause,
  Play,
  Plus,
  X,
} from "lucide-react";
import { toast } from "sonner";
import type {
  SharedFavoritesData,
  SharedFavoritesPhoto,
} from "@/lib/gallery-types";
import { Logo } from "@workspace/ui/components/logo";

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
  const slideshowEnabled = settings?.slideshowEnabled !== false;
  const downloadsEnabled = settings?.downloadEnabled !== false;
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(
        `/api/shared-favorites/${encodeURIComponent(favoriteShareToken)}/download`,
      );
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Unable to download ZIP");
      }
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      const gallerySlug =
        gallery.title.replace(/\s+/g, "-").toLowerCase() || "gallery";
      const viewerSlug =
        viewerName.replace(/\s+/g, "-").toLowerCase() || "favorites";
      anchor.download = `${gallerySlug}-${viewerSlug}-favorites.zip`;
      anchor.click();
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to download ZIP";
      toast.error(message);
    } finally {
      setIsDownloading(false);
    }
  };

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

  const navigateModal = useCallback(
    (dir: 1 | -1) => {
      if (!activePhotoId) return;
      const idx = photos.findIndex((p) => p.id === activePhotoId);
      if (idx < 0) return;
      const next = idx + dir;
      if (next < 0 || next >= photos.length) return;
      setActivePhotoId(photos[next]?.id ?? null);
      setZoom(MIN_ZOOM);
      setPan({ x: 0, y: 0 });
    },
    [activePhotoId, photos],
  );

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
  }, [activePhotoId, navigateModal]);

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

  // Preload adjacent images so navigation feels instant
  useEffect(() => {
    if (!activePhotoId) return;

    const currentIndex = photos.findIndex((p) => p.id === activePhotoId);
    if (currentIndex < 0) return;

    const adjacentPhotos = [
      photos[currentIndex - 1],
      photos[currentIndex + 1],
    ].filter((p): p is SharedFavoritesPhoto => !!p);

    const preloadImages: HTMLImageElement[] = [];
    for (const photo of adjacentPhotos) {
      const img = new window.Image();
      img.src = withFavoriteShareToken(photo.previewSrc);
      preloadImages.push(img);
    }

    return () => {
      for (const img of preloadImages) {
        img.src = "";
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePhotoId, photos]);

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

  const swipeStartRef = useRef<{ x: number; y: number; time: number } | null>(
    null,
  );

  const handleModalTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length === 2) {
      swipeStartRef.current = null;
      panStartRef.current = null;
      setIsDragging(false);
      return;
    }

    swipeStartRef.current = null;
    if (event.touches.length === 1 && zoom <= MIN_ZOOM) {
      const touch = event.touches[0];
      if (touch) {
        swipeStartRef.current = {
          x: touch.clientX,
          y: touch.clientY,
          time: Date.now(),
        };
      }
    } else if (event.touches.length === 1 && zoom > MIN_ZOOM) {
      const touch = event.touches[0];
      if (touch) {
        setIsDragging(true);
        panStartRef.current = {
          startX: touch.clientX,
          startY: touch.clientY,
          originX: panRef.current.x,
          originY: panRef.current.y,
        };
      }
    }
  };

  const handleModalTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length === 1 && panStartRef.current && zoom > MIN_ZOOM) {
      const touch = event.touches[0];
      if (touch) {
        event.preventDefault();
        setPanClamped(
          panStartRef.current.originX +
            touch.clientX -
            panStartRef.current.startX,
          panStartRef.current.originY +
            touch.clientY -
            panStartRef.current.startY,
        );
      }
    }

    if (
      event.touches.length === 1 &&
      swipeStartRef.current &&
      zoom <= MIN_ZOOM
    ) {
      const touch = event.touches[0];
      if (touch) {
        const deltaY = Math.abs(touch.clientY - swipeStartRef.current.y);
        if (deltaY > 30) {
          swipeStartRef.current = null;
        }
      }
    }
  };

  const handleModalTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length === 0) {
      if (isDragging) {
        stopDrag();
      }

      if (swipeStartRef.current && zoom <= MIN_ZOOM) {
        const end = event.changedTouches[0];
        if (end) {
          const deltaX = end.clientX - swipeStartRef.current.x;
          const deltaY = end.clientY - swipeStartRef.current.y;
          const elapsed = Date.now() - swipeStartRef.current.time;
          if (
            Math.abs(deltaX) > 50 &&
            Math.abs(deltaX) > Math.abs(deltaY) * 1.5 &&
            elapsed < 400
          ) {
            navigateModal(deltaX < 0 ? 1 : -1);
          }
        }
      }

      swipeStartRef.current = null;
    }
  };

  if (photos.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-2">
          <ImageIcon className="mx-auto h-10 w-10 text-muted-foreground" />
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
            {downloadsEnabled && photos.length > 0 && (
              <button
                type="button"
                onClick={handleDownload}
                disabled={isDownloading}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-foreground px-4 text-sm font-medium text-background shadow-sm transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <DownloadCloud className="h-4 w-4" />
                {isDownloading ? "Preparing..." : "Download"}
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-[1500px] gap-6 px-4 py-6 md:px-8 md:py-10">
        <section className="min-w-0">
          <div className="columns-1 gap-3 space-y-3 min-[400px]:columns-2 md:columns-3 md:gap-4 md:space-y-4">
            {photos.map((photo, index) => {
              const imgSrc = withFavoriteShareToken(photo.thumbnailSrc);
              const w = photo.width ?? 4;
              const h = photo.height ?? 3;

              return (
                <article
                  key={photo.id}
                  className="group relative mb-3 break-inside-avoid overflow-hidden rounded-2xl bg-muted md:mb-4"
                  style={{
                    contentVisibility: "auto",
                    aspectRatio: `${w} / ${h}`,
                    backgroundImage: photo.blurDataUrl
                      ? `url(${photo.blurDataUrl})`
                      : undefined,
                    backgroundSize: "cover",
                  }}
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
                    <img
                      src={imgSrc}
                      alt={photo.originalFilename}
                      width={w}
                      height={h}
                      loading={index < 8 ? "eager" : "lazy"}
                      decoding="async"
                      draggable={false}
                      onContextMenu={(e) => e.preventDefault()}
                      onError={(e) => {
                        const img = e.currentTarget;
                        const attempt = Number(img.dataset.retry ?? "0");
                        if (attempt < 2) {
                          img.dataset.retry = String(attempt + 1);
                          setTimeout(
                            () => {
                              img.src = imgSrc;
                            },
                            1000 * (attempt + 1),
                          );
                        }
                      }}
                      className="h-auto w-full object-cover transition duration-500 group-hover:scale-[1.02]"
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
                </article>
              );
            })}
          </div>
        </section>
      </main>

      {/* Photo modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/88 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setActivePhotoId(null);
              setZoomClamped(1);
            }
          }}
        >
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

          <div
            className="flex h-full items-center justify-center px-4 py-20 md:px-8"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setActivePhotoId(null);
                setZoomClamped(1);
              }
            }}
          >
            <button
              type="button"
              onClick={() => navigateModal(-1)}
              disabled={
                !activePhotoId ||
                photos.findIndex((p) => p.id === activePhotoId) <= 0
              }
              className="mr-3 hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-white/20 active:scale-95 disabled:pointer-events-none disabled:opacity-0 md:inline-flex"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
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
              onTouchStart={handleModalTouchStart}
              onTouchMove={handleModalTouchMove}
              onTouchEnd={handleModalTouchEnd}
              onTouchCancel={handleModalTouchEnd}
              style={{ touchAction: "none" }}
            >
              <Image
                src={withFavoriteShareToken(activePhoto.previewSrc)}
                alt={activePhoto.originalFilename}
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
              disabled={
                !activePhotoId ||
                photos.findIndex((p) => p.id === activePhotoId) >=
                  photos.length - 1
              }
              className="ml-3 hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-white/20 active:scale-95 disabled:pointer-events-none disabled:opacity-0 md:inline-flex"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Note in modal */}
          {activePhoto.note && (
            <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/70 px-4 py-2 text-sm text-white/90 backdrop-blur">
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
              alt={slideshowPhoto.originalFilename}
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

      <footer className="border-t border-border/70 px-4 py-6 text-center text-sm text-muted-foreground md:px-8 flex items-center justify-center">
        Powered by <Logo size="xs" />
      </footer>
    </div>
  );
}
