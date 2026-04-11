"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  Minus,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import type { PublicGallery, PublicPhoto } from "@/lib/gallery-types";
import { getSessionTokenKey, isJwtLikelyValid } from "@/lib/jwt";
import PasswordGate from "@/components/gallery/password-gate";

type PhotoLightboxClientProps = {
  initialGallery: PublicGallery;
  currentPhotoId: string;
};

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const DEFAULT_PHOTO_WIDTH = 1200;
const DEFAULT_PHOTO_HEIGHT = 800;

const readErrorText = async (response: Response): Promise<string> => {
  try {
    const payload = (await response.json()) as { error?: string };
    return payload.error ?? "Request failed";
  } catch {
    return "Request failed";
  }
};

const getStoredToken = (shareToken: string): string | null => {
  if (typeof window === "undefined") return null;
  const token = sessionStorage.getItem(getSessionTokenKey(shareToken));
  if (!token) {
    return null;
  }

  if (!isJwtLikelyValid(token)) {
    sessionStorage.removeItem(getSessionTokenKey(shareToken));
    return null;
  }

  return token;
};

export default function PhotoLightboxClient({
  initialGallery,
  currentPhotoId,
}: PhotoLightboxClientProps) {
  const router = useRouter();
  const [gallery, setGallery] = useState(initialGallery);
  const [galleryJwt, setGalleryJwt] = useState<string | null>(null);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isDownloadingCurrent, setIsDownloadingCurrent] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const imageViewportRef = useRef<HTMLDivElement | null>(null);
  const panStartRef = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);
  const panRef = useRef({ x: 0, y: 0 });
  const pinchStateRef = useRef<{ startDistance: number; startZoom: number } | null>(
    null,
  );

  const currentIndex = useMemo(
    () => gallery.photos.findIndex((photo) => photo.id === currentPhotoId),
    [currentPhotoId, gallery.photos]
  );

  const currentPhoto = currentIndex >= 0 ? gallery.photos[currentIndex] : null;
  const previousPhoto = currentIndex > 0 ? gallery.photos[currentIndex - 1] : null;
  const nextPhoto =
    currentIndex >= 0 && currentIndex < gallery.photos.length - 1
      ? gallery.photos[currentIndex + 1]
      : null;

  useEffect(() => {
    if (!gallery.hasPassword) {
      return;
    }

    const token = getStoredToken(gallery.shareToken);
    if (!token) {
      return;
    }

    setGalleryJwt(token);
    void refreshGallery(token).catch(() => {
      sessionStorage.removeItem(getSessionTokenKey(gallery.shareToken));
      setGalleryJwt(null);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gallery.shareToken, gallery.hasPassword]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" && previousPhoto) {
        router.push(`/${gallery.shareToken}/photo/${previousPhoto.id}`);
      }

      if (event.key === "ArrowRight" && nextPhoto) {
        router.push(`/${gallery.shareToken}/photo/${nextPhoto.id}`);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gallery.shareToken, nextPhoto, previousPhoto, router]);

  useEffect(() => {
    panRef.current = pan;
  }, [pan]);

  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [currentPhotoId]);

  useEffect(() => {
    const preventContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    const preventDragStart = (event: DragEvent) => {
      event.preventDefault();
    };

    window.addEventListener("contextmenu", preventContextMenu);
    window.addEventListener("dragstart", preventDragStart);

    return () => {
      window.removeEventListener("contextmenu", preventContextMenu);
      window.removeEventListener("dragstart", preventDragStart);
    };
  }, []);

  const refreshGallery = async (token?: string) => {
    const response = await fetch(`/api/gallery/${gallery.shareToken}`, {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(await readErrorText(response));
    }

    const payload = (await response.json()) as { gallery: PublicGallery };
    setGallery(payload.gallery);
  };

  const unlockGallery = async (password: string) => {
    setIsUnlocking(true);

    try {
      const response = await fetch(`/api/gallery/${gallery.shareToken}/unlock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error(await readErrorText(response));
      }

      const payload = (await response.json()) as { token?: string };
      if (!payload.token) {
        throw new Error("Unlock token was not returned");
      }

      sessionStorage.setItem(getSessionTokenKey(gallery.shareToken), payload.token);
      setGalleryJwt(payload.token);
      await refreshGallery(payload.token);
      toast.success("Gallery unlocked");
    } catch (error) {
      sessionStorage.removeItem(getSessionTokenKey(gallery.shareToken));
      setGalleryJwt(null);
      const message = error instanceof Error ? error.message : "Unable to unlock";
      toast.error(message);
    } finally {
      setIsUnlocking(false);
    }
  };

  const downloadCurrent = async (photo: PublicPhoto) => {
    setIsDownloadingCurrent(true);
    try {
      const response = await fetch(
        `/api/photos/${photo.id}/download?shareToken=${encodeURIComponent(gallery.shareToken)}&fileName=${encodeURIComponent(photo.originalFilename)}`,
        {
          headers: galleryJwt
            ? {
                Authorization: `Bearer ${galleryJwt}`,
              }
            : undefined,
        }
      );

      if (!response.ok) {
        throw new Error(await readErrorText(response));
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = photo.originalFilename;
      link.click();
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Download failed";
      toast.error(message);
    } finally {
      setIsDownloadingCurrent(false);
    }
  };

  const withOptionalToken = (src: string): string => {
    if (!galleryJwt) {
      return src;
    }
    // Never mutate presigned URLs; adding query params breaks the signature.
    if (src.includes("X-Amz-Signature=") || src.includes("x-amz-signature=")) {
      return src;
    }
    if (!src.startsWith("/api/photos/")) {
      return src;
    }
    return `${src}&token=${encodeURIComponent(galleryJwt)}`;
  };

  // Preload adjacent images so navigation feels instant
  useEffect(() => {
    const adjacentPhotos = [previousPhoto, nextPhoto].filter(
      (p): p is PublicPhoto => !!p,
    );

    const preloadImages: HTMLImageElement[] = [];
    for (const photo of adjacentPhotos) {
      const img = new window.Image();
      img.src = withOptionalToken(photo.previewSrc);
      preloadImages.push(img);
    }

    return () => {
      for (const img of preloadImages) {
        img.src = "";
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPhotoId]);

  const passwordGateCoverImage =
    gallery.photos.find((photo) => photo.id === gallery.coverPhotoId)
      ?.previewSrc ??
    gallery.photos[0]?.previewSrc ??
    null;

  if (gallery.hasPassword && !galleryJwt) {
    return (
      <PasswordGate
        title={gallery.title}
        coverImageSrc={passwordGateCoverImage}
        photographerName={gallery.photographer.name}
        onUnlock={unlockGallery}
        isSubmitting={isUnlocking}
      />
    );
  }

  if (!currentPhoto) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-foreground text-background/70">
        Photo not found
      </div>
    );
  }

  const previewSrc = withOptionalToken(currentPhoto.previewSrc);
  const clampZoom = useCallback((value: number) => {
    return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, Number(value.toFixed(2))));
  }, []);

  const getPanLimits = useCallback(
    (zoomLevel: number) => {
      const viewport = imageViewportRef.current;
      if (!viewport) {
        return { maxX: 0, maxY: 0 };
      }

      const containerWidth = viewport.clientWidth;
      const containerHeight = viewport.clientHeight;
      if (containerWidth <= 0 || containerHeight <= 0) {
        return { maxX: 0, maxY: 0 };
      }

      const imageWidth = currentPhoto.width ?? DEFAULT_PHOTO_WIDTH;
      const imageHeight = currentPhoto.height ?? DEFAULT_PHOTO_HEIGHT;
      const baseScale = Math.min(
        containerWidth / imageWidth,
        containerHeight / imageHeight,
      );
      const renderedWidth = imageWidth * baseScale * zoomLevel;
      const renderedHeight = imageHeight * baseScale * zoomLevel;

      return {
        maxX: Math.max(0, (renderedWidth - containerWidth) / 2),
        maxY: Math.max(0, (renderedHeight - containerHeight) / 2),
      };
    },
    [currentPhoto.height, currentPhoto.width],
  );

  const setPanClamped = useCallback(
    (nextX: number, nextY: number, zoomLevel = zoom) => {
      const { maxX, maxY } = getPanLimits(zoomLevel);
      const clampedX = Math.max(-maxX, Math.min(maxX, Number(nextX.toFixed(2))));
      const clampedY = Math.max(-maxY, Math.min(maxY, Number(nextY.toFixed(2))));
      setPan({ x: clampedX, y: clampedY });
    },
    [getPanLimits, zoom],
  );

  const setZoomClamped = useCallback(
    (value: number, focusPoint?: { x: number; y: number }) => {
      const nextZoom = clampZoom(value);

      if (nextZoom <= MIN_ZOOM) {
        setZoom(MIN_ZOOM);
        setPan({ x: 0, y: 0 });
        return;
      }

      const viewport = imageViewportRef.current;
      if (viewport && focusPoint) {
        const rect = viewport.getBoundingClientRect();
        const centerX = focusPoint.x - rect.left - rect.width / 2;
        const centerY = focusPoint.y - rect.top - rect.height / 2;
        const nextPanX =
          centerX - ((centerX - panRef.current.x) / zoom) * nextZoom;
        const nextPanY =
          centerY - ((centerY - panRef.current.y) / zoom) * nextZoom;
        setZoom(nextZoom);
        setPanClamped(nextPanX, nextPanY, nextZoom);
        return;
      }

      const scaleRatio = nextZoom / zoom;
      setZoom(nextZoom);
      setPanClamped(
        panRef.current.x * scaleRatio,
        panRef.current.y * scaleRatio,
        nextZoom,
      );
    },
    [clampZoom, setPanClamped, zoom],
  );

  useEffect(() => {
    if (zoom <= MIN_ZOOM) {
      setPan({ x: 0, y: 0 });
      return;
    }

    setPan((previous) => {
      const { maxX, maxY } = getPanLimits(zoom);
      const clampedX = Math.max(-maxX, Math.min(maxX, previous.x));
      const clampedY = Math.max(-maxY, Math.min(maxY, previous.y));
      if (clampedX === previous.x && clampedY === previous.y) {
        return previous;
      }
      return { x: clampedX, y: clampedY };
    });
  }, [getPanLimits, zoom]);

  const ZOOM_STEPS = [MIN_ZOOM, 2, MAX_ZOOM];
  const DRAG_THRESHOLD = 5;
  const wasDragRef = useRef(false);

  const handleImageClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    if (wasDragRef.current) return;
    const focus = { x: event.clientX, y: event.clientY };
    const nextStep = ZOOM_STEPS.find((s) => s > zoom);
    if (nextStep) {
      setZoomClamped(nextStep, focus);
    } else {
      setZoomClamped(MIN_ZOOM);
    }
  };

  const distanceBetweenTouches = (touches: React.TouchList): number => {
    if (touches.length < 2) {
      return 0;
    }
    const dx = touches[0]!.clientX - touches[1]!.clientX;
    const dy = touches[0]!.clientY - touches[1]!.clientY;
    return Math.hypot(dx, dy);
  };

  const swipeStartRef = useRef<{ x: number; y: number; time: number } | null>(
    null,
  );

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length === 2) {
      setIsDragging(false);
      panStartRef.current = null;
      swipeStartRef.current = null;
      pinchStateRef.current = {
        startDistance: distanceBetweenTouches(event.touches),
        startZoom: zoom,
      };
      return;
    }

    if (event.touches.length === 1 && zoom > MIN_ZOOM) {
      const touch = event.touches[0];
      if (!touch) {
        return;
      }
      setIsDragging(true);
      swipeStartRef.current = null;
      panStartRef.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        originX: panRef.current.x,
        originY: panRef.current.y,
      };
      return;
    }

    if (event.touches.length === 1 && zoom <= MIN_ZOOM) {
      const touch = event.touches[0];
      if (touch) {
        swipeStartRef.current = {
          x: touch.clientX,
          y: touch.clientY,
          time: Date.now(),
        };
      }
      return;
    }

    panStartRef.current = null;
    pinchStateRef.current = null;
    swipeStartRef.current = null;
    setIsDragging(false);
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length === 2 && pinchStateRef.current) {
      event.preventDefault();
      const nextDistance = distanceBetweenTouches(event.touches);
      const { startDistance, startZoom } = pinchStateRef.current;
      if (startDistance <= 0 || nextDistance <= 0) {
        return;
      }
      const touchA = event.touches[0];
      const touchB = event.touches[1];
      if (!touchA || !touchB) {
        return;
      }
      setZoomClamped(startZoom * (nextDistance / startDistance), {
        x: (touchA.clientX + touchB.clientX) / 2,
        y: (touchA.clientY + touchB.clientY) / 2,
      });
      return;
    }

    if (event.touches.length === 1 && panStartRef.current && zoom > MIN_ZOOM) {
      const touch = event.touches[0];
      if (!touch) {
        return;
      }
      event.preventDefault();
      const deltaX = touch.clientX - panStartRef.current.startX;
      const deltaY = touch.clientY - panStartRef.current.startY;
      const { x, y } = clampAndStorePan(
        panStartRef.current.originX + deltaX,
        panStartRef.current.originY + deltaY,
      );
      applyTransformDirect(x, y);
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

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length < 2) {
      pinchStateRef.current = null;
    }

    if (event.touches.length === 1 && zoom > MIN_ZOOM) {
      const touch = event.touches[0];
      if (!touch) {
        return;
      }
      panStartRef.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        originX: panRef.current.x,
        originY: panRef.current.y,
      };
      return;
    }

    if (event.touches.length === 0) {
      if (isDragging) {
        setPan({ ...panRef.current });
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
            const target =
              deltaX < 0 ? nextPhoto : previousPhoto;
            if (target) {
              router.push(
                `/${gallery.shareToken}/photo/${target.id}`,
              );
            }
          }
        }
      }

      panStartRef.current = null;
      swipeStartRef.current = null;
      setIsDragging(false);
    }
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;

    event.preventDefault();
    wasDragRef.current = false;
    panStartRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: panRef.current.x,
      originY: panRef.current.y,
    };
    if (zoom > MIN_ZOOM) {
      setIsDragging(true);
    }
  };

  const applyTransformDirect = useCallback(
    (x: number, y: number) => {
      const img = imageViewportRef.current?.querySelector("img");
      if (img) {
        img.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${zoom})`;
      }
    },
    [zoom],
  );

  const clampAndStorePan = useCallback(
    (rawX: number, rawY: number) => {
      const { maxX, maxY } = getPanLimits(zoom);
      const x = Math.max(-maxX, Math.min(maxX, rawX));
      const y = Math.max(-maxY, Math.min(maxY, rawY));
      panRef.current = { x, y };
      return { x, y };
    },
    [getPanLimits, zoom],
  );

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!panStartRef.current || zoom <= MIN_ZOOM) return;

    const deltaX = event.clientX - panStartRef.current.startX;
    const deltaY = event.clientY - panStartRef.current.startY;
    if (Math.abs(deltaX) > DRAG_THRESHOLD || Math.abs(deltaY) > DRAG_THRESHOLD) {
      wasDragRef.current = true;
    }
    if (!isDragging) return;

    event.preventDefault();
    const { x, y } = clampAndStorePan(
      panStartRef.current.originX + deltaX,
      panStartRef.current.originY + deltaY,
    );
    applyTransformDirect(x, y);
  };

  const stopMouseDrag = () => {
    if (isDragging) {
      setPan({ ...panRef.current });
    }
    panStartRef.current = null;
    setIsDragging(false);
  };

  return (
    <div className="min-h-screen select-none text-white" style={{ background: "oklch(0.12 0.01 50)" }}>
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <Link
          href={`/${gallery.shareToken}`}
          className="inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to gallery
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setZoomClamped(zoom - 0.2)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/10"
            aria-label="Zoom out"
          >
            <Minus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoomClamped(zoom + 0.2)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/10"
            aria-label="Zoom in"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoomClamped(1)}
            className="rounded-full border border-white/20 px-3 py-2 text-xs text-white transition hover:bg-white/10"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            type="button"
            onClick={() => downloadCurrent(currentPhoto)}
            disabled={isDownloadingCurrent}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/20 px-4 text-sm text-white transition hover:bg-white/10"
          >
            <Download className="h-4 w-4" />
            {isDownloadingCurrent ? "Downloading..." : "Download original"}
          </button>
        </div>
      </div>

      <div className="relative mx-auto flex max-w-7xl items-center justify-center px-4 pb-6 md:px-8">
        {previousPhoto ? (
          <button
            type="button"
            onClick={() => router.push(`/${gallery.shareToken}/photo/${previousPhoto.id}`)}
            className="absolute left-5 z-20 hidden h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-white/20 active:scale-95 md:inline-flex"
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        ) : null}

        <div
          ref={imageViewportRef}
          className={`relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black/30 ${
            zoom >= MAX_ZOOM ? (isDragging ? "cursor-grabbing" : "cursor-zoom-out") : isDragging ? "cursor-grabbing" : "cursor-zoom-in"
          }`}
          onClick={handleImageClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={stopMouseDrag}
          onMouseLeave={stopMouseDrag}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          style={{ touchAction: "none" }}
        >
          <Image
            src={previewSrc}
            alt={currentPhoto.originalFilename}
            width={1200}
            height={800}
            priority
            placeholder="blur"
            blurDataURL={currentPhoto.blurDataUrl}
            draggable={false}
            onContextMenu={(event) => event.preventDefault()}
            className="h-auto max-h-[76vh] w-full object-contain"
            style={{
              transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
              transformOrigin: "center center",
              transition: isDragging ? "none" : "transform 150ms ease-out",
              willChange: "transform",
            }}
            sizes="100vw"
          />
        </div>

        {nextPhoto ? (
          <button
            type="button"
            onClick={() => router.push(`/${gallery.shareToken}/photo/${nextPhoto.id}`)}
            className="absolute right-5 z-20 hidden h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-white/20 active:scale-95 md:inline-flex"
            aria-label="Next photo"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        ) : null}
      </div>

      <div className="mx-auto max-w-3xl px-4 pb-10 text-center md:px-8" />
    </div>
  );
}
