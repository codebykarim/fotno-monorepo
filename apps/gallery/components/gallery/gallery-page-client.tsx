"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Download,
  DownloadCloud,
  Heart,
  MessageSquare,
  Minus,
  Plus,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import PasswordGate from "@/components/gallery/password-gate";
import { getSessionTokenKey, isJwtLikelyValid } from "@/lib/jwt";
import type {
  GalleryApiResponse,
  PublicGallery,
  PublicPhoto,
} from "@/lib/gallery-types";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { Button } from "@workspace/ui/components/button";

type GalleryPageClientProps = {
  initialGallery: PublicGallery;
};

type Viewer = {
  id: string;
  name: string;
  role: "client" | "photographer";
  lastSeenAt: number;
};

type GalleryComment = {
  id: string;
  authorName: string;
  message: string;
  photoId: string | null;
  createdAt: string;
};

const getSessionValidationKey = (shareToken: string) =>
  `${getSessionTokenKey(shareToken)}_session`;

const getFavoritesKey = (shareToken: string) =>
  `fotno_gallery_loved_${shareToken}`;

const getViewerIdKey = (shareToken: string) =>
  `fotno_gallery_viewer_${shareToken}`;

const readStoredToken = (shareToken: string): string | null => {
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

const readStoredValidationToken = (shareToken: string): string | null => {
  const token = sessionStorage.getItem(getSessionValidationKey(shareToken));
  if (!token) {
    return null;
  }

  if (!isJwtLikelyValid(token)) {
    sessionStorage.removeItem(getSessionValidationKey(shareToken));
    return null;
  }

  return token;
};

const readErrorText = async (response: Response): Promise<string> => {
  try {
    const payload = (await response.json()) as { error?: string };
    return payload.error ?? "Request failed";
  } catch {
    return "Request failed";
  }
};

const formatRelative = (isoString: string): string => {
  const timestamp = new Date(isoString).getTime();
  const deltaSeconds = Math.round((Date.now() - timestamp) / 1000);

  if (deltaSeconds < 60) {
    return "just now";
  }
  const deltaMinutes = Math.floor(deltaSeconds / 60);
  if (deltaMinutes < 60) {
    return `${deltaMinutes}m ago`;
  }
  const deltaHours = Math.floor(deltaMinutes / 60);
  if (deltaHours < 24) {
    return `${deltaHours}h ago`;
  }

  return `${Math.floor(deltaHours / 24)}d ago`;
};

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const DEFAULT_PHOTO_WIDTH = 1600;
const DEFAULT_PHOTO_HEIGHT = 1200;

export default function GalleryPageClient({
  initialGallery,
}: GalleryPageClientProps) {
  const [gallery, setGallery] = useState(initialGallery);
  const [galleryJwt, setGalleryJwt] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [downloadingPhotoId, setDownloadingPhotoId] = useState<string | null>(
    null,
  );
  const [filterMode, setFilterMode] = useState<string>("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activePhotoId, setActivePhotoId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const modalViewportRef = useRef<HTMLDivElement | null>(null);
  const panStartRef = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);
  const panRef = useRef({ x: 0, y: 0 });
  const pinchStateRef = useRef<{
    startDistance: number;
    startZoom: number;
  } | null>(null);
  const [viewerCount, setViewerCount] = useState(0);
  const [viewers, setViewers] = useState<Viewer[]>([]);
  const [comments, setComments] = useState<GalleryComment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [commentPhotoId, setCommentPhotoId] = useState<string>("");

  useEffect(() => {
    if (!gallery.hasPassword) {
      return;
    }

    const token = readStoredToken(gallery.shareToken);
    const storedSession = readStoredValidationToken(gallery.shareToken);
    if (!token || !storedSession) {
      return;
    }

    setGalleryJwt(token);
    setSessionToken(storedSession);
    void refreshGallery(token, storedSession).catch(() => {
      clearLocalSession();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gallery.shareToken, gallery.hasPassword]);

  useEffect(() => {
    const favoritesRaw = localStorage.getItem(
      getFavoritesKey(gallery.shareToken),
    );
    if (!favoritesRaw) {
      return;
    }

    try {
      const parsed = JSON.parse(favoritesRaw) as string[];
      if (Array.isArray(parsed)) {
        setFavorites(parsed);
      }
    } catch {
      localStorage.removeItem(getFavoritesKey(gallery.shareToken));
    }
  }, [gallery.shareToken]);

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

  const isUnlocked =
    !gallery.hasPassword || (Boolean(galleryJwt) && Boolean(sessionToken));
  const passwordGateCoverImage =
    gallery.photos.find((photo) => photo.id === gallery.coverPhotoId)
      ?.previewSrc ??
    gallery.photos[0]?.previewSrc ??
    null;

  useEffect(() => {
    if (!isUnlocked) {
      return;
    }

    void loadComments();

    const refreshInterval = window.setInterval(() => {
      void refreshGallery(
        galleryJwt ?? undefined,
        sessionToken ?? undefined,
      ).catch((error) => {
        if (error instanceof Error && error.message === "SESSION_EXPIRED") {
          clearLocalSession();
          toast.error("Gallery password changed. Enter the new password.");
        }
      });
    }, 20_000);

    return () => {
      window.clearInterval(refreshInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUnlocked, gallery.shareToken, galleryJwt, sessionToken]);

  useEffect(() => {
    if (!isUnlocked) {
      return;
    }

    const viewerIdKey = getViewerIdKey(gallery.shareToken);
    let viewerId = sessionStorage.getItem(viewerIdKey);

    if (!viewerId) {
      viewerId = crypto.randomUUID();
      sessionStorage.setItem(viewerIdKey, viewerId);
    }

    const sendHeartbeat = async () => {
      const response = await fetch(
        `/api/gallery/${gallery.shareToken}/presence`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            viewerId,
            name: "Client",
            role: "client",
          }),
        },
      );

      if (!response.ok) {
        return;
      }

      const payload = (await response.json()) as {
        count: number;
        viewers: Viewer[];
      };
      setViewerCount(payload.count);
      setViewers(payload.viewers);
    };

    void sendHeartbeat();
    const intervalId = window.setInterval(() => {
      void sendHeartbeat();
    }, 15_000);

    const handleUnload = () => {
      void fetch(`/api/gallery/${gallery.shareToken}/presence`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        keepalive: true,
        body: JSON.stringify({ viewerId }),
      });
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("beforeunload", handleUnload);
      handleUnload();
    };
  }, [isUnlocked, gallery.shareToken]);

  useEffect(() => {
    panRef.current = pan;
  }, [pan]);

  useEffect(() => {
    if (!activePhotoId) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActivePhotoId(null);
        setZoom(1);
        setPan({ x: 0, y: 0 });
        return;
      }
      if (event.key === "ArrowRight") {
        navigateModal(1);
      }
      if (event.key === "ArrowLeft") {
        navigateModal(-1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePhotoId, gallery.photos]);

  const photoCountLabel = useMemo(() => {
    const total = gallery.photos.length;
    return `${total} ${total === 1 ? "photo" : "photos"}`;
  }, [gallery.photos.length]);

  const visiblePhotos = useMemo(() => {
    if (filterMode === "all") {
      return gallery.photos;
    }
    if (filterMode === "loved") {
      const favoriteSet = new Set(favorites);
      return gallery.photos.filter((photo) => favoriteSet.has(photo.id));
    }

    // Assume filterMode is an albumId
    const album = gallery.albums?.find((a) => a.id === filterMode);
    if (album) {
      const albumPhotoSet = new Set(album.photoIds);
      return gallery.photos.filter((photo) => albumPhotoSet.has(photo.id));
    }

    return gallery.photos;
  }, [favorites, filterMode, gallery.photos, gallery.albums]);

  const activePhoto = useMemo(
    () => gallery.photos.find((photo) => photo.id === activePhotoId) ?? null,
    [activePhotoId, gallery.photos],
  );

  useEffect(() => {
    if (!activePhotoId) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  }, [activePhotoId]);

  const withOptionalToken = (src: string): string => {
    const queryParts: string[] = [];

    if (galleryJwt) {
      queryParts.push(`token=${encodeURIComponent(galleryJwt)}`);
    }

    if (sessionToken) {
      queryParts.push(`sessionToken=${encodeURIComponent(sessionToken)}`);
    }

    if (queryParts.length === 0) {
      return src;
    }

    if (src.includes("X-Amz-Signature=") || src.includes("x-amz-signature=")) {
      return src;
    }

    if (!src.startsWith("/api/photos/")) {
      return src;
    }

    return `${src}&${queryParts.join("&")}`;
  };

  const clearLocalSession = () => {
    sessionStorage.removeItem(getSessionTokenKey(gallery.shareToken));
    sessionStorage.removeItem(getSessionValidationKey(gallery.shareToken));
    setGalleryJwt(null);
    setSessionToken(null);
    setActivePhotoId(null);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const refreshGallery = async (
    token?: string,
    validationToken?: string,
  ): Promise<void> => {
    const response = await fetch(`/api/gallery/${gallery.shareToken}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(validationToken ? { "x-gallery-session": validationToken } : {}),
      },
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error("SESSION_EXPIRED");
      }
      throw new Error(await readErrorText(response));
    }

    const payload = (await response.json()) as GalleryApiResponse;
    setGallery(payload.gallery);
  };

  const loadComments = async () => {
    const response = await fetch(
      `/api/gallery/${gallery.shareToken}/comments`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return;
    }

    const payload = (await response.json()) as { comments: GalleryComment[] };
    setComments(payload.comments);
  };

  const unlockGallery = async (password: string) => {
    setIsUnlocking(true);
    try {
      const response = await fetch(
        `/api/gallery/${gallery.shareToken}/unlock`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        },
      );

      if (!response.ok) {
        throw new Error(await readErrorText(response));
      }

      const payload = (await response.json()) as {
        token?: string;
        sessionToken?: string;
      };

      if (!payload.token || !payload.sessionToken) {
        throw new Error("Unlock token was not returned");
      }

      sessionStorage.setItem(
        getSessionTokenKey(gallery.shareToken),
        payload.token,
      );
      sessionStorage.setItem(
        getSessionValidationKey(gallery.shareToken),
        payload.sessionToken,
      );
      setGalleryJwt(payload.token);
      setSessionToken(payload.sessionToken);
      await refreshGallery(payload.token, payload.sessionToken);
      toast.success("Gallery unlocked");
    } catch (error) {
      clearLocalSession();
      const message =
        error instanceof Error ? error.message : "Unable to unlock";
      toast.error(message);
    } finally {
      setIsUnlocking(false);
    }
  };

  const handleSingleDownload = async (photo: PublicPhoto) => {
    setDownloadingPhotoId(photo.id);
    try {
      const response = await fetch(
        `/api/photos/${photo.id}/download?shareToken=${encodeURIComponent(gallery.shareToken)}&fileName=${encodeURIComponent(photo.originalFilename)}${sessionToken ? `&sessionToken=${encodeURIComponent(sessionToken)}` : ""}`,
        {
          headers: {
            ...(galleryJwt ? { Authorization: `Bearer ${galleryJwt}` } : {}),
            ...(sessionToken ? { "x-gallery-session": sessionToken } : {}),
          },
        },
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
      const message =
        error instanceof Error ? error.message : "Download failed";
      toast.error(message);
    } finally {
      setDownloadingPhotoId(null);
    }
  };

  const handleDownloadAll = async () => {
    setIsDownloadingAll(true);

    try {
      const response = await fetch(
        `/api/gallery/${gallery.shareToken}/download-all`,
        {
          headers: {
            ...(galleryJwt ? { Authorization: `Bearer ${galleryJwt}` } : {}),
            ...(sessionToken ? { "x-gallery-session": sessionToken } : {}),
          },
        },
      );

      if (!response.ok) {
        throw new Error(await readErrorText(response));
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = `${gallery.title.replace(/\s+/g, "-").toLowerCase()}.zip`;
      anchor.click();
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to download ZIP";
      toast.error(message);
    } finally {
      setIsDownloadingAll(false);
    }
  };

  const toggleFavorite = (photoId: string) => {
    const next = favorites.includes(photoId)
      ? favorites.filter((id) => id !== photoId)
      : [...favorites, photoId];
    setFavorites(next);
    localStorage.setItem(
      getFavoritesKey(gallery.shareToken),
      JSON.stringify(next),
    );
  };

  const navigateModal = (direction: 1 | -1) => {
    if (!activePhotoId) {
      return;
    }

    const currentIndex = gallery.photos.findIndex(
      (photo) => photo.id === activePhotoId,
    );
    if (currentIndex < 0) {
      return;
    }

    const nextIndex = currentIndex + direction;
    if (nextIndex < 0 || nextIndex >= gallery.photos.length) {
      return;
    }

    setActivePhotoId(gallery.photos[nextIndex]?.id ?? null);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const clampZoom = useCallback((value: number) => {
    return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, Number(value.toFixed(2))));
  }, []);

  const getPanLimits = useCallback(
    (zoomLevel: number) => {
      const viewport = modalViewportRef.current;
      if (!viewport || !activePhoto) {
        return { maxX: 0, maxY: 0 };
      }

      const containerWidth = viewport.clientWidth;
      const containerHeight = viewport.clientHeight;
      if (containerWidth <= 0 || containerHeight <= 0) {
        return { maxX: 0, maxY: 0 };
      }

      const imageWidth = activePhoto.width ?? DEFAULT_PHOTO_WIDTH;
      const imageHeight = activePhoto.height ?? DEFAULT_PHOTO_HEIGHT;
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
    [activePhoto],
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

      const viewport = modalViewportRef.current;
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
    if (!activePhoto || zoom <= MIN_ZOOM) {
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
  }, [activePhoto, getPanLimits, zoom]);

  const handleModalWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const delta = event.deltaY < 0 ? 0.15 : -0.15;
    setZoomClamped(zoom + delta, { x: event.clientX, y: event.clientY });
  };

  const distanceBetweenTouches = (touches: React.TouchList): number => {
    if (touches.length < 2) {
      return 0;
    }
    const dx = touches[0]!.clientX - touches[1]!.clientX;
    const dy = touches[0]!.clientY - touches[1]!.clientY;
    return Math.hypot(dx, dy);
  };

  const handleModalTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length === 2) {
      setIsDragging(false);
      panStartRef.current = null;
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
      panStartRef.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        originX: panRef.current.x,
        originY: panRef.current.y,
      };
      return;
    }

    panStartRef.current = null;
    pinchStateRef.current = null;
    setIsDragging(false);
  };

  const handleModalTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
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
      setPanClamped(
        panStartRef.current.originX + deltaX,
        panStartRef.current.originY + deltaY,
      );
    }
  };

  const handleModalTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
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
      panStartRef.current = null;
      setIsDragging(false);
    }
  };

  const handleModalMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.button !== 0 || zoom <= MIN_ZOOM) {
      return;
    }

    event.preventDefault();
    setIsDragging(true);
    panStartRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: panRef.current.x,
      originY: panRef.current.y,
    };
  };

  const handleModalMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !panStartRef.current || zoom <= MIN_ZOOM) {
      return;
    }

    event.preventDefault();
    const deltaX = event.clientX - panStartRef.current.startX;
    const deltaY = event.clientY - panStartRef.current.startY;
    setPanClamped(
      panStartRef.current.originX + deltaX,
      panStartRef.current.originY + deltaY,
    );
  };

  const stopModalMouseDrag = () => {
    panStartRef.current = null;
    setIsDragging(false);
  };

  const postComment = async () => {
    const message = commentText.trim();
    if (!message) {
      return;
    }

    const response = await fetch(
      `/api/gallery/${gallery.shareToken}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authorName: "Client",
          message,
          photoId: commentPhotoId || null,
        }),
      },
    );

    if (!response.ok) {
      toast.error(await readErrorText(response));
      return;
    }

    const payload = (await response.json()) as { comments: GalleryComment[] };
    setComments(payload.comments);
    setCommentText("");
    toast.success("Comment sent");
  };

  if (!isUnlocked) {
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

  return (
    <div className="min-h-screen select-none bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-white/95 px-4 py-4 backdrop-blur-md md:px-8 transition-colors">
        <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {gallery.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {gallery.photographer.name} • {photoCountLabel}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setFilterMode("all")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                filterMode === "all"
                  ? "bg-foreground text-background"
                  : "bg-transparent text-muted-foreground hover:bg-slate-100 hover:text-foreground"
              }`}
            >
              All Photos
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("loved")}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                filterMode === "loved"
                  ? "bg-foreground text-background"
                  : "bg-transparent text-muted-foreground hover:bg-slate-100 hover:text-foreground"
              }`}
            >
              <Heart
                className={`h-3.5 w-3.5 ${filterMode === "loved" ? "fill-background text-background" : "text-muted-foreground"}`}
              />
              {favorites.length} loved
            </button>

            {gallery.albums?.map((album) => (
              <button
                key={album.id}
                type="button"
                onClick={() => setFilterMode(album.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  filterMode === album.id
                    ? "bg-foreground text-background"
                    : "bg-transparent text-muted-foreground hover:bg-slate-100 hover:text-foreground"
                }`}
              >
                {album.title}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-slate-50 px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-foreground opacity-20"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-foreground/50"></span>
              </span>
              {viewerCount} online
            </span>
            <button
              type="button"
              onClick={handleDownloadAll}
              disabled={isDownloadingAll}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background shadow-sm transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <DownloadCloud className="h-4 w-4" />
              {isDownloadingAll ? "Preparing ZIP..." : "Download All"}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-[1500px] gap-6 px-4 py-6 md:px-8 md:py-10 xl:grid-cols-[1fr_360px]">
        <section className="min-w-0">
          <div className="columns-2 gap-3 space-y-3 md:columns-3 md:gap-4 md:space-y-4 xl:columns-4">
            {visiblePhotos.map((photo, index) => {
              const imageSrc = withOptionalToken(photo.thumbnailSrc);
              const loved = favorites.includes(photo.id);

              return (
                <article
                  key={photo.id}
                  className="group relative mb-3 break-inside-avoid overflow-hidden rounded-2xl bg-slate-950 md:mb-4"
                  style={{ contentVisibility: "auto" }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setActivePhotoId(photo.id);
                      setZoom(1);
                      setPan({ x: 0, y: 0 });
                      setCommentPhotoId(photo.id);
                    }}
                    className="block w-full"
                  >
                    <Image
                      src={imageSrc}
                      alt={photo.aiCaption ?? photo.originalFilename}
                      width={photo.width ?? 1200}
                      height={photo.height ?? 900}
                      sizes="(max-width: 768px) 50vw, (max-width: 1300px) 33vw, 25vw"
                      placeholder="blur"
                      blurDataURL={photo.blurDataUrl}
                      draggable={false}
                      onContextMenu={(event) => event.preventDefault()}
                      className="h-auto w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                      priority={index < 8}
                    />
                  </button>

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                  <button
                    type="button"
                    onClick={() => toggleFavorite(photo.id)}
                    className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur transition hover:bg-black/70"
                    aria-label={loved ? "Remove from loved" : "Add to loved"}
                  >
                    <Heart
                      className={`h-4 w-4 transition-colors ${
                        loved ? "fill-white text-white" : "text-white"
                      }`}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSingleDownload(photo)}
                    disabled={downloadingPhotoId === photo.id}
                    className="absolute right-3 bottom-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-900 opacity-0 shadow-sm transition group-hover:opacity-100"
                    aria-label="Download photo"
                  >
                    <Download
                      className={`h-4 w-4 ${downloadingPhotoId === photo.id ? "animate-pulse" : ""}`}
                    />
                  </button>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      {activePhoto ? (
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
            <button
              type="button"
              onClick={() => void handleSingleDownload(activePhoto)}
              disabled={downloadingPhotoId === activePhoto.id}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-white/25 bg-black/45 px-4 text-sm text-white"
            >
              <Download className="h-4 w-4" />
              {downloadingPhotoId === activePhoto.id ? "Downloading..." : "Download"}
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

          <div className="flex h-full items-center justify-center px-4 py-20 md:px-8">
            <button
              type="button"
              onClick={() => navigateModal(-1)}
              className="mr-3 hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white md:inline-flex"
              aria-label="Previous photo"
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
              onMouseUp={stopModalMouseDrag}
              onMouseLeave={stopModalMouseDrag}
              onTouchStart={handleModalTouchStart}
              onTouchMove={handleModalTouchMove}
              onTouchEnd={handleModalTouchEnd}
              onTouchCancel={handleModalTouchEnd}
              style={{ touchAction: "none" }}
            >
              <Image
                src={withOptionalToken(activePhoto.previewSrc)}
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
                onContextMenu={(event) => event.preventDefault()}
                priority
                unoptimized
              />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.28)_100%)]" />
            </div>

            <button
              type="button"
              onClick={() => navigateModal(1)}
              className="ml-3 hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white md:inline-flex"
              aria-label="Next photo"
            >
              →
            </button>
          </div>
        </div>
      ) : null}

      <footer className="border-t border-border/70 px-4 py-6 text-center text-sm text-muted-foreground md:px-8 absolute bottom-0 left-0 right-0">
        Powered by FOTNO
      </footer>

      <Sheet>
        <SheetTrigger asChild>
          <Button className="absolute right-5 bottom-20">
            <MessageSquare className="h-4 w-4" />
            Comments
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Client Notes</SheetTitle>
            <SheetDescription>
              <span className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-background px-2.5 py-1 text-xs text-muted-foreground">
                <MessageSquare className="h-3.5 w-3.5" />
                {comments.length}
              </span>
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              Mention image
            </label>
            <select
              value={commentPhotoId}
              onChange={(event) => setCommentPhotoId(event.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
            >
              <option value="">General comment</option>
              {gallery.photos.map((photo, index) => (
                <option key={photo.id} value={photo.id}>
                  Image #{index + 1}
                </option>
              ))}
            </select>
          </div>

          <textarea
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            placeholder="Write feedback and mention a specific image if needed..."
            className="min-h-[110px] w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none ring-primary/20 transition focus:ring-2"
          />

          <button
            type="button"
            onClick={() => void postComment()}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Send Comment
          </button>

          <div className="space-y-2 pt-2">
            {comments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No comments yet.</p>
            ) : (
              comments.map((comment) => (
                <article
                  key={comment.id}
                  className="rounded-xl border border-border/70 bg-background/80 p-3"
                >
                  <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                    <p className="font-medium text-foreground">
                      {comment.authorName}
                    </p>
                    <p>{formatRelative(comment.createdAt)}</p>
                  </div>
                  {comment.photoId ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (comment.photoId) {
                          setActivePhotoId(comment.photoId);
                          setCommentPhotoId(comment.photoId);
                        }
                      }}
                      className="mt-1 rounded-full border border-border/70 bg-background px-2 py-0.5 text-[11px] text-muted-foreground"
                    >
                      Mentioned image
                    </button>
                  ) : null}
                  <p className="mt-2 text-sm text-foreground/90">
                    {comment.message}
                  </p>
                </article>
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
