"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Camera,
  Check,
  CornerDownRight,
  Download,
  DownloadCloud,
  Heart,
  MessageSquare,
  Minus,
  Pencil,
  Plus,
  Reply,
  ThumbsUp,
  Trash2,
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
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { Button } from "@workspace/ui/components/button";
import { useSession } from "@workspace/lib/auth/auth-client";

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
  authorRole: "client" | "photographer";
  message: string;
  photoId: string | null;
  parentId: string | null;
  likes: string[];
  createdAt: string;
  updatedAt: string;
  viewerId: string | null;
  replies: GalleryComment[];
  photo?: { thumbnailSrc: string } | null;
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

const countAllComments = (list: GalleryComment[]): number =>
  list.reduce(
    (sum, c) => sum + 1 + countAllComments(c.replies ?? []),
    0,
  );

const MAX_REPLY_DEPTH = 6;

type CommentNodeProps = {
  comment: GalleryComment;
  depth: number;
  currentViewerId: string;
  isPhotographer: boolean;
  editingComment: GalleryComment | null;
  editText: string;
  onSetEditText: (text: string) => void;
  onStartEdit: (c: GalleryComment) => void;
  onCancelEdit: () => void;
  onSaveEdit: (c: GalleryComment) => void;
  onDelete: (c: GalleryComment) => void;
  onToggleLike: (c: GalleryComment) => void;
  onReply: (c: GalleryComment) => void;
  onViewPhoto: (photoId: string) => void;
  withOptionalToken: (src: string) => string;
  formatRelative: (iso: string) => string;
};

