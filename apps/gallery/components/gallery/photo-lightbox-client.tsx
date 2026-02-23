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

const readErrorText = async (response: Response): Promise<string> => {
  try {
    const payload = (await response.json()) as { error?: string };
    return payload.error ?? "Request failed";
  } catch {
    return "Request failed";
  }
};

const getStoredToken = (shareToken: string): string | null => {
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
  const [zoom, setZoom] = useState(1);
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
    setZoom(1);
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
    try {
      const response = await fetch(
        `/api/photos/${photo.id}/url?shareToken=${encodeURIComponent(gallery.shareToken)}&variant=original`,
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

      const payload = (await response.json()) as { url: string };
      const link = document.createElement("a");
      link.href = payload.url;
      link.download = photo.originalFilename;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.click();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Download failed";
      toast.error(message);
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

  if (gallery.hasPassword && !galleryJwt) {
    return (
      <PasswordGate
        title={gallery.title}
        onUnlock={unlockGallery}
        isSubmitting={isUnlocking}
      />
    );
  }

  if (!currentPhoto) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">
        Photo not found
      </div>
    );
  }

  const previewSrc = withOptionalToken(currentPhoto.previewSrc);
  const setZoomClamped = useCallback((value: number) => {
    const clamped = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, Number(value.toFixed(2))));
    setZoom(clamped);
  }, []);

  const handleWheelZoom = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const delta = event.deltaY < 0 ? 0.15 : -0.15;
    setZoomClamped(zoom + delta);
  };

  const distanceBetweenTouches = (touches: React.TouchList): number => {
    if (touches.length < 2) {
      return 0;
    }
    const dx = touches[0]!.clientX - touches[1]!.clientX;
    const dy = touches[0]!.clientY - touches[1]!.clientY;
    return Math.hypot(dx, dy);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length !== 2) {
      return;
    }
    pinchStateRef.current = {
      startDistance: distanceBetweenTouches(event.touches),
      startZoom: zoom,
    };
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length !== 2 || !pinchStateRef.current) {
      return;
    }
    event.preventDefault();
    const nextDistance = distanceBetweenTouches(event.touches);
    const { startDistance, startZoom } = pinchStateRef.current;
    if (startDistance <= 0 || nextDistance <= 0) {
      return;
    }
    setZoomClamped(startZoom * (nextDistance / startDistance));
  };

  const handleTouchEnd = () => {
    pinchStateRef.current = null;
  };

  return (
    <div className="min-h-screen select-none bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <Link
          href={`/${gallery.shareToken}`}
          className="inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-white"
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
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/20 px-4 text-sm text-white transition hover:bg-white/10"
          >
            <Download className="h-4 w-4" />
            Download original
          </button>
        </div>
      </div>

      <div className="relative mx-auto flex max-w-7xl items-center justify-center px-4 pb-6 md:px-8">
        {previousPhoto ? (
          <button
            type="button"
            onClick={() => router.push(`/${gallery.shareToken}/photo/${previousPhoto.id}`)}
            className="absolute left-5 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white backdrop-blur transition hover:bg-black/55"
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        ) : null}

        <div
          className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black/30"
          onWheel={handleWheelZoom}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          style={{ touchAction: "none" }}
        >
          <Image
            src={previewSrc}
            alt={currentPhoto.aiCaption ?? currentPhoto.originalFilename}
            width={1200}
            height={800}
            priority
            placeholder="blur"
            blurDataURL={currentPhoto.blurDataUrl}
            draggable={false}
            onContextMenu={(event) => event.preventDefault()}
            className="h-auto max-h-[76vh] w-full object-contain transition duration-200"
            style={{ transform: `scale(${zoom})` }}
            sizes="100vw"
          />
        </div>

        {nextPhoto ? (
          <button
            type="button"
            onClick={() => router.push(`/${gallery.shareToken}/photo/${nextPhoto.id}`)}
            className="absolute right-5 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white backdrop-blur transition hover:bg-black/55"
            aria-label="Next photo"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        ) : null}
      </div>

      <div className="mx-auto max-w-3xl px-4 pb-10 text-center md:px-8">
        {currentPhoto.aiCaption ? (
          <p className="text-sm leading-relaxed text-slate-300">{currentPhoto.aiCaption}</p>
        ) : (
          <p className="text-sm text-slate-500">No caption available for this photo.</p>
        )}
      </div>
    </div>
  );
}
