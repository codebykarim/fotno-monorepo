"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import useSWR, { mutate as mutateCache } from "swr";
import { useDropzone } from "react-dropzone";
import { QRCodeSVG } from "qrcode.react";
import {
  AlertTriangle,
  CalendarDays,
  Check,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  FolderPlus,
  Grid2x2,
  Images,
  Link2,
  Lock,
  LockOpen,
  MoreHorizontal,
  QrCode,
  Settings2,
  Share2,
  Star,
  Trash2,
  UploadCloud,
  Loader2,
  FolderKanban,
  Album,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Progress } from "@workspace/ui/components/progress";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Switch } from "@workspace/ui/components/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@workspace/ui/components/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { apiRequest, jsonFetcher } from "@/lib/api/client";
import { GetGalleryResponse } from "@/lib/types/api";
import {
  useGalleryUiStore,
  type UploadQueueItem,
} from "@/lib/stores/gallery-ui-store";
import { cn } from "@workspace/ui/lib/utils";

const tabs = ["photos", "albums", "settings", "share"] as const;
type Tab = (typeof tabs)[number];

const TAB_META: Record<Tab, { label: string; icon: typeof Images }> = {
  photos: { label: "Photos", icon: Grid2x2 },
  albums: { label: "Albums", icon: Album },
  settings: { label: "Settings", icon: Settings2 },
  share: { label: "Share", icon: Share2 },
};

type Props = {
  galleryId: string;
  initialTab?: Tab;
};

const EMPTY_SELECTION: string[] = [];
const MAX_CONCURRENT_FILES = 4;
const MAX_CONCURRENT_CHUNKS = 3;
const DEFAULT_CHUNK_SIZE_BYTES = 10 * 1024 * 1024;

function getUploadQueueStorageKey(galleryId: string): string {
  return `fotno:upload-queue:${galleryId}`;
}