function CommentNode({
  comment,
  depth,
  currentViewerId,
  isPhotographer,
  editingComment,
  editText,
  onSetEditText,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
  onToggleLike,
  onReply,
  onViewPhoto,
  withOptionalToken,
  formatRelative,
}: CommentNodeProps) {
  const isEditing = editingComment?.id === comment.id;
  const isOwn = Boolean(currentViewerId) && comment.viewerId === currentViewerId;
  const canEdit = isOwn;
  const canDelete = isOwn || isPhotographer;
  const liked = comment.likes.includes(currentViewerId);
  const isNested = depth > 0;

  return (
    <div className={isNested ? "space-y-2" : "space-y-2"}>
      <article
        className={`rounded-xl border p-2.5 ${
          isNested
            ? "border-border/50 bg-background/60"
            : "border-border/70 bg-background/80 p-3"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-foreground">
              {comment.authorName}
            </span>
            {comment.authorRole === "photographer" ? (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                <Camera className="h-2.5 w-2.5" />
                Photographer
              </span>
            ) : (
              <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                Client
              </span>
            )}
            {comment.updatedAt !== comment.createdAt ? (
              <span className="text-[10px] text-muted-foreground/60">(edited)</span>
            ) : null}
          </div>
          <span className="shrink-0 text-muted-foreground">
            {formatRelative(comment.createdAt)}
          </span>
        </div>

        {/* Referenced photo */}
        {comment.photoId && comment.photo?.thumbnailSrc ? (
          <button
            type="button"
            onClick={() => comment.photoId && onViewPhoto(comment.photoId)}
            className="mt-2 flex items-center gap-2 rounded-lg border border-border/70 bg-muted/40 p-1.5 transition hover:bg-muted/70"
          >
            <Image
              src={withOptionalToken(comment.photo.thumbnailSrc)}
              alt="Referenced photo"
              width={40}
              height={40}
              className="h-10 w-10 rounded object-cover"
              draggable={false}
            />
            <span className="text-[11px] text-muted-foreground">
              View referenced photo
            </span>
          </button>
        ) : null}

        {/* Message or edit form */}
        {isEditing ? (
          <div className="mt-2 space-y-2">
            <textarea
              value={editText}
              onChange={(e) => onSetEditText(e.target.value)}
              className="min-h-[60px] w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none ring-primary/20 transition focus:ring-2"
            />
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => onSaveEdit(comment)}
                disabled={!editText.trim()}
                className="inline-flex h-7 items-center gap-1 rounded-md bg-primary px-2.5 text-[11px] font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
              >
                <Check className="h-3 w-3" />
                Save
              </button>
              <button
                type="button"
                onClick={onCancelEdit}
                className="inline-flex h-7 items-center gap-1 rounded-md border border-border px-2.5 text-[11px] font-medium text-muted-foreground transition hover:text-foreground"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-2 text-sm leading-relaxed text-foreground/90">
            {comment.message}
          </p>
        )}

        {/* Actions */}
        {!isEditing ? (
          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => onToggleLike(comment)}
              className={`inline-flex items-center gap-1 text-xs transition ${
                liked
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ThumbsUp className={`h-3 w-3 ${liked ? "fill-primary" : ""}`} />
              {comment.likes.length > 0 ? comment.likes.length : null}
            </button>

            {depth < MAX_REPLY_DEPTH ? (
              <button
                type="button"
                onClick={() => onReply(comment)}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground transition hover:text-foreground"
              >
                <Reply className="h-3 w-3" />
                Reply
              </button>
            ) : null}

            {canEdit ? (
              <button
                type="button"
                onClick={() => onStartEdit(comment)}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground transition hover:text-foreground"
              >
                <Pencil className="h-3 w-3" />
                Edit
              </button>
            ) : null}

            {canDelete ? (
              <button
                type="button"
                onClick={() => onDelete(comment)}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground transition hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
                Delete
              </button>
            ) : null}
          </div>
        ) : null}
      </article>

      {/* Recursive nested replies */}
      {comment.replies?.length > 0 ? (
        <div className="ml-4 space-y-2 border-l-2 border-border/50 pl-3">
          {comment.replies.map((reply: GalleryComment) => (
            <CommentNode
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              currentViewerId={currentViewerId}
              isPhotographer={isPhotographer}
              editingComment={editingComment}
              editText={editText}
              onSetEditText={onSetEditText}
              onStartEdit={onStartEdit}
              onCancelEdit={onCancelEdit}
              onSaveEdit={onSaveEdit}
              onDelete={onDelete}
              onToggleLike={onToggleLike}
              onReply={onReply}
              onViewPhoto={onViewPhoto}
              withOptionalToken={withOptionalToken}
              formatRelative={formatRelative}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const DEFAULT_PHOTO_WIDTH = 1600;
const DEFAULT_PHOTO_HEIGHT = 1200;

export default function GalleryPageClient({
  initialGallery,
}: GalleryPageClientProps) {
  const { data: session } = useSession();
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
  const [replyingTo, setReplyingTo] = useState<GalleryComment | null>(null);
  const [editingComment, setEditingComment] = useState<GalleryComment | null>(null);
  const [editText, setEditText] = useState("");

  const isPhotographer =
    Boolean(session?.user?.id) && session?.user?.id === gallery.userId;
  const viewerRole: "client" | "photographer" =
    isPhotographer ? "photographer" : "client";
  const viewerDisplayName =
    isPhotographer ? (session?.user?.name ?? gallery.photographer.name) : "Client";

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

    // Initial load
    fetch(`/api/gallery/${gallery.shareToken}/comments`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.comments) setComments(data.comments);
      })
      .catch(() => {});

    // SSE for real-time updates
    const es = new EventSource(
      `/api/gallery/${gallery.shareToken}/comments/stream`,
    );

    es.addEventListener("comments", (event) => {
      try {
        const data = JSON.parse(event.data) as { comments?: GalleryComment[] };
        if (data.comments) {
          setComments(data.comments);
        }
      } catch { /* ignore malformed events */ }
    });

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
      es.close();
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
            name: viewerDisplayName,
            role: viewerRole,
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
      const clampedX = Math.max(
        -maxX,
        Math.min(maxX, Number(nextX.toFixed(2))),
      );
      const clampedY = Math.max(
        -maxY,
        Math.min(maxY, Number(nextY.toFixed(2))),
      );
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

    const viewerIdKey = getViewerIdKey(gallery.shareToken);
    const viewerId = sessionStorage.getItem(viewerIdKey);

    const response = await fetch(
      `/api/gallery/${gallery.shareToken}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authorName: viewerDisplayName,
          authorRole: viewerRole,
          message,
          photoId: commentPhotoId || null,
          parentId: replyingTo?.id ?? null,
          viewerId,
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
    setReplyingTo(null);
    toast.success(replyingTo ? "Reply sent" : "Comment sent");
  };

  const getViewerId = (): string => {
    const viewerIdKey = getViewerIdKey(gallery.shareToken);
    return sessionStorage.getItem(viewerIdKey) ?? "";
  };

  const editComment = async (comment: GalleryComment, newMessage: string) => {
    const message = newMessage.trim();
    if (!message) return;

    const response = await fetch(
      `/api/gallery/${gallery.shareToken}/comments/${comment.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ viewerId: getViewerId(), message }),
      },
    );

    if (!response.ok) {
      toast.error(await readErrorText(response));
      return;
    }

    const payload = (await response.json()) as { comments: GalleryComment[] };
    setComments(payload.comments);
    setEditingComment(null);
    setEditText("");
    toast.success("Comment updated");
  };

  const deleteComment = async (comment: GalleryComment) => {
    const response = await fetch(
      `/api/gallery/${gallery.shareToken}/comments/${comment.id}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          viewerId: getViewerId(),
          isGalleryOwner: isPhotographer,
        }),
      },
    );

    if (!response.ok) {
      toast.error(await readErrorText(response));
      return;
    }

    const payload = (await response.json()) as { comments: GalleryComment[] };
    setComments(payload.comments);
    toast.success("Comment deleted");
  };

  const toggleLike = async (comment: GalleryComment) => {
    const response = await fetch(
      `/api/gallery/${gallery.shareToken}/comments/${comment.id}/like`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ viewerId: getViewerId() }),
      },
    );

    if (!response.ok) {
      toast.error(await readErrorText(response));
      return;
    }

    const payload = (await response.json()) as { comments: GalleryComment[] };
    setComments(payload.comments);
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
    <div className="min-h-screen select-none bg-background relative">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 px-4 py-4 backdrop-blur-md md:px-8 transition-colors">
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
                  : "bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              All Photos
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("loved")}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                filterMode === "loved"
                  ? "bg-primary text-primary-foreground"
                  : "bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <Heart
                className={`h-3.5 w-3.5 ${filterMode === "loved" ? "fill-primary-foreground text-primary-foreground" : "text-muted-foreground"}`}
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
                  : "bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {album.title}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-40"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary/70"></span>
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

      <main className="mx-auto grid w-full max-w-[1500px] gap-6 px-4 py-6 md:px-8 md:py-10">
        <section className="min-w-0">
          <div className="columns-2 gap-3 space-y-3 md:columns-3 md:gap-4 md:space-y-4 xl:columns-3">
            {visiblePhotos.map((photo, index) => {
              const imageSrc = withOptionalToken(photo.thumbnailSrc);
              const loved = favorites.includes(photo.id);

              return (
                <article
                  key={photo.id}
                  className="group relative mb-3 break-inside-avoid overflow-hidden rounded-2xl bg-foreground md:mb-4"
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
                        loved ? "fill-primary text-primary" : "text-white"
                      }`}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSingleDownload(photo)}
                    disabled={downloadingPhotoId === photo.id}
                    className="absolute right-3 bottom-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-card/90 text-foreground opacity-0 shadow-sm transition group-hover:opacity-100"
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
              {downloadingPhotoId === activePhoto.id
                ? "Downloading..."
                : "Download"}
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

      <footer className="border-t border-border/70 px-4 py-6 text-center text-sm text-muted-foreground md:px-8">
        Powered by <span className="font-semibold text-primary">FOTNO</span>
      </footer>

      <Sheet>
        <SheetTrigger asChild>
          <Button className="fixed right-5 bottom-5 z-40 gap-2 shadow-lg">
            <MessageSquare className="h-4 w-4" />
            Comments
            {comments.length > 0 ? (
              <span className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-foreground/20 px-1 text-[11px] font-semibold">
                {countAllComments(comments)}
              </span>
            ) : null}
          </Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col overflow-hidden">
          <SheetHeader>
            <SheetTitle>
              {viewerRole === "photographer" ? "Gallery Feedback" : "Leave Feedback"}
            </SheetTitle>
            <SheetDescription>
              {viewerRole === "photographer"
                ? "View and reply to client feedback"
                : "Share your thoughts on the photos"}
            </SheetDescription>
          </SheetHeader>

          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
            {/* ── Compose area ── */}
            <div className="shrink-0 space-y-3 rounded-xl border border-border/70 bg-muted/30 p-3">
              {/* Thumbnail image picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Reference a photo
                </label>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  <button
                    type="button"
                    onClick={() => setCommentPhotoId("")}
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border-2 text-[10px] font-medium transition ${
                      commentPhotoId === ""
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background text-muted-foreground hover:border-foreground/30"
                    }`}
                  >
                    General
                  </button>
                  {gallery.photos.map((photo: PublicPhoto, index: number) => {
                    const selected = commentPhotoId === photo.id;
                    return (
                      <button
                        key={photo.id}
                        type="button"
                        onClick={() => setCommentPhotoId(photo.id)}
                        title={photo.aiCaption ?? `Image #${index + 1}`}
                        className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                          selected
                            ? "border-primary ring-2 ring-primary/30"
                            : "border-border hover:border-foreground/30"
                        }`}
                      >
                        <Image
                          src={withOptionalToken(photo.thumbnailSrc)}
                          alt={photo.aiCaption ?? `Image #${index + 1}`}
                          fill
                          sizes="56px"
                          className="object-cover"
                          draggable={false}
                        />
                        <span className="absolute bottom-0 left-0 right-0 bg-black/60 py-px text-center text-[9px] font-medium text-white">
                          #{index + 1}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reply indicator */}
              {replyingTo ? (
                <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-2.5 py-1.5 text-xs">
                  <CornerDownRight className="h-3 w-3 shrink-0 text-primary" />
                  <span className="truncate text-foreground/80">
                    Replying to <strong>{replyingTo.authorName}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setReplyingTo(null)}
                    className="ml-auto shrink-0 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : null}

              <textarea
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                placeholder={
                  replyingTo
                    ? `Reply to ${replyingTo.authorName}...`
                    : "Write your feedback..."
                }
                className="min-h-[80px] w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none ring-primary/20 transition focus:ring-2"
              />

              <button
                type="button"
                onClick={() => void postComment()}
                disabled={!commentText.trim()}
                className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
              >
                {replyingTo ? "Send Reply" : "Send Comment"}
              </button>
            </div>

            {/* ── Comments list ── */}
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
              {comments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <MessageSquare className="mb-2 h-8 w-8 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">No comments yet.</p>
                  <p className="mt-0.5 text-xs text-muted-foreground/60">
                    Be the first to leave feedback
                  </p>
                </div>
              ) : (
                comments.map((comment: GalleryComment) => (
                  <CommentNode
                    key={comment.id}
                    comment={comment}
                    depth={0}
                    currentViewerId={getViewerId()}
                    isPhotographer={isPhotographer}
                    editingComment={editingComment}
                    editText={editText}
                    onSetEditText={setEditText}
                    onStartEdit={(c) => {
                      setEditingComment(c);
                      setEditText(c.message);
                    }}
                    onCancelEdit={() => {
                      setEditingComment(null);
                      setEditText("");
                    }}
                    onSaveEdit={(c) => void editComment(c, editText)}
                    onDelete={(c) => void deleteComment(c)}
                    onToggleLike={(c) => void toggleLike(c)}
                    onReply={(c) => {
                      setReplyingTo(c);
                      setCommentPhotoId("");
                    }}
                    onViewPhoto={(photoId) => setActivePhotoId(photoId)}
                    withOptionalToken={withOptionalToken}
                    formatRelative={formatRelative}
                  />
                ))
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
