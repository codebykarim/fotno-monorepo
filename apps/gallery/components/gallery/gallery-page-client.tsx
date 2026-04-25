"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Album,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  CornerDownRight,
  Download,
  DownloadCloud,
  Heart,
  Lock,
  LogOut,
  MessageSquare,
  Minus,
  Pause,
  Pencil,
  Phone,
  Play,
  Plus,
  Reply,
  Share2,
  ThumbsUp,
  Trash2,
  User,
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
import { Input } from "@workspace/ui/components/input";
import { PhoneInputComponent } from "@workspace/ui/components/phone";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { useSession } from "@workspace/lib/auth/auth-client";
import { Logo } from "@workspace/ui/components/logo";
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

const getViewerNameKey = (shareToken: string) =>
  `fotno_gallery_viewer_name_${shareToken}`;

const readStoredToken = (shareToken: string): string | null => {
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

const readStoredValidationToken = (shareToken: string): string | null => {
  if (typeof window === "undefined") return null;
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
  list.reduce((sum, c) => sum + 1 + countAllComments(c.replies ?? []), 0);

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
  const isOwn =
    Boolean(currentViewerId) && comment.viewerId === currentViewerId;
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
              <span className="text-[10px] text-muted-foreground/60">
                (edited)
              </span>
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
  const [favoriteNotes, setFavoriteNotes] = useState<Record<string, string>>(
    {},
  );
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
  const [editingComment, setEditingComment] = useState<GalleryComment | null>(
    null,
  );
  const [editText, setEditText] = useState("");
  const [sendingComment, setSendingComment] = useState(false);
  const [commentsSheetOpen, setCommentsSheetOpen] = useState(false);
  const [pinDialogOpen, setPinDialogOpen] = useState(false);
  const [pinValue, setPinValue] = useState("");
  const [pinVerified, setPinVerified] = useState(false);
  const [pinVerifying, setPinVerifying] = useState(false);
  const pendingDownloadRef = useRef<(() => void) | null>(null);
  const [noteDialogPhotoId, setNoteDialogPhotoId] = useState<string | null>(
    null,
  );
  const [noteText, setNoteText] = useState("");
  const [sizePickerPhoto, setSizePickerPhoto] = useState<PublicPhoto | null>(
    null,
  );
  const [phoneDialogOpen, setPhoneDialogOpen] = useState(false);
  const [phoneDialogMode, setPhoneDialogMode] = useState<
    "retrieve" | "changePhone"
  >("retrieve");
  const [retrieveStep, setRetrieveStep] = useState<1 | 2>(1);
  const [comeFrom, setComeFrom] = useState<"lovePhoto" | "lovedTab" | null>(
    null,
  );
  const [phoneValue, setPhoneValue] = useState("");
  const [nameValue, setNameValue] = useState("");
  const [phoneSubmitting, setPhoneSubmitting] = useState(false);
  const pendingFavoritePhotoIdRef = useRef<string | null>(null);
  const pendingDownloadActionRef = useRef<(() => void) | null>(null);
  const pendingCommentActionRef = useRef<(() => void) | null>(null);
  const [editNameDialogOpen, setEditNameDialogOpen] = useState(false);
  const [editNameValue, setEditNameValue] = useState("");

  const isPhotographer =
    Boolean(session?.user?.id) && session?.user?.id === gallery.userId;
  const viewerRole: "client" | "photographer" = isPhotographer
    ? "photographer"
    : "client";
  const getViewerDisplayName = (): string => {
    if (isPhotographer) return session?.user?.name ?? gallery.photographer.name;
    if (typeof window !== "undefined") {
      const storedName = sessionStorage.getItem(
        getViewerNameKey(gallery.shareToken),
      );
      if (storedName) return storedName;
    }
    return "Client";
  };
  const viewerDisplayName = getViewerDisplayName();

  // Settings with backwards-compatible defaults
  const settings = gallery.settings;
  const downloadsEnabled = settings?.downloadEnabled !== false;
  const favoritesEnabled = settings?.favoritesEnabled !== false;
  const hasDownloadPin = settings?.hasDownloadPin === true;
  const favoriteNotesEnabled =
    favoritesEnabled && settings?.favoriteNotesEnabled !== false;
  const commentsEnabled = settings?.commentsEnabled === true;
  const slideshowEnabled = settings?.slideshowEnabled !== false;
  const socialSharingEnabled = settings?.socialSharingEnabled !== false;

  // Slideshow state
  const [slideshowActive, setSlideshowActive] = useState(false);
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const slideshowTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopSlideshow = () => {
    setSlideshowActive(false);
    if (slideshowTimerRef.current) {
      clearInterval(slideshowTimerRef.current);
      slideshowTimerRef.current = null;
    }
  };

  const startSlideshow = () => {
    setSlideshowIndex(0);
    setSlideshowActive(true);
  };

  // Share favorites — create shareable link and copy URL
  const [sharingFavorites, setSharingFavorites] = useState(false);

  const handleShareFavorites = async () => {
    const viewerId = sessionStorage.getItem(getViewerIdKey(gallery.shareToken));
    const viewerName =
      sessionStorage.getItem(getViewerNameKey(gallery.shareToken)) || "Guest";
    if (!viewerId) {
      toast.error("Please identify yourself first by favoriting a photo.");
      return;
    }
    setSharingFavorites(true);
    try {
      const res = await fetch(
        `/api/gallery/${encodeURIComponent(gallery.shareToken)}/favorite-share`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ viewerId, viewerName }),
        },
      );
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        toast.error(data?.error || "Failed to create share link");
        return;
      }
      const { favoriteShareToken } = await res.json();
      const url = `${window.location.origin}/favorites/${favoriteShareToken}`;
      await navigator.clipboard.writeText(url);
      toast.success("Favorites link copied to clipboard");
    } catch {
      toast.error("Failed to create share link");
    } finally {
      setSharingFavorites(false);
    }
  };

  // ─── Viewer Account Management ──────────────────────────────────────────────

  const getViewerDisplayInfo = () => {
    const id = sessionStorage.getItem(getViewerIdKey(gallery.shareToken));
    const name = sessionStorage.getItem(getViewerNameKey(gallery.shareToken));
    return { viewerId: id, viewerName: name };
  };

  const handleSignOut = () => {
    sessionStorage.removeItem(getViewerIdKey(gallery.shareToken));
    sessionStorage.removeItem(getViewerNameKey(gallery.shareToken));
    setFavorites([]);
    setFavoriteNotes({});
    setFilterMode("all");
    toast.success("Signed out successfully");
  };

  const handleSaveNameChange = () => {
    const trimmed = editNameValue.trim();
    if (!trimmed) {
      toast.error("Name cannot be empty");
      return;
    }
    sessionStorage.setItem(getViewerNameKey(gallery.shareToken), trimmed);
    setEditNameDialogOpen(false);
    toast.success("Name updated");
  };

  const handleOpenChangeName = () => {
    const current =
      sessionStorage.getItem(getViewerNameKey(gallery.shareToken)) || "";
    setEditNameValue(current);
    setEditNameDialogOpen(true);
  };

  const handleOpenChangePhone = () => {
    setPhoneDialogMode("changePhone");
    setPhoneValue("");
    setNameValue("");
    setPhoneDialogOpen(true);
  };

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

  // Track gallery view (fire-and-forget)
  useEffect(() => {
    fetch(`/api/gallery/${encodeURIComponent(gallery.shareToken)}/view`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gallery.shareToken]);

  useEffect(() => {
    if (favoritesEnabled) {
      // Server-side favorites: load from API only if viewer already identified
      const viewerId = sessionStorage.getItem(
        getViewerIdKey(gallery.shareToken),
      );
      if (!viewerId) {
        // Not identified yet — no favorites to load
        return;
      }
      fetch(
        `/api/gallery/${encodeURIComponent(gallery.shareToken)}/favorites?viewerId=${encodeURIComponent(viewerId)}`,
        { cache: "no-store" },
      )
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.favorites) {
            setFavorites(
              data.favorites.map((f: { photoId: string }) => f.photoId),
            );
            const notes: Record<string, string> = {};
            for (const f of data.favorites as {
              photoId: string;
              note?: string | null;
            }[]) {
              if (f.note) notes[f.photoId] = f.note;
            }
            setFavoriteNotes(notes);
          }
        })
        .catch(() => {
          // Fallback to localStorage on API error
          const raw = localStorage.getItem(getFavoritesKey(gallery.shareToken));
          if (raw) {
            try {
              const parsed = JSON.parse(raw) as string[];
              if (Array.isArray(parsed)) setFavorites(parsed);
            } catch {}
          }
        });
    } else {
      // Favorites disabled server-side: use localStorage
      const raw = localStorage.getItem(getFavoritesKey(gallery.shareToken));
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw) as string[];
        if (Array.isArray(parsed)) setFavorites(parsed);
      } catch {
        localStorage.removeItem(getFavoritesKey(gallery.shareToken));
      }
    }
  }, [gallery.shareToken, favoritesEnabled]);

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
    if (!isUnlocked || !commentsEnabled) {
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
      } catch {
        /* ignore malformed events */
      }
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
  }, [
    isUnlocked,
    commentsEnabled,
    gallery.shareToken,
    galleryJwt,
    sessionToken,
  ]);

  useEffect(() => {
    if (!isUnlocked) {
      return;
    }

    // Presence uses its own anonymous ID, separate from favorites phone identity
    const presenceKey = `fotno_gallery_presence_${gallery.shareToken}`;
    let presenceId = sessionStorage.getItem(presenceKey);
    if (!presenceId) {
      presenceId = crypto.randomUUID();
      sessionStorage.setItem(presenceKey, presenceId);
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
            viewerId: presenceId,
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
        body: JSON.stringify({ viewerId: presenceId }),
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

  const navigateModal = useCallback(
    (direction: 1 | -1) => {
      if (!activePhotoId) {
        return;
      }

      const currentIndex = visiblePhotos.findIndex(
        (photo) => photo.id === activePhotoId,
      );
      if (currentIndex < 0) {
        return;
      }

      const nextIndex = currentIndex + direction;
      if (nextIndex < 0 || nextIndex >= visiblePhotos.length) {
        return;
      }

      const nextId = visiblePhotos[nextIndex]?.id ?? null;
      setActivePhotoId(nextId);
      if (nextId) {
        setCommentPhotoId(nextId);
      }
      setZoom(1);
      setPan({ x: 0, y: 0 });
    },
    [activePhotoId, visiblePhotos],
  );

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
  }, [activePhotoId, navigateModal]);

  // Slideshow auto-advance effect (needs visiblePhotos)
  useEffect(() => {
    if (!slideshowActive) return;
    slideshowTimerRef.current = setInterval(() => {
      setSlideshowIndex((prev) => {
        if (prev >= visiblePhotos.length - 1) {
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
  }, [slideshowActive, visiblePhotos.length]);

  const slideshowPhoto = slideshowActive ? visiblePhotos[slideshowIndex] : null;

  // Slideshow keyboard controls
  useEffect(() => {
    if (!slideshowActive) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        stopSlideshow();
      } else if (event.key === "ArrowRight") {
        setSlideshowIndex((prev) =>
          Math.min(visiblePhotos.length - 1, prev + 1),
        );
      } else if (event.key === "ArrowLeft") {
        setSlideshowIndex((prev) => Math.max(0, prev - 1));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideshowActive, visiblePhotos.length]);

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

  // Preload adjacent images so navigation feels instant
  useEffect(() => {
    if (!activePhotoId) return;

    const currentIndex = visiblePhotos.findIndex((p) => p.id === activePhotoId);
    if (currentIndex < 0) return;

    const adjacentPhotos = [
      visiblePhotos[currentIndex - 1],
      visiblePhotos[currentIndex + 1],
    ].filter((p): p is PublicPhoto => !!p);

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
  }, [activePhotoId, visiblePhotos]);

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

  const downloadLimit = settings?.downloadLimit ?? null;

  const checkDownloadLimit = async (
    type: string,
    photoId?: string,
  ): Promise<boolean> => {
    try {
      const viewerId = sessionStorage.getItem(
        getViewerIdKey(gallery.shareToken),
      );
      const res = await fetch(
        `/api/gallery/${encodeURIComponent(gallery.shareToken)}/download-event`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type,
            photoId: photoId ?? null,
            viewerId: viewerId ?? undefined,
            viewerName: viewerDisplayName,
            checkOnly: true,
          }),
        },
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.limitReached) {
          toast.error("Download limit reached for this photo");
          return false;
        }
      }
      return true;
    } catch {
      return true;
    }
  };

  const trackDownloadEvent = async (
    type: string,
    photoId?: string,
  ): Promise<void> => {
    try {
      const viewerId = sessionStorage.getItem(
        getViewerIdKey(gallery.shareToken),
      );
      await fetch(
        `/api/gallery/${encodeURIComponent(gallery.shareToken)}/download-event`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type,
            photoId: photoId ?? null,
            viewerId: viewerId ?? undefined,
            viewerName: viewerDisplayName,
          }),
        },
      );
    } catch {
      // best-effort tracking
    }
  };

  const requirePin = (onVerified: () => void): boolean => {
    if (!hasDownloadPin || pinVerified) return false;
    pendingDownloadRef.current = onVerified;
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
      const data = await res.json();
      if (data.valid) {
        setPinVerified(true);
        setPinDialogOpen(false);
        pendingDownloadRef.current?.();
        pendingDownloadRef.current = null;
      } else {
        toast.error("Incorrect PIN");
      }
    } catch {
      toast.error("Failed to verify PIN");
    } finally {
      setPinVerifying(false);
    }
  };

  const availableDownloadSizes = useMemo(() => {
    const sizes: { key: string; label: string; variant: string }[] = [];
    const ds = settings?.downloadSizes;
    if (!ds || ds.original)
      sizes.push({ key: "original", label: "Original", variant: "original" });
    if (ds?.highRes)
      sizes.push({
        key: "highRes",
        label: "High Resolution",
        variant: "original",
      });
    if (!ds || ds.web)
      sizes.push({ key: "web", label: "Web Size", variant: "preview" });
    return sizes;
  }, [settings]);

  const downloadPhotoWithVariant = async (
    photo: PublicPhoto,
    variant: string,
  ) => {
    setDownloadingPhotoId(photo.id);
    setSizePickerPhoto(null);
    try {
      // Check limit before downloading
      const allowed = await checkDownloadLimit("single", photo.id);
      if (!allowed) return;

      const response = await fetch(
        `/api/photos/${photo.id}/download?shareToken=${encodeURIComponent(gallery.shareToken)}&fileName=${encodeURIComponent(photo.originalFilename)}&variant=${encodeURIComponent(variant)}${sessionToken ? `&sessionToken=${encodeURIComponent(sessionToken)}` : ""}`,
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

      // Track only after successful download (file fully received)
      void trackDownloadEvent("single", photo.id);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Download failed";
      toast.error(message);
    } finally {
      setDownloadingPhotoId(null);
    }
  };

  const handleSingleDownload = async (photo: PublicPhoto) => {
    const doDownload = async () => {
      if (availableDownloadSizes.length > 1) {
        setSizePickerPhoto(photo);
        return;
      }
      const variant = availableDownloadSizes[0]?.variant ?? "original";
      await downloadPhotoWithVariant(photo, variant);
    };

    // Require phone identity when download limit is set
    if (downloadLimit && !isViewerIdentified() && !isPhotographer) {
      pendingFavoritePhotoIdRef.current = null;
      pendingDownloadActionRef.current = () => {
        if (requirePin(doDownload)) return;
        void doDownload();
      };
      setPhoneDialogMode("retrieve");
      setPhoneValue("");
      setNameValue("");
      setPhoneDialogOpen(true);
      return;
    }

    if (requirePin(doDownload)) return;
    await doDownload();
  };

  const handleDownloadAll = async () => {
    const doDownload = async () => {
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
        void trackDownloadEvent("gallery");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to download ZIP";
        toast.error(message);
      } finally {
        setIsDownloadingAll(false);
      }
    };

    if (requirePin(doDownload)) return;
    await doDownload();
  };

  const saveFavoriteToServer = async (photoId: string, note?: string) => {
    const viewerId =
      sessionStorage.getItem(getViewerIdKey(gallery.shareToken)) ?? "";
    const viewerName =
      sessionStorage.getItem(getViewerNameKey(gallery.shareToken)) ?? "";
    await fetch(
      `/api/gallery/${encodeURIComponent(gallery.shareToken)}/favorites`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          photoId,
          viewerId,
          viewerName,
          note: note || undefined,
        }),
      },
    );
  };

  const removeFavoriteFromServer = async (photoId: string) => {
    const viewerId =
      sessionStorage.getItem(getViewerIdKey(gallery.shareToken)) ?? "";
    await fetch(
      `/api/gallery/${encodeURIComponent(gallery.shareToken)}/favorites/${encodeURIComponent(photoId)}?viewerId=${encodeURIComponent(viewerId)}`,
      { method: "DELETE" },
    );
  };

  const isViewerIdentified = (): boolean => {
    if (isPhotographer) return true;
    return Boolean(sessionStorage.getItem(getViewerIdKey(gallery.shareToken)));
  };

  const requirePhoneIdentity = (photoId: string): boolean => {
    if (isPhotographer || !favoritesEnabled) return false;
    if (isViewerIdentified()) return false;
    pendingFavoritePhotoIdRef.current = photoId;
    setPhoneDialogMode("retrieve");
    setPhoneValue("");
    setNameValue("");
    setRetrieveStep(1);
    setPhoneDialogOpen(true);
    return true;
  };

  const handlePhoneSubmit = async () => {
    if (!phoneValue || phoneValue.length < 8) {
      toast.error("Please enter a valid phone number");
      return;
    }

    // Retrieve mode, step 1: only phone — check if favorites exist first
    if (phoneDialogMode === "retrieve" && retrieveStep === 1) {
      setPhoneSubmitting(true);
      try {
        const res = await fetch(
          `/api/gallery/${encodeURIComponent(gallery.shareToken)}/favorites?viewerId=${encodeURIComponent(phoneValue)}`,
          { cache: "no-store" },
        );
        if (res.ok) {
          const data = await res.json();
          if (data?.favorites?.length > 0) {
            // User exists with favorites in this gallery — sign in and redirect
            sessionStorage.setItem(
              getViewerIdKey(gallery.shareToken),
              phoneValue,
            );
            if (data.viewerName) {
              sessionStorage.setItem(
                getViewerNameKey(gallery.shareToken),
                data.viewerName,
              );
            }
            setFavorites(
              data.favorites.map((f: { photoId: string }) => f.photoId),
            );
            const notes: Record<string, string> = {};
            for (const f of data.favorites as {
              photoId: string;
              note?: string | null;
            }[]) {
              if (f.note) notes[f.photoId] = f.note;
            }
            setFavoriteNotes(notes);

            // If there was a pending action (favorite/download/comment), complete it now
            const pendingPhotoId = pendingFavoritePhotoIdRef.current;
            const pendingDownload = pendingDownloadActionRef.current;
            const pendingComment = pendingCommentActionRef.current;
            pendingFavoritePhotoIdRef.current = null;
            pendingDownloadActionRef.current = null;
            pendingCommentActionRef.current = null;
            if (pendingPhotoId) {
              void toggleFavorite(pendingPhotoId);
            }
            if (pendingDownload) {
              void pendingDownload();
            }
            if (pendingComment) {
              void pendingComment();
            }

            setPhoneDialogOpen(false);
            if (comeFrom === "lovedTab") {
              setFilterMode("loved");
            }
            toast.success("Favorites loaded!");
            return;
          }
          // No favorites in this gallery, but viewer exists in another gallery
          if (data?.viewerName) {
            sessionStorage.setItem(
              getViewerIdKey(gallery.shareToken),
              phoneValue,
            );
            sessionStorage.setItem(
              getViewerNameKey(gallery.shareToken),
              data.viewerName,
            );
            setPhoneDialogOpen(false);
            const pendingComment = pendingCommentActionRef.current;
            pendingCommentActionRef.current = null;
            if (pendingComment) {
              void pendingComment();
            } else {
              toast(
                "No favorites in this gallery yet. Tap the heart on any photo to get started!",
                { icon: "💡" },
              );
            }
            return;
          }
        }
        // Phone number not found anywhere — move to step 2: ask for name
        setRetrieveStep(2);
      } catch {
        toast.error("Something went wrong. Please try again.");
      } finally {
        setPhoneSubmitting(false);
      }
      return;
    }

    // Name is required for identify and retrieve step 2
    if (phoneDialogMode !== "changePhone" && !nameValue.trim()) {
      toast.error("Please enter your name");
      return;
    }

    setPhoneSubmitting(true);
    try {
      // Store phone as viewerId and name
      sessionStorage.setItem(getViewerIdKey(gallery.shareToken), phoneValue);
      if (nameValue.trim()) {
        sessionStorage.setItem(
          getViewerNameKey(gallery.shareToken),
          nameValue.trim(),
        );
      }

      // Load existing favorites for this phone number
      let loadedCount = 0;
      const res = await fetch(
        `/api/gallery/${encodeURIComponent(gallery.shareToken)}/favorites?viewerId=${encodeURIComponent(phoneValue)}`,
        { cache: "no-store" },
      );
      if (res.ok) {
        const data = await res.json();
        if (data?.favorites) {
          loadedCount = data.favorites.length;
          setFavorites(
            data.favorites.map((f: { photoId: string }) => f.photoId),
          );
          const notes: Record<string, string> = {};
          for (const f of data.favorites as {
            photoId: string;
            note?: string | null;
          }[]) {
            if (f.note) notes[f.photoId] = f.note;
          }
          setFavoriteNotes(notes);
        }
      }
      setPhoneDialogOpen(false);

      const hadPendingFavorite = Boolean(pendingFavoritePhotoIdRef.current);
      const hadPendingDownload = Boolean(pendingDownloadActionRef.current);
      const hadPendingComment = Boolean(pendingCommentActionRef.current);

      if (phoneDialogMode === "changePhone") {
        toast.success("Phone number updated");
      } else if (
        !hadPendingFavorite &&
        !hadPendingDownload &&
        !hadPendingComment
      ) {
        // Pure retrieval flow (e.g. from Loved tab) — no pending actions
        toast(
          "No favorites in this gallery yet. Tap the heart on any photo to get started!",
          { icon: "💡" },
        );
      } else {
        // Identification flow — continue with any pending actions
        const pendingPhotoId = pendingFavoritePhotoIdRef.current;
        pendingFavoritePhotoIdRef.current = null;
        if (pendingPhotoId) {
          void toggleFavorite(pendingPhotoId);
        }
        const pendingDownload = pendingDownloadActionRef.current;
        pendingDownloadActionRef.current = null;
        if (pendingDownload) {
          void pendingDownload();
        }
        const pendingComment = pendingCommentActionRef.current;
        pendingCommentActionRef.current = null;
        if (pendingComment) {
          void pendingComment();
        }
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setPhoneSubmitting(false);
    }
  };

  const toggleFavorite = async (photoId: string) => {
    const isRemoving = favorites.includes(photoId);

    // Gate on phone identification for server-side favorites (adding only)
    if (!isRemoving && favoritesEnabled && requirePhoneIdentity(photoId)) {
      return;
    }

    // If adding + notes enabled → show note dialog first
    if (!isRemoving && favoriteNotesEnabled && favoritesEnabled) {
      setNoteDialogPhotoId(photoId);
      setNoteText("");
      return;
    }

    const next = isRemoving
      ? favorites.filter((id) => id !== photoId)
      : [...favorites, photoId];
    setFavorites(next);

    // Clean up note when removing
    const removedNote = isRemoving ? favoriteNotes[photoId] : undefined;
    if (isRemoving && favoriteNotes[photoId]) {
      setFavoriteNotes((prev) => {
        const n = { ...prev };
        delete n[photoId];
        return n;
      });
    }

    if (favoritesEnabled) {
      try {
        if (isRemoving) {
          await removeFavoriteFromServer(photoId);
        } else {
          await saveFavoriteToServer(photoId);
        }
      } catch {
        setFavorites(
          isRemoving ? [...next, photoId] : next.filter((id) => id !== photoId),
        );
        // Restore note on error
        if (isRemoving && removedNote) {
          setFavoriteNotes((prev) => ({ ...prev, [photoId]: removedNote }));
        }
      }
    } else {
      localStorage.setItem(
        getFavoritesKey(gallery.shareToken),
        JSON.stringify(next),
      );
    }
  };

  const submitFavoriteWithNote = async () => {
    if (!noteDialogPhotoId) return;
    const photoId = noteDialogPhotoId;
    const note = noteText.trim();
    setFavorites((prev) => [...prev, photoId]);
    if (note) {
      setFavoriteNotes((prev) => ({ ...prev, [photoId]: note }));
    }
    setNoteDialogPhotoId(null);
    try {
      await saveFavoriteToServer(photoId, note || undefined);
    } catch {
      setFavorites((prev) => prev.filter((id) => id !== photoId));
      if (note) {
        setFavoriteNotes((prev) => {
          const next = { ...prev };
          delete next[photoId];
          return next;
        });
      }
    }
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

  const ZOOM_STEPS = [MIN_ZOOM, 2, MAX_ZOOM];
  const DRAG_THRESHOLD = 5;
  const wasDragRef = useRef(false);

  const handleModalClick = (event: React.MouseEvent<HTMLDivElement>) => {
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

  const applyTransformDirect = useCallback(
    (x: number, y: number) => {
      const img = modalViewportRef.current?.querySelector("img");
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

  const swipeStartRef = useRef<{ x: number; y: number; time: number } | null>(
    null,
  );

  const handleModalTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
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
            navigateModal(deltaX < 0 ? 1 : -1);
          }
        }
      }

      panStartRef.current = null;
      swipeStartRef.current = null;
      setIsDragging(false);
    }
  };

  const handleModalMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
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

  const handleModalMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!panStartRef.current || zoom <= MIN_ZOOM) return;

    const deltaX = event.clientX - panStartRef.current.startX;
    const deltaY = event.clientY - panStartRef.current.startY;
    if (
      Math.abs(deltaX) > DRAG_THRESHOLD ||
      Math.abs(deltaY) > DRAG_THRESHOLD
    ) {
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

  const stopModalMouseDrag = () => {
    if (isDragging) {
      setPan({ ...panRef.current });
    }
    panStartRef.current = null;
    setIsDragging(false);
  };

  const requireCommentIdentity = (): boolean => {
    if (isPhotographer) return false;
    if (isViewerIdentified()) return false;
    pendingCommentActionRef.current = () => void postCommentInner();
    setPhoneDialogMode("retrieve");
    setPhoneValue("");
    setNameValue("");
    setRetrieveStep(1);
    setPhoneDialogOpen(true);
    return true;
  };

  const postCommentInner = async () => {
    const message = commentText.trim();
    if (!message || sendingComment) return;

    setSendingComment(true);
    try {
      const viewerIdKey = getViewerIdKey(gallery.shareToken);
      const viewerId = sessionStorage.getItem(viewerIdKey);
      const authorName = getViewerDisplayName();

      const response = await fetch(
        `/api/gallery/${gallery.shareToken}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            authorName,
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
    } finally {
      setSendingComment(false);
    }
  };

  const postComment = async () => {
    if (requireCommentIdentity()) return;
    await postCommentInner();
  };

  const getViewerId = (): string => {
    const viewerIdKey = getViewerIdKey(gallery.shareToken);
    return sessionStorage.getItem(viewerIdKey) ?? "";
  };

  const editComment = async (comment: GalleryComment, newMessage: string) => {
    const message = newMessage.trim();
    if (!message) return;
    if (!isPhotographer && !isViewerIdentified()) return;

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
    if (!isPhotographer && !isViewerIdentified()) return;

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
    if (!isPhotographer && !isViewerIdentified()) {
      pendingCommentActionRef.current = () => void toggleLike(comment);
      setPhoneDialogMode("retrieve");
      setPhoneValue("");
      setNameValue("");
      setPhoneDialogOpen(true);
      return;
    }

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
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-md transition-colors">
        {/* Top row: Title + Actions */}
        <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-4 px-4 py-3 md:px-8">
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold tracking-tight text-foreground md:text-xl">
              {gallery.title}
            </h1>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground md:text-sm">
              <span>{gallery.photographer.name}</span>
              <span className="text-border">|</span>
              <span>{photoCountLabel}</span>
              <span className="text-border">|</span>
              <span className="inline-flex items-center gap-1">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-40" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary/70" />
                </span>
                {viewerCount} online
              </span>
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {slideshowEnabled && visiblePhotos.length > 1 && (
              <button
                type="button"
                onClick={startSlideshow}
                className="hidden h-9 items-center justify-center gap-1.5 rounded-full border border-border/80 bg-muted px-3 text-sm font-medium text-foreground transition hover:bg-accent sm:inline-flex"
              >
                <Play className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Slideshow</span>
              </button>
            )}
            {socialSharingEnabled &&
              favorites.length > 0 &&
              filterMode === "loved" && (
                <button
                  type="button"
                  onClick={() => void handleShareFavorites()}
                  disabled={sharingFavorites}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-border/80 bg-muted px-3 text-sm font-medium text-foreground transition hover:bg-accent disabled:opacity-50"
                  aria-label="Share favorites"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">
                    {sharingFavorites ? "Creating..." : "Share"}
                  </span>
                </button>
              )}
            {downloadsEnabled && (
              <button
                type="button"
                onClick={handleDownloadAll}
                disabled={isDownloadingAll}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-foreground px-3 text-sm font-medium text-background shadow-sm transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-50 md:px-4"
              >
                <DownloadCloud className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">
                  {isDownloadingAll ? "Preparing..." : "Download"}
                </span>
              </button>
            )}

            {/* Viewer Account Dropdown */}
            {isViewerIdentified() && !isPhotographer && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/80 bg-muted text-foreground transition hover:bg-accent"
                    aria-label="Account"
                  >
                    <User className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm font-medium">
                        {getViewerDisplayInfo().viewerName || "Guest"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {getViewerDisplayInfo().viewerId}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleOpenChangeName}>
                    <Pencil className="h-4 w-4" />
                    Change Name
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleOpenChangePhone}>
                    <Phone className="h-4 w-4" />
                    Change Phone
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Bottom row: Filter tabs */}
        <div className="mx-auto w-full max-w-[1500px] px-4 pb-2 md:px-8">
          <div className="-mx-1 flex items-center gap-1 overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setFilterMode("all")}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all ${
                filterMode === "all"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              All Photos
            </button>
            {favoritesEnabled && (
              <button
                type="button"
                onClick={() => {
                  if (!isViewerIdentified() && !isPhotographer) {
                    setPhoneDialogMode("retrieve");
                    setRetrieveStep(1);
                    setPhoneValue("");
                    setNameValue("");
                    setPhoneDialogOpen(true);
                    setComeFrom("lovedTab");
                    return;
                  }
                  setFilterMode("loved");
                }}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all ${
                  filterMode === "loved"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <Heart
                  className={`h-3.5 w-3.5 ${filterMode === "loved" ? "fill-primary-foreground text-primary-foreground" : "text-muted-foreground"}`}
                />
                {favorites.length > 0 ? `${favorites.length} Loved` : "Loved"}
              </button>
            )}
            {gallery.albums?.map((album) => (
              <button
                key={album.id}
                type="button"
                onClick={() => setFilterMode(album.id)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all ${
                  filterMode === album.id
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {album.title}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-[1500px] gap-6 px-4 py-6 md:px-8 md:py-10">
        <section className="min-w-0">
          {filterMode === "loved" && visiblePhotos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Heart className="mb-3 h-10 w-10 text-muted-foreground/30" />
              <p className="text-lg font-medium text-foreground">
                No favorites yet
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Tap the heart icon on any photo to get started.
              </p>
            </div>
          ) : (
            <div className="columns-1 gap-3 space-y-3 min-[400px]:columns-2 md:columns-3 md:gap-4 md:space-y-4">
              {visiblePhotos.map((photo, index) => {
                const imageSrc = withOptionalToken(photo.thumbnailSrc);
                const loved = favorites.includes(photo.id);
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
                        setZoom(1);
                        setPan({ x: 0, y: 0 });
                        setCommentPhotoId(photo.id);
                      }}
                      className="block w-full"
                    >
                      <img
                        src={imageSrc}
                        alt={photo.originalFilename}
                        width={w}
                        height={h}
                        loading={index < 8 ? "eager" : "lazy"}
                        decoding="async"
                        draggable={false}
                        onContextMenu={(event) => event.preventDefault()}
                        onError={(e) => {
                          const img = e.currentTarget;
                          const attempt = Number(img.dataset.retry ?? "0");
                          if (attempt < 2) {
                            img.dataset.retry = String(attempt + 1);
                            setTimeout(
                              () => {
                                img.src = imageSrc;
                              },
                              1000 * (attempt + 1),
                            );
                          }
                        }}
                        className="h-auto w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                      />
                    </button>

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                    {favoritesEnabled && (
                      <button
                        type="button"
                        onClick={() => {
                          toggleFavorite(photo.id);
                          setComeFrom("lovePhoto");
                        }}
                        className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur transition hover:bg-black/70"
                        aria-label={
                          loved ? "Remove from loved" : "Add to loved"
                        }
                      >
                        <Heart
                          className={`h-4 w-4 transition-colors ${
                            loved ? "fill-primary text-primary" : "text-white"
                          }`}
                        />
                      </button>
                    )}

                    {loved && favoriteNotes[photo.id] && (
                      <div className="absolute left-3 bottom-3 max-w-[calc(100%-4rem)] pointer-events-none">
                        <span className="inline-block truncate rounded-full bg-black/60 px-2.5 py-1 text-[11px] text-white/90 backdrop-blur">
                          &ldquo;{favoriteNotes[photo.id]}&rdquo;
                        </span>
                      </div>
                    )}

                    {downloadsEnabled && (
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
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {activePhoto ? (
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
                visiblePhotos.findIndex((p) => p.id === activePhotoId) <= 0
              }
              className="mr-3 hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-white/20 active:scale-95 disabled:pointer-events-none disabled:opacity-0 md:inline-flex"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div
              ref={modalViewportRef}
              className={`relative flex h-full max-h-[85vh] w-full max-w-6xl items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/60 ${
                zoom >= MAX_ZOOM
                  ? isDragging
                    ? "cursor-grabbing"
                    : "cursor-zoom-out"
                  : isDragging
                    ? "cursor-grabbing"
                    : "cursor-zoom-in"
              }`}
              onClick={handleModalClick}
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
                alt={activePhoto.originalFilename}
                width={activePhoto.width ?? 1600}
                height={activePhoto.height ?? 1200}
                sizes="90vw"
                draggable={false}
                className="max-h-[85vh] w-auto object-contain"
                style={{
                  transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
                  transformOrigin: "center center",
                  transition: isDragging ? "none" : "transform 150ms ease-out",
                  willChange: "transform",
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
              disabled={
                !activePhotoId ||
                visiblePhotos.findIndex((p) => p.id === activePhotoId) >=
                  visiblePhotos.length - 1
              }
              className="ml-3 hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-white/20 active:scale-95 disabled:pointer-events-none disabled:opacity-0 md:inline-flex"
              aria-label="Next photo"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Favorite note in modal */}
          {favorites.includes(activePhoto.id) &&
            favoriteNotes[activePhoto.id] && (
              <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-black/70 px-4 py-2 text-sm text-white/90 backdrop-blur">
                  <Heart className="h-3.5 w-3.5 fill-primary text-primary" />
                  &ldquo;{favoriteNotes[activePhoto.id]}&rdquo;
                </span>
              </div>
            )}
        </div>
      ) : null}

      {/* Slideshow Overlay */}
      {slideshowActive && slideshowPhoto && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black">
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              key={slideshowPhoto.id}
              src={withOptionalToken(slideshowPhoto.previewSrc)}
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

          {/* Slideshow controls */}
          <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3">
            <button
              type="button"
              onClick={() => setSlideshowIndex((prev) => Math.max(0, prev - 1))}
              disabled={slideshowIndex === 0}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/60 text-white transition hover:bg-black/80 disabled:opacity-30"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={stopSlideshow}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/60 text-white transition hover:bg-black/80"
              aria-label="Pause slideshow"
            >
              <Pause className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() =>
                setSlideshowIndex((prev) =>
                  Math.min(visiblePhotos.length - 1, prev + 1),
                )
              }
              disabled={slideshowIndex >= visiblePhotos.length - 1}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/60 text-white transition hover:bg-black/80 disabled:opacity-30"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={stopSlideshow}
            className="absolute right-6 top-6 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/60 text-white transition hover:bg-black/80"
            aria-label="Close slideshow"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
            <div
              className="h-full bg-white/60 transition-all duration-300"
              style={{
                width: `${((slideshowIndex + 1) / visiblePhotos.length) * 100}%`,
              }}
            />
          </div>

          {/* Counter */}
          <div className="absolute left-6 top-6 z-10 rounded-full bg-black/60 px-3 py-1.5 text-sm text-white/80">
            {slideshowIndex + 1} / {visiblePhotos.length}
          </div>
        </div>
      )}

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
              <InputOTPGroup className="">
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

      {/* Favorite Note Dialog */}
      <Dialog
        open={noteDialogPhotoId !== null}
        onOpenChange={(open) => {
          if (!open) setNoteDialogPhotoId(null);
        }}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="h-4 w-4 fill-primary text-primary" />
              Add to Favorites
            </DialogTitle>
            <DialogDescription>
              Add an optional note for the photographer (e.g. &ldquo;print
              this&rdquo; or &ldquo;use as album cover&rdquo;).
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Input
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Optional note..."
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  void submitFavoriteWithNote();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNoteDialogPhotoId(null)}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setNoteText("");
                void submitFavoriteWithNote();
              }}
            >
              Skip Note
            </Button>
            <Button onClick={() => void submitFavoriteWithNote()}>
              <Heart className="mr-1.5 h-3.5 w-3.5 fill-current" />
              Favorite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                    void downloadPhotoWithVariant(
                      sizePickerPhoto,
                      size.variant,
                    );
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

      {/* Phone Identity Dialog */}
      <Dialog open={phoneDialogOpen} onOpenChange={setPhoneDialogOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {phoneDialogMode === "changePhone" ? (
                <>
                  <Phone className="h-4 w-4 text-primary" />
                  Change Phone Number
                </>
              ) : (
                <>
                  <Heart className="h-4 w-4 fill-primary text-primary" />
                  {phoneDialogMode === "retrieve" && comeFrom === "lovedTab"
                    ? "View Your Favorites"
                    : "Save Your Favorites"}
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {phoneDialogMode === "changePhone"
                ? "Enter your new phone number. Your favorites will be transferred."
                : phoneDialogMode === "retrieve" &&
                    retrieveStep === 1 &&
                    comeFrom === "lovedTab"
                  ? "Enter your phone number to retrieve your saved favorites."
                  : phoneDialogMode === "retrieve" &&
                      retrieveStep === 2 &&
                      comeFrom === "lovedTab"
                    ? "We didn't find favorites for this number in this gallery. Enter your name to get started."
                    : "Enter your phone number to save favorites. You can revisit them anytime, share with your photographer, family and friends"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Phone: shown in step 1 of retrieve, or always for identify/changePhone */}
            {!(phoneDialogMode === "retrieve" && retrieveStep === 2) && (
              <PhoneInputComponent
                value={phoneValue}
                onChange={setPhoneValue}
                label="Phone number"
                placeholder="Enter your phone number"
              />
            )}
            {/* Name: shown for identify mode, and retrieve step 2 */}
            {phoneDialogMode === "retrieve" && retrieveStep === 2 && (
              <div className="space-y-1.5">
                <label htmlFor="viewer-name" className="text-sm font-medium">
                  Name <span className="text-destructive">*</span>
                </label>
                <Input
                  id="viewer-name"
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  placeholder="Your name"
                  autoFocus={
                    phoneDialogMode === "retrieve" && retrieveStep === 2
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && nameValue.trim()) {
                      void handlePhoneSubmit();
                    }
                  }}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setPhoneDialogOpen(false);
                pendingFavoritePhotoIdRef.current = null;
                pendingCommentActionRef.current = null;
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => void handlePhoneSubmit()}
              disabled={
                phoneSubmitting ||
                (phoneDialogMode === "retrieve" && retrieveStep === 2
                  ? !nameValue.trim()
                  : !phoneValue ||
                    phoneValue.length < 8 ||
                    (phoneDialogMode === "retrieve" &&
                      retrieveStep === 2 &&
                      !nameValue.trim()))
              }
            >
              {phoneSubmitting
                ? "Loading..."
                : phoneDialogMode === "changePhone"
                  ? "Update Phone"
                  : phoneDialogMode === "retrieve" &&
                      retrieveStep === 1 &&
                      comeFrom === "lovedTab"
                    ? "Load Favorites"
                    : "Continue"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Name Dialog */}
      <Dialog open={editNameDialogOpen} onOpenChange={setEditNameDialogOpen}>
        <DialogContent className="sm:max-w-[380px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-4 w-4 text-primary" />
              Change Name
            </DialogTitle>
            <DialogDescription>Update your display name.</DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Input
              value={editNameValue}
              onChange={(e) => setEditNameValue(e.target.value)}
              placeholder="Your name"
              onKeyDown={(e) => {
                if (e.key === "Enter" && editNameValue.trim()) {
                  handleSaveNameChange();
                }
              }}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditNameDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveNameChange}
              disabled={!editNameValue.trim()}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <footer className="border-t border-border/70 px-4 py-6 text-center text-sm text-muted-foreground md:px-8 flex items-center justify-center">
        Powered by <Logo size="xs" />
      </footer>

      {/* Create Album Button */}
      {gallery.settings?.smartAlbumsEnabled && (
        <Link href={`/${encodeURIComponent(gallery.shareToken)}/album`}>
          <Button className="fixed right-5 bottom-20 z-40 gap-2 shadow-lg">
            <Album className="h-4 w-4" />
            Create Album
          </Button>
        </Link>
      )}

      {commentsEnabled && (
        <Sheet
          open={commentsSheetOpen}
          onOpenChange={(open) => {
            if (open && !isPhotographer && !isViewerIdentified()) {
              pendingCommentActionRef.current = () =>
                setCommentsSheetOpen(true);
              setPhoneDialogMode("retrieve");
              setPhoneValue("");
              setNameValue("");
              setPhoneDialogOpen(true);
              return;
            }
            setCommentsSheetOpen(open);
          }}
        >
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
                {viewerRole === "photographer"
                  ? "Gallery Feedback"
                  : "Leave Feedback"}
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
                          title={`Image #${index + 1}`}
                          className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                            selected
                              ? "border-primary ring-2 ring-primary/30"
                              : "border-border hover:border-foreground/30"
                          }`}
                        >
                          <Image
                            src={withOptionalToken(photo.thumbnailSrc)}
                            alt={`Image #${index + 1}`}
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
                  disabled={!commentText.trim() || sendingComment}
                  className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
                >
                  {sendingComment
                    ? "Sending..."
                    : replyingTo
                      ? "Send Reply"
                      : "Send Comment"}
                </button>
              </div>

              {/* ── Comments list ── */}
              <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
                {comments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <MessageSquare className="mb-2 h-8 w-8 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground">
                      No comments yet.
                    </p>
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
      )}
    </div>
  );
}