function isAbortError(error: unknown): boolean {
  if (error instanceof DOMException && error.name === "AbortError") {
    return true;
  }
  if (error instanceof Error) {
    if (error.name === "AbortError") return true;
    return error.message.toLowerCase().includes("aborted");
  }
  return false;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "\u2014";
  try {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function GalleryDetailContent({
  galleryId,
  initialTab = "photos",
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [publishSaving, setPublishSaving] = useState(false);
  const [passwordEnabled, setPasswordEnabled] = useState(false);
  const [passwordEditing, setPasswordEditing] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const { data, mutate, isLoading } = useSWR<GetGalleryResponse>(
    `/api/galleries/${galleryId}`,
    jsonFetcher,
    { revalidateOnFocus: false },
  );

  useEffect(() => {
    if (data) {
      setPasswordEnabled(data.gallery.passwordEnabled);
      setPassword(data.gallery.password ?? "");
    }
  }, [data]);

  const togglePublish = async () => {
    if (!data) return;
    setPublishSaving(true);
    try {
      await apiRequest(`/api/galleries/${galleryId}`, {
        method: "PATCH",
        body: JSON.stringify({ isPublished: !data.gallery.isPublished }),
      });
      await mutate();
      toast.success(data.gallery.isPublished ? "Gallery unpublished" : "Gallery published");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update");
    } finally {
      setPublishSaving(false);
    }
  };

  const savePassword = async (enabled: boolean, pw: string) => {
    setPasswordSaving(true);
    try {
      await apiRequest(`/api/galleries/${galleryId}`, {
        method: "PATCH",
        body: JSON.stringify({ passwordEnabled: enabled, password: pw }),
      });
      await mutate();
      toast.success(enabled ? "Password protection enabled" : "Password protection disabled");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update password");
    } finally {
      setPasswordSaving(false);
    }
  };

  if (isLoading || !data) {
    return (
      <div className="space-y-5">
        <div className="space-y-3">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="flex gap-6 border-b border-border pb-px">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-16" />
          ))}
        </div>
        <div className="columns-2 gap-4 md:columns-3 xl:columns-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton
              key={i}
              className={`mb-4 w-full rounded-xl ${i % 2 === 0 ? "h-[280px]" : "h-[200px]"}`}
            />
          ))}
        </div>
      </div>
    );
  }

  const shareLink = getGalleryShareLink(data.gallery.slug);

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <section className="space-y-3">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="dashboard-title text-2xl font-semibold tracking-tight truncate">
              {data.gallery.title}
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              /{data.gallery.slug}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Publish toggle */}
            <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5">
              <Switch
                checked={data.gallery.isPublished}
                onCheckedChange={togglePublish}
                disabled={publishSaving}
              />
              <span className={cn(
                "text-xs font-medium",
                data.gallery.isPublished ? "text-emerald-600" : "text-muted-foreground",
              )}>
                {data.gallery.isPublished ? "Published" : "Draft"}
              </span>
            </div>

            {/* Password popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5"
                  title={passwordEnabled ? "Password protected" : "No password"}
                >
                  {passwordEnabled ? (
                    <Lock className="h-3.5 w-3.5 text-primary" />
                  ) : (
                    <LockOpen className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-72 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Password</p>
                    <p className="text-xs text-muted-foreground">
                      {passwordEnabled ? "Gallery is password protected" : "Protect this gallery"}
                    </p>
                  </div>
                  <Switch
                    checked={passwordEnabled || passwordEditing}
                    disabled={passwordSaving}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setPasswordEditing(true);
                        setPassword("");
                      } else {
                        setPasswordEditing(false);
                        setPasswordEnabled(false);
                        void savePassword(false, "");
                      }
                    }}
                  />
                </div>
                {(passwordEnabled || passwordEditing) && (
                  <div className="space-y-2">
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={passwordEnabled ? "Change password" : "Enter a password"}
                        className="pr-10 text-sm"
                        autoFocus={passwordEditing && !passwordEnabled}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                    <Button
                      size="sm"
                      className="w-full"
                      disabled={passwordSaving || !password.trim()}
                      onClick={() => {
                        void savePassword(true, password).then(() => setPasswordEditing(false));
                      }}
                    >
                      {passwordSaving ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : null}
                      {passwordEnabled ? "Update password" : "Enable password"}
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>

            {/* Preview */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5"
              disabled={!data.gallery.isPublished}
              asChild
            >
              <a
                href={getGalleryShareLink(data.gallery.slug)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="hidden sm:inline text-xs">Preview</span>
              </a>
            </Button>

            {/* Copy link */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5"
              disabled={!data.gallery.isPublished}
              onClick={() => {
                navigator.clipboard.writeText(shareLink);
                toast.success("Share link copied");
              }}
            >
              <Link2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline text-xs">Copy link</span>
            </Button>

            {/* QR popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8"
                  disabled={!data.gallery.isPublished}
                >
                  <QrCode className="h-3.5 w-3.5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-auto p-4">
                <div className="space-y-3">
                  <p className="text-sm font-medium">Gallery QR Code</p>
                  <div className="flex items-center justify-center rounded-lg border bg-white p-3">
                    <QRCodeSVG
                      value={shareLink}
                      size={180}
                      level="H"
                      includeMargin={false}
                      bgColor="#ffffff"
                      fgColor="#0f172a"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      const svg = document.querySelector("#qr-popover-svg svg");
                      if (!svg) return;
                      const source = new XMLSerializer().serializeToString(svg);
                      const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement("a");
                      link.href = url;
                      link.download = `${data.gallery.slug}-qr.svg`;
                      link.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    Download SVG
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Stats pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-1">
            <Images className="h-3 w-3" />
            {data.gallery.photos.length} photo{data.gallery.photos.length !== 1 ? "s" : ""}
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-1">
            <FolderKanban className="h-3 w-3" />
            {data.gallery.albums.length} album{data.gallery.albums.length !== 1 ? "s" : ""}
          </span>
          {data.gallery.eventDate && (
            <span className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-1">
              <CalendarDays className="h-3 w-3" />
              {formatDate(data.gallery.eventDate)}
            </span>
          )}
          {data.gallery.deadline && (
            <span className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-1">
              Event deadline {formatDate(data.gallery.deadline)}
            </span>
          )}
        </div>
      </section>

      {/* ── Tabs ── */}
      <div className="flex gap-1 border-b border-border">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          const Icon = TAB_META[tab].icon;
          return (
            <button
              type="button"
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {TAB_META[tab].label}
              {isActive && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Tab content ── */}
      {activeTab === "photos" && (
        <PhotosTab galleryId={galleryId} mutate={mutate} photos={data.gallery.photos} />
      )}
      {activeTab === "albums" && (
        <AlbumsTab
          galleryId={galleryId}
          albums={data.gallery.albums}
          photos={data.gallery.photos}
          mutate={mutate}
        />
      )}
      {activeTab === "settings" && (
        <SettingsTab galleryId={galleryId} mutate={mutate} data={data} />
      )}
      {activeTab === "share" && (
        <ShareTab data={data} galleryId={galleryId} />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Helper
   ═══════════════════════════════════════════════════════════════════ */

function getGalleryShareLink(slug: string) {
  const configuredGalleryUrl = process.env.NEXT_PUBLIC_GALLERY_URL?.replace(/\/$/, "");
  const buildShareUrl = (baseUrl: string) => `${baseUrl.replace(/\/$/, "")}/${slug}`;

  const mapLocalhostToCurrentHost = (urlString: string): string => {
    if (typeof window === "undefined") return urlString;
    try {
      const parsed = new URL(urlString);
      if (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") {
        parsed.hostname = window.location.hostname;
      }
      return parsed.toString().replace(/\/$/, "");
    } catch {
      return urlString;
    }
  };

  if (configuredGalleryUrl) return buildShareUrl(mapLocalhostToCurrentHost(configuredGalleryUrl));
  if (typeof window === "undefined") return buildShareUrl("http://localhost:3003");

  const inferredBaseUrl =
    window.location.port === "3001"
      ? `${window.location.protocol}//${window.location.hostname}:3003`
      : window.location.origin;

  return buildShareUrl(inferredBaseUrl);
}

/* ═══════════════════════════════════════════════════════════════════
   Photos Tab
   ═══════════════════════════════════════════════════════════════════ */

type PhotosTabProps = {
  galleryId: string;
  photos: GetGalleryResponse["gallery"]["photos"];
  mutate: () => Promise<GetGalleryResponse | undefined>;
};

function PhotosTab({ galleryId, photos, mutate }: PhotosTabProps) {
  const selected = useGalleryUiStore(
    (state) => state.selectedByGallery[galleryId] ?? EMPTY_SELECTION,
  );
  const toggleSelected = useGalleryUiStore((state) => state.toggleSelected);
  const clearSelected = useGalleryUiStore((state) => state.clearSelected);
  const setSelected = useGalleryUiStore((state) => state.setSelected);
  const uploadQueue = useGalleryUiStore((state) => state.uploadQueue);
  const upsertQueueItem = useGalleryUiStore((state) => state.upsertQueueItem);
  const removeQueueItem = useGalleryUiStore((state) => state.removeQueueItem);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const uploadQueueRef = useRef<UploadQueueItem[]>([]);
  const activeUploadControllersRef = useRef<Set<AbortController>>(new Set());
  const fileByQueueIdRef = useRef<Map<string, File>>(new Map());
  const [createAlbumOpen, setCreateAlbumOpen] = useState(false);
  const [newAlbumTitle, setNewAlbumTitle] = useState("");
  const [photoToDelete, setPhotoToDelete] = useState<string | null>(null);
  const [deleteSelectedOpen, setDeleteSelectedOpen] = useState(false);

  const galleryUploadQueue = useMemo(
    () => uploadQueue.filter((item) => item.galleryId === galleryId),
    [galleryId, uploadQueue],
  );

  const hasRunningUploads = useMemo(
    () =>
      galleryUploadQueue.some(
        (item) =>
          item.status === "queued" ||
          item.status === "uploading" ||
          item.status === "confirming",
      ),
    [galleryUploadQueue],
  );
  const pausedUploads = useMemo(
    () => galleryUploadQueue.filter((item) => item.status === "paused"),
    [galleryUploadQueue],
  );
  const failedUploads = useMemo(
    () => galleryUploadQueue.filter((item) => item.status === "error"),
    [galleryUploadQueue],
  );

  useEffect(() => {
    uploadQueueRef.current = galleryUploadQueue;
  }, [galleryUploadQueue]);

  useEffect(() => {
    const preventBrowserFileOpen = (event: DragEvent) => {
      event.preventDefault();
    };
    window.addEventListener("dragover", preventBrowserFileOpen);
    window.addEventListener("drop", preventBrowserFileOpen);
    return () => {
      window.removeEventListener("dragover", preventBrowserFileOpen);
      window.removeEventListener("drop", preventBrowserFileOpen);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const persistedRaw = window.localStorage.getItem(getUploadQueueStorageKey(galleryId));
    if (!persistedRaw) return;
    try {
      const parsed = JSON.parse(persistedRaw);
      if (!Array.isArray(parsed)) return;
      for (const item of parsed) {
        if (typeof item !== "object" || item === null) continue;
        const candidate = item as Partial<UploadQueueItem>;
        if (
          typeof candidate.id !== "string" ||
          typeof candidate.fileName !== "string" ||
          typeof candidate.progress !== "number" ||
          typeof candidate.status !== "string"
        ) continue;
        const normalizedStatus =
          candidate.status === "queued" || candidate.status === "uploading" ||
          candidate.status === "confirming" || candidate.status === "paused" ||
          candidate.status === "done" || candidate.status === "error"
            ? candidate.status
            : "paused";
        upsertQueueItem({
          id: candidate.id,
          galleryId,
          fileName: candidate.fileName,
          progress: Math.max(0, Math.min(100, candidate.progress)),
          status: normalizedStatus,
          photoId: candidate.photoId,
          errorMessage: candidate.errorMessage,
        });
      }
    } catch { /* ignore malformed data */ }
  }, [galleryId, upsertQueueItem]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const serializableQueue = galleryUploadQueue.filter(
      (item) => item.status !== "done",
    );
    window.localStorage.setItem(
      getUploadQueueStorageKey(galleryId),
      JSON.stringify(serializableQueue),
    );
  }, [galleryId, galleryUploadQueue]);

  const markInFlightUploadsAsPaused = (reason?: string) => {
    for (const item of uploadQueueRef.current) {
      if (item.status === "queued" || item.status === "uploading" || item.status === "confirming") {
        upsertQueueItem({ ...item, status: "paused", errorMessage: reason });
      }
    }
  };

  const abortAllActiveRequests = () => {
    for (const controller of activeUploadControllersRef.current) {
      controller.abort();
    }
    activeUploadControllersRef.current.clear();
  };

  const pauseAllUploads = (reason?: string) => {
    markInFlightUploadsAsPaused(reason ?? "Paused");
    abortAllActiveRequests();
  };

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      const hasInFlight = uploadQueueRef.current.some(
        (item) => item.status === "queued" || item.status === "uploading" || item.status === "confirming",
      );
      if (!hasInFlight) return;
      pauseAllUploads("Paused because you left the page");
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      pauseAllUploads("Paused because you left the page");
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    type ResumeSession = {
      photoId: string; filename: string; mimeType: string; checksum?: string | null;
      totalSize?: string; totalParts: number;
      completedParts: Array<{ partNumber: number; etag: string }>;
      presignedParts: Array<{ partNumber: number; url: string }>;
    };
    const syncRemoteSessions = async () => {
      try {
        const response = await apiRequest<{ sessions?: ResumeSession[] }>(
          `/api/galleries/${galleryId}/photos/session`,
          { method: "GET" },
        );
        if (cancelled) return;
        const sessions = Array.isArray(response.sessions) ? response.sessions : [];
        for (const session of sessions) {
          const progress = 20 + Math.floor(((session.completedParts.length || 0) / Math.max(1, session.totalParts || 1)) * 65);
          const existing = uploadQueueRef.current.find((item) => item.photoId === session.photoId);
          upsertQueueItem({
            id: existing?.id ?? `session-${session.photoId}`,
            galleryId,
            fileName: session.filename,
            progress: Math.min(85, Math.max(5, progress)),
            status: "paused",
            photoId: session.photoId,
            errorMessage: "Paused. Select files to resume.",
          });
        }
      } catch { /* optional enhancement */ }
    };
    void syncRemoteSessions();
    return () => { cancelled = true; };
  }, [galleryId, upsertQueueItem]);

  const computeFileChecksum = async (file: File): Promise<string> => {
    const sample = file.slice(0, 1024 * 1024);
    const buffer = await sample.arrayBuffer();
    const digest = await crypto.subtle.digest("SHA-256", buffer);
    return Array.from(new Uint8Array(digest)).map((v) => v.toString(16).padStart(2, "0")).join("");
  };

  async function uploadFiles(files: File[]) {
    if (files.length === 0) return;

    type PresignResponse = {
      photoId: string; totalParts: number; chunkSizeBytes: number; duplicate: boolean;
      presignedParts: Array<{ partNumber: number; url: string }>;
      partCompleteUrl: string; confirmUrl: string;
    };
    type ResumeSession = {
      photoId: string; filename: string; mimeType: string; checksum?: string | null;
      totalSize?: string; totalParts: number;
      completedParts: Array<{ partNumber: number; etag: string }>;
      presignedParts: Array<{ partNumber: number; url: string }>;
    };

    const withAbortSignal = async <T,>(task: (signal: AbortSignal) => Promise<T>): Promise<T> => {
      const controller = new AbortController();
      activeUploadControllersRef.current.add(controller);
      try { return await task(controller.signal); }
      finally { activeUploadControllersRef.current.delete(controller); }
    };

    const clearStaleQueueForPhotoId = (photoId: string, keepId?: string) => {
      for (const item of uploadQueueRef.current) {
        if (item.photoId === photoId && item.id !== keepId) {
          removeQueueItem(item.id);
          fileByQueueIdRef.current.delete(item.id);
        }
      }
    };

    const queuedFiles = files.map((file, index) => ({
      file,
      tempId: `upload-${Date.now()}-${index}-${file.name}`,
    }));

    for (const item of queuedFiles) {
      fileByQueueIdRef.current.set(item.tempId, item.file);
      upsertQueueItem({ id: item.tempId, galleryId, fileName: item.file.name, progress: 5, status: "queued" });
    }

    let resumableSessions: ResumeSession[] = [];
    try {
      const response = await withAbortSignal((signal) =>
        apiRequest<{ sessions?: ResumeSession[] }>(`/api/galleries/${galleryId}/photos/session`, { method: "GET", signal }),
      );
      resumableSessions = Array.isArray(response.sessions) ? response.sessions : [];
    } catch (error) {
      if (isAbortError(error)) { markInFlightUploadsAsPaused("Paused"); return; }
      resumableSessions = [];
    }

    const claimResumeSession = (file: File, checksum: string): ResumeSession | undefined => {
      const indexByChecksum = resumableSessions.findIndex((s) => {
        if (!s.checksum) return false;
        return s.checksum === checksum && Number(s.totalSize ?? 0) === file.size;
      });
      if (indexByChecksum >= 0) return resumableSessions.splice(indexByChecksum, 1)[0];
      const indexByName = resumableSessions.findIndex((s) =>
        s.filename === file.name && s.mimeType === file.type && Number(s.totalSize ?? 0) === file.size,
      );
      if (indexByName >= 0) return resumableSessions.splice(indexByName, 1)[0];
      return undefined;
    };

    const uploadSingleFile = async (file: File, tempId: string): Promise<void> => {
      try {
        const checksum = await computeFileChecksum(file);
        const resumeSession = claimResumeSession(file, checksum);
        let presigned: PresignResponse;
        let alreadyCompletedParts = 0;

        if (resumeSession) {
          alreadyCompletedParts = resumeSession.completedParts.length;
          clearStaleQueueForPhotoId(resumeSession.photoId, tempId);
          presigned = {
            photoId: resumeSession.photoId, totalParts: resumeSession.totalParts,
            chunkSizeBytes: DEFAULT_CHUNK_SIZE_BYTES, duplicate: false,
            presignedParts: resumeSession.presignedParts,
            partCompleteUrl: `/api/galleries/${galleryId}/photos/part-complete`,
            confirmUrl: `/api/galleries/${galleryId}/photos/confirm`,
          };
        } else {
          presigned = await withAbortSignal((signal) =>
            apiRequest<PresignResponse>(`/api/galleries/${galleryId}/photos/presign`, {
              method: "POST",
              body: JSON.stringify({ fileName: file.name, fileType: file.type, size: file.size, checksum }),
              signal,
            }),
          );
        }

        if (presigned.duplicate) {
          upsertQueueItem({ id: tempId, galleryId, fileName: file.name, progress: 100, status: "done", photoId: presigned.photoId });
          fileByQueueIdRef.current.delete(tempId);
          return;
        }

        clearStaleQueueForPhotoId(presigned.photoId, tempId);
        const chunkSizeBytes = Number(presigned.chunkSizeBytes) > 0 ? Number(presigned.chunkSizeBytes) : DEFAULT_CHUNK_SIZE_BYTES;
        const parts = presigned.presignedParts.slice().sort((a, b) => a.partNumber - b.partNumber);
        const totalParts = Math.max(Number(presigned.totalParts ?? 0), parts.length);
        if (totalParts <= 0) throw new Error("No upload parts were returned for this file");

        let completedPartsCount = alreadyCompletedParts;
        const updateUploadProgress = () => {
          const progress = 20 + Math.floor((Math.min(completedPartsCount, totalParts) / totalParts) * 65);
          upsertQueueItem({
            id: tempId, galleryId, fileName: file.name,
            progress: Math.min(85, progress), status: "uploading",
            photoId: presigned.photoId, errorMessage: undefined,
          });
        };
        updateUploadProgress();

        const partCompleteUrl = presigned.partCompleteUrl ?? `/api/galleries/${galleryId}/photos/part-complete`;

        const uploadPart = async (partNumber: number, url: string): Promise<void> => {
          const start = (partNumber - 1) * chunkSizeBytes;
          if (start >= file.size) throw new Error(`Invalid partNumber ${partNumber} for file ${file.name}`);
          const end = Math.min(start + chunkSizeBytes, file.size);
          const chunk = file.slice(start, end);
          const uploadResponse = await withAbortSignal((signal) =>
            fetch(url, {
              method: "PUT", body: chunk,
              headers: { "Content-Type": file.type || "application/octet-stream" },
              signal,
            }),
          );
          if (!uploadResponse.ok) throw new Error(`Upload failed with status ${uploadResponse.status}`);
          const etag = uploadResponse.headers.get("etag") ?? uploadResponse.headers.get("ETag");
          if (!etag) throw new Error("Upload succeeded but response did not include an ETag header");
          await withAbortSignal((signal) =>
            apiRequest(partCompleteUrl, {
              method: "PATCH",
              body: JSON.stringify({ photoId: presigned.photoId, partNumber, etag }),
              signal,
            }),
          );
          completedPartsCount += 1;
          updateUploadProgress();
        };

        const partQueue = [...parts];
        const partWorkers = Array.from(
          { length: Math.max(1, Math.min(MAX_CONCURRENT_CHUNKS, partQueue.length || 1)) },
          async () => { while (partQueue.length > 0) { const part = partQueue.shift(); if (!part) return; await uploadPart(part.partNumber, part.url); } },
        );
        await Promise.all(partWorkers);

        upsertQueueItem({ id: tempId, galleryId, fileName: file.name, progress: 85, status: "confirming", photoId: presigned.photoId, errorMessage: undefined });

        await withAbortSignal((signal) =>
          apiRequest(presigned.confirmUrl, { method: "POST", body: JSON.stringify({ photoId: presigned.photoId }), signal }),
        );

        upsertQueueItem({ id: tempId, galleryId, fileName: file.name, progress: 100, status: "done", photoId: presigned.photoId, errorMessage: undefined });
        fileByQueueIdRef.current.delete(tempId);
      } catch (error) {
        const existingQueueItem = uploadQueueRef.current.find((item) => item.id === tempId);
        if (isAbortError(error)) {
          upsertQueueItem({ id: tempId, galleryId, fileName: file.name, progress: existingQueueItem?.progress ?? 0, status: "paused", photoId: existingQueueItem?.photoId, errorMessage: "Paused. Select files to resume." });
          return;
        }
        const errorMessage = error instanceof Error ? error.message : "Upload failed";
        upsertQueueItem({ id: tempId, galleryId, fileName: file.name, progress: 100, status: "error", photoId: existingQueueItem?.photoId, errorMessage });
        toast.error(errorMessage);
      }
    };

    const fileQueue = [...queuedFiles];
    const fileWorkers = Array.from(
      { length: Math.max(1, Math.min(MAX_CONCURRENT_FILES, fileQueue.length)) },
      async () => { while (fileQueue.length > 0) { const next = fileQueue.shift(); if (!next) return; await uploadSingleFile(next.file, next.tempId); } },
    );
    await Promise.all(fileWorkers);

    if (resumableSessions.length > 0) {
      toast.message(`${resumableSessions.length} paused upload(s) still need files selected to resume`);
    }
    await mutate();
  }

  const retryUploadItem = async (item: UploadQueueItem): Promise<void> => {
    const file = fileByQueueIdRef.current.get(item.id);
    if (!file) { toast.message("Select files again to resume this upload"); fileInputRef.current?.click(); return; }
    removeQueueItem(item.id);
    await uploadFiles([file]);
  };

  const retryAllFailedUploads = async (): Promise<void> => {
    const retryFiles: File[] = [];
    let missingFiles = 0;
    for (const item of failedUploads) {
      const file = fileByQueueIdRef.current.get(item.id);
      if (!file) { missingFiles += 1; continue; }
      retryFiles.push(file);
      removeQueueItem(item.id);
    }
    if (retryFiles.length > 0) await uploadFiles(retryFiles);
    if (missingFiles > 0) { toast.message(`${missingFiles} failed upload(s) require selecting the original files again`); fileInputRef.current?.click(); }
  };

  const resumePausedUploads = async (): Promise<void> => {
    const localFilesToResume: File[] = [];
    let missingFiles = 0;
    for (const item of pausedUploads) {
      const file = fileByQueueIdRef.current.get(item.id);
      if (!file) { missingFiles += 1; continue; }
      localFilesToResume.push(file);
      removeQueueItem(item.id);
    }
    if (localFilesToResume.length > 0) await uploadFiles(localFilesToResume);
    if (missingFiles > 0) { toast.message(`${missingFiles} paused upload(s) need source files. Select your full batch and resume will auto-match.`); fileInputRef.current?.click(); }
  };

  const clearCompletedUploadsForGallery = () => {
    for (const item of galleryUploadQueue) removeQueueItem(item.id);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: true,
    accept: { "image/*": [] },
    
    onDrop: uploadFiles,
  });

  async function deletePhoto(id: string) {
    try {
      await apiRequest(`/api/photos/${id}`, { method: "DELETE" });
      await Promise.all([mutateCache("/api/storage/summary"), mutateCache("/api/storage/events?limit=10&offset=0")]);
      toast.success("Photo deleted");
      await mutate();
      setSelected(galleryId, selected.filter((photoId) => photoId !== id));
      setPhotoToDelete(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete photo");
    }
  }

  async function deleteSelected() {
    if (selected.length === 0) return;
    try {
      await Promise.all(selected.map((id) => apiRequest(`/api/photos/${id}`, { method: "DELETE" })));
      await Promise.all([mutateCache("/api/storage/summary"), mutateCache("/api/storage/events?limit=10&offset=0")]);
      clearSelected(galleryId);
      await mutate();
      toast.success("Selected photos deleted");
      setDeleteSelectedOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete selected photos");
    }
  }

  async function createAlbumFromSelected() {
    if (selected.length === 0 || !newAlbumTitle.trim()) return;
    try {
      await apiRequest(`/api/galleries/${galleryId}/albums`, {
        method: "POST",
        body: JSON.stringify({ title: newAlbumTitle.trim(), photoIds: selected }),
      });
      clearSelected(galleryId);
      setCreateAlbumOpen(false);
      setNewAlbumTitle("");
      await mutate();
      toast.success("Album created");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create album");
    }
  }

  async function setAsCover() {
    if (selected.length !== 1) { toast.error("Select exactly one photo to set as cover"); return; }
    try {
      await apiRequest(`/api/galleries/${galleryId}`, { method: "PATCH", body: JSON.stringify({ coverPhotoId: selected[0] }) });
      clearSelected(galleryId);
      await mutate();
      toast.success("Cover photo updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update cover photo");
    }
  }

  async function setPhotoAsCover(photoId: string) {
    try {
      await apiRequest(`/api/galleries/${galleryId}`, { method: "PATCH", body: JSON.stringify({ coverPhotoId: photoId }) });
      await mutate();
      toast.success("Cover photo updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update cover photo");
    }
  }

  return (
    <div className="space-y-4">
      {/* Upload drop zone */}
      <div
        {...getRootProps()}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "flex items-center justify-center gap-3 rounded-xl border border-dashed px-4 py-4 text-center transition-all cursor-pointer",
          isDragActive
            ? "border-primary bg-primary/8 shadow-sm"
            : "border-border/60 hover:border-primary/30 hover:bg-muted/30",
        )}
      >
        <input {...getInputProps()} className="hidden" ref={fileInputRef} />
        <UploadCloud className="h-5 w-5 text-muted-foreground shrink-0" />
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Drop photos here</span>{" "}
          or click to upload
        </p>
      </div>

      {/* Upload queue */}
      {galleryUploadQueue.length > 0 && (
        <div className="rounded-xl border border-border/60 bg-card p-3 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Upload Queue
            </p>
            <div className="flex items-center gap-1.5">
              {hasRunningUploads && (
                <Button variant="outline" size="sm" className="h-6 px-2 text-[11px]" onClick={() => { pauseAllUploads("Paused manually"); toast.message("Uploads paused"); }}>
                  Pause all
                </Button>
              )}
              {pausedUploads.length > 0 && (
                <Button variant="outline" size="sm" className="h-6 px-2 text-[11px]" onClick={() => void resumePausedUploads()}>
                  Resume all
                </Button>
              )}
              {failedUploads.length > 0 && (
                <Button variant="outline" size="sm" className="h-6 px-2 text-[11px]" onClick={() => void retryAllFailedUploads()}>
                  Retry failed
                </Button>
              )}
              <Button variant="ghost" size="sm" className="h-6 px-2 text-[11px]" onClick={clearCompletedUploadsForGallery}>
                Clear
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            {galleryUploadQueue.map((item) => (
              <div key={item.id} className="space-y-1.5 rounded-lg border border-border/40 bg-muted/40 p-2.5">
                <div className="flex items-center justify-between text-xs">
                  <p className="truncate pr-2 font-medium">{item.fileName}</p>
                  <p className="flex-shrink-0 capitalize text-muted-foreground">{item.status}</p>
                </div>
                {item.errorMessage && <p className="text-[11px] text-muted-foreground">{item.errorMessage}</p>}
                <Progress value={item.progress} className="h-1.5" />
                {item.status === "error" && (
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" className="h-6 px-2 text-[11px]" onClick={() => void retryUploadItem(item)}>
                      Retry
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selection toolbar */}
      {photos.length > 0 && (
        <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/60 bg-background/95 px-3 py-2 backdrop-blur shadow-sm">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={selected.length === photos.length && photos.length > 0}
              onCheckedChange={(checked) => {
                if (checked) setSelected(galleryId, photos.map((p) => p.id));
                else clearSelected(galleryId);
              }}
            />
            <span className="text-sm text-muted-foreground">
              {selected.length > 0 ? `${selected.length} selected` : `${photos.length} photos`}
            </span>
            {selected.length > 0 && (
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => clearSelected(galleryId)}>
                Clear
              </Button>
            )}
          </div>

          {selected.length > 0 && (
            <div className="flex items-center gap-1.5">
              <Dialog open={createAlbumOpen} onOpenChange={setCreateAlbumOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                    <FolderPlus className="h-3.5 w-3.5" />
                    Album
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Album</DialogTitle>
                    <DialogDescription>
                      Create a new album with {selected.length} selected photo{selected.length === 1 ? "" : "s"}.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Label htmlFor="album-title" className="mb-2 block">Album Title</Label>
                    <Input id="album-title" value={newAlbumTitle} onChange={(e) => setNewAlbumTitle(e.target.value)} placeholder="E.g., Getting Ready, Ceremony..." autoFocus />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setCreateAlbumOpen(false)}>Cancel</Button>
                    <Button onClick={createAlbumFromSelected}>Create Album</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={setAsCover} disabled={selected.length !== 1}>
                <Star className="h-3.5 w-3.5" />
                Cover
              </Button>

              <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-destructive hover:text-destructive" onClick={() => setDeleteSelectedOpen(true)}>
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>

              <Dialog open={deleteSelectedOpen} onOpenChange={setDeleteSelectedOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete {selected.length} photo{selected.length === 1 ? "" : "s"}?</DialogTitle>
                    <DialogDescription>This action cannot be undone.</DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDeleteSelectedOpen(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={deleteSelected}>Delete</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      )}

      {/* Photo grid */}
      {photos.length === 0 && galleryUploadQueue.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-primary/20 bg-primary/4 py-16 text-center">
          <Images className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No photos yet. Upload some to get started.</p>
        </div>
      )}

      <div className="columns-2 gap-3 md:columns-3 xl:columns-3">
        {photos.map((photo) => {
          const isSelected = selected.includes(photo.id);
          return (
            <div
              key={photo.id}
              className={cn(
                "group relative mb-3 overflow-hidden rounded-xl transition-all break-inside-avoid",
                isSelected
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  : "hover:shadow-md",
              )}
            >
              <div
                className="relative aspect-[3/4] bg-muted cursor-pointer"
                onClick={() => toggleSelected(galleryId, photo.id)}
              >
                <Image
                  src={photo.thumbnailUrl ?? photo.previewUrl ?? photo.url}
                  alt="Gallery photo"
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="object-cover"
                  unoptimized
                />

                {/* Checkbox overlay */}
                <div
                  className={cn(
                    "absolute left-2 top-2 transition-opacity duration-200",
                    isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                  )}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleSelected(galleryId, photo.id)}
                    className="h-5 w-5 border-white/70 bg-black/20 backdrop-blur-sm data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                  />
                </div>

                {/* Cover badge */}
                {photo.isCover && (
                  <div className="absolute right-2 top-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/90 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                      <Star className="h-3 w-3" />
                      Cover
                    </span>
                  </div>
                )}

                {/* Context menu */}
                <div className="absolute right-2 bottom-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="icon" className="h-7 w-7 rounded-full shadow-md bg-card/80 backdrop-blur-sm">
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                      <DropdownMenuItem onClick={() => setPhotoAsCover(photo.id)}>
                        <Star className="mr-2 h-3.5 w-3.5" />
                        Set as cover
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setPhotoToDelete(photo.id)}>
                        <Trash2 className="mr-2 h-3.5 w-3.5" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Single photo delete dialog */}
      <Dialog open={!!photoToDelete} onOpenChange={(open) => !open && setPhotoToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Photo</DialogTitle>
            <DialogDescription>Are you sure? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPhotoToDelete(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => photoToDelete && deletePhoto(photoToDelete)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Albums Tab
   ═══════════════════════════════════════════════════════════════════ */

function AlbumsTab({
  galleryId,
  albums,
  photos,
  mutate,
}: {
  galleryId: string;
  albums: GetGalleryResponse["gallery"]["albums"];
  photos: GetGalleryResponse["gallery"]["photos"];
  mutate: () => Promise<GetGalleryResponse | undefined>;
}) {
  const photoMap = useMemo(() => new Map(photos.map((photo) => [photo.id, photo])), [photos]);

  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [albumToRename, setAlbumToRename] = useState<{ id: string; title: string } | null>(null);
  const [newTitle, setNewTitle] = useState("");

  const handleRenameClick = (album: { id: string; title: string }) => {
    setAlbumToRename(album);
    setNewTitle(album.title);
    setRenameDialogOpen(true);
  };

  const confirmRename = async () => {
    if (!albumToRename || !newTitle.trim() || newTitle === albumToRename.title) {
      setRenameDialogOpen(false);
      return;
    }
    try {
      await apiRequest(`/api/galleries/${galleryId}/albums/${albumToRename.id}`, {
        method: "PATCH",
        body: JSON.stringify({ title: newTitle.trim() }),
      });
      await mutate();
      toast.success("Album updated");
      setRenameDialogOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update album");
    }
  };

  const deleteAlbum = async (albumId: string) => {
    try {
      await apiRequest(`/api/galleries/${galleryId}/albums/${albumId}`, { method: "DELETE" });
      await mutate();
      toast.success("Album deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete album");
    }
  };

  if (albums.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-primary/20 bg-primary/4 py-16 text-center">
        <FolderKanban className="h-10 w-10 text-muted-foreground/40" />
        <div>
          <p className="text-sm font-medium text-foreground">No albums yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Select photos in the Photos tab and click &ldquo;Album&rdquo; to create your first album.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {albums.map((album) => {
          const albumPhotos = album.photoIds
            .map((id) => photoMap.get(id))
            .filter(Boolean) as GetGalleryResponse["gallery"]["photos"];
          const heroPhoto = albumPhotos[0];
          const heroUrl = heroPhoto?.thumbnailUrl ?? heroPhoto?.previewUrl ?? heroPhoto?.url;
          const previewPhotos = albumPhotos.slice(1, 5);

          return (
            <div
              key={album.id}
              className="group overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm transition-all hover:shadow-md"
            >
              {/* Hero image */}
              <div className="relative aspect-[16/10] bg-muted overflow-hidden">
                {heroUrl ? (
                  <Image
                    src={heroUrl}
                    alt={album.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <FolderKanban className="h-8 w-8 text-muted-foreground/30" />
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <h3 className="text-sm font-medium text-white truncate">{album.title}</h3>
                  <p className="text-xs text-white/70">{album.photoIds.length} photos</p>
                </div>
              </div>

              {/* Preview strip + actions */}
              <div className="flex items-center justify-between gap-2 px-3 py-2">
                <div className="flex gap-1 overflow-hidden">
                  {previewPhotos.map((photo) => {
                    const thumb = photo.thumbnailUrl ?? photo.previewUrl ?? photo.url;
                    return (
                      <Image
                        key={photo.id}
                        src={thumb}
                        alt=""
                        width={36}
                        height={36}
                        className="h-9 w-9 rounded-md border border-border/40 object-cover"
                        unoptimized
                      />
                    );
                  })}
                  {albumPhotos.length > 5 && (
                    <span className="flex h-9 w-9 items-center justify-center rounded-md border border-border/40 bg-muted text-[10px] text-muted-foreground">
                      +{albumPhotos.length - 5}
                    </span>
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem onClick={() => handleRenameClick(album)}>Rename</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => void deleteAlbum(album.id)}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rename dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Album</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="rename-album" className="mb-2 block">Album Title</Label>
            <Input id="rename-album" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} autoFocus />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmRename}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Settings Tab
   ═══════════════════════════════════════════════════════════════════ */

function SettingsTab({
  galleryId,
  mutate,
  data,
}: {
  galleryId: string;
  mutate: () => Promise<GetGalleryResponse | undefined>;
  data: GetGalleryResponse;
}) {
  const [title, setTitle] = useState(data.gallery.title);
  const [slug, setSlug] = useState(data.gallery.slug);
  const [eventDate, setEventDate] = useState(data.gallery.eventDate ?? "");
  const [deadline, setDeadline] = useState(data.gallery.deadline ?? "");
  const [saving, setSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteGalleryTitle, setDeleteGalleryTitle] = useState("");

  const galleryBaseUrl = process.env.NEXT_PUBLIC_GALLERY_URL ?? "http://localhost:3003";
  const slugPreview = `${galleryBaseUrl.replace(/\/$/, "").replace(/^https?:\/\//, "")}/`;

  async function onSave() {
    setSaving(true);
    try {
      await apiRequest(`/api/galleries/${galleryId}`, {
        method: "PATCH",
        body: JSON.stringify({
          title, slug,
          eventDate: eventDate || null,
          deadline: deadline || null,
        }),
      });
      await mutate();
      toast.success("Settings saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update gallery");
    } finally {
      setSaving(false);
    }
  }

  async function deleteGallery() {
    await apiRequest(`/api/galleries/${galleryId}`, { method: "DELETE" });
    await Promise.all([mutateCache("/api/storage/summary"), mutateCache("/api/storage/events?limit=10&offset=0")]);
    toast.success("Gallery deleted");
    window.location.href = "/galleries";
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        {/* General */}
        <section className="space-y-4 rounded-xl border border-border/60 bg-card p-5">
          <h3 className="text-sm font-medium">General</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="gallery-title" className="text-xs">Title</Label>
              <Input id="gallery-title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="slug" className="text-xs">Slug</Label>
              <div className="flex">
                <span className="flex items-center rounded-l-md border border-r-0 border-input bg-muted px-2.5 text-xs text-muted-foreground whitespace-nowrap">
                  {slugPreview}
                </span>
                <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} className="rounded-l-none" />
              </div>
            </div>
          </div>
        </section>

        {/* Dates */}
        <section className="space-y-4 rounded-xl border border-border/60 bg-card p-5">
          <h3 className="text-sm font-medium">Dates</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="eventDate" className="text-xs">Event Date</Label>
              <Input id="eventDate" type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="deadline" className="text-xs">Deadline</Label>
              <Input id="deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </div>
          </div>
        </section>

        {/* Save */}
        <Button onClick={onSave} disabled={saving} className="w-full sm:w-auto">
          {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save settings"}
        </Button>
      </div>

      {/* Danger zone */}
      <div className="h-fit space-y-4 rounded-xl border border-destructive/15 bg-destructive/5 p-5">
        <h3 className="flex items-center gap-2 text-sm font-medium">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          Danger Zone
        </h3>
        <p className="text-xs text-muted-foreground">
          Deleting a gallery permanently removes all photos and queues S3 cleanup. This cannot be undone.
        </p>

        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogTrigger asChild>
            <Button variant="destructive" size="sm" className="w-full">
              Delete gallery
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete this gallery?</DialogTitle>
              <DialogDescription>This action cannot be undone. All photos and links will stop working.</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Type &ldquo;{title}&rdquo; to confirm</p>
              <Input
                placeholder={title}
                value={deleteGalleryTitle}
                onChange={(e) => setDeleteGalleryTitle(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
              <Button
                variant="destructive"
                disabled={deleteGalleryTitle !== title}
                onClick={() => { setShowDeleteDialog(false); deleteGallery(); }}
              >
                Delete gallery
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Share Tab
   ═══════════════════════════════════════════════════════════════════ */

function ShareTab({
  data,
  galleryId,
}: {
  data: GetGalleryResponse;
  galleryId: string;
}) {
  const { data: viewersData, mutate: refreshViewers } = useSWR<{
    count: number;
    viewers?: Array<{ id: string; name: string; role: "client" | "photographer" }>;
  }>(`/api/galleries/${galleryId}/viewers`, jsonFetcher, { revalidateOnFocus: true });

  useEffect(() => {
    const intervalId = window.setInterval(() => void refreshViewers(), 15000);
    return () => window.clearInterval(intervalId);
  }, [refreshViewers]);

  const shareLink = useMemo(() => getGalleryShareLink(data.gallery.slug), [data.gallery.slug]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    toast.success("Share link copied");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_280px]">
      <div className="space-y-5">
        <section className="space-y-4 rounded-xl border border-border/60 bg-card p-5">
          <h3 className="text-sm font-medium">Share Link</h3>

          {!data.gallery.isPublished && (
            <div className="rounded-lg border border-amber-300/50 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-700/50 dark:bg-amber-950/30 dark:text-amber-200">
              Publish this gallery first to enable the share link.
            </div>
          )}

          <div className="flex gap-2">
            <Input readOnly value={shareLink} className="text-sm" />
            <Button variant="outline" disabled={!data.gallery.isPublished} onClick={handleCopy} className="shrink-0 gap-1.5">
              {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Send via WhatsApp</Button>
            <Button variant="outline" size="sm" disabled>Send via Email</Button>
          </div>
        </section>

        {viewersData && viewersData.count > 0 && (
          <section className="space-y-3 rounded-xl border border-border/60 bg-card p-5">
            <h3 className="text-sm font-medium">Active Viewers ({viewersData.count})</h3>
            <div className="space-y-2">
              {viewersData.viewers?.map((viewer) => (
                <div key={viewer.id} className="flex items-center gap-2 text-sm">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>{viewer.name}</span>
                  <span className="text-xs text-muted-foreground">({viewer.role})</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <section className="space-y-4 rounded-xl border border-border/60 bg-card p-5 h-fit">
        <h3 className="text-sm font-medium">QR Code</h3>
        {data.gallery.isPublished ? (
          <>
            <div id="gallery-share-qr-wrap" className="flex items-center justify-center rounded-lg border bg-white p-3">
              <QRCodeSVG value={shareLink} size={200} level="H" includeMargin bgColor="#ffffff" fgColor="#0f172a" />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                const svg = document.querySelector("#gallery-share-qr-wrap svg");
                if (!svg) { toast.error("Unable to export QR code"); return; }
                const source = new XMLSerializer().serializeToString(svg);
                const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `${data.gallery.slug}-qr.svg`;
                link.click();
                URL.revokeObjectURL(url);
              }}
            >
              Download QR
            </Button>
          </>
        ) : (
          <p className="text-xs text-muted-foreground">Publish to enable QR sharing.</p>
        )}
      </section>
    </div>
  );
}
