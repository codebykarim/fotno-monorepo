"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import useSWR, { mutate as mutateCache } from "swr";
import { useDropzone } from "react-dropzone";
import { QRCodeSVG } from "qrcode.react";
import {
  AlertTriangle,
  Album,
  CalendarDays,
  Clock3,
  Copy,
  FolderKanban,
  Grid2x2,
  Heart,
  Images,
  Settings2,
  Share2,
  Trash2,
  GripVertical,
  UploadCloud,
  MoreVertical,
  Star,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Progress } from "@workspace/ui/components/progress";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

const tabs = ["photos", "albums", "settings"] as const;
type Tab = (typeof tabs)[number];

const TAB_META: Record<
  Tab,
  { label: string; icon: typeof Images; description: string }
> = {
  photos: {
    label: "Photos",
    icon: Grid2x2,
    description: "Curation, cover, order",
  },
  albums: {
    label: "Albums",
    icon: Album,
    description: "Client groupings",
  },
  settings: {
    label: "Settings",
    icon: Settings2,
    description: "Access and publishing",
  },
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
    if (error.name === "AbortError") {
      return true;
    }
    return error.message.toLowerCase().includes("aborted");
  }

  return false;
}

export function GalleryDetailContent({
  galleryId,
  initialTab = "photos",
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const { data, mutate, isLoading } = useSWR<GetGalleryResponse>(
    `/api/galleries/${galleryId}`,
    jsonFetcher,
    {
      revalidateOnFocus: false,
    },
  );

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-10 w-48 sm:w-64" />
              <Skeleton className="h-5 w-72 sm:w-96 max-w-full" />
            </div>

            <div className="flex flex-wrap gap-2 lg:gap-3">
              <div className="grid grid-cols-2 gap-2">
                <Skeleton className="h-[72px] w-[100px] rounded-xl" />
                <Skeleton className="h-[72px] w-[100px] rounded-xl" />
                <Skeleton className="h-[72px] w-[120px] rounded-xl" />
                <Skeleton className="h-[72px] w-[220px] rounded-xl" />
              </div>
              <Skeleton className="h-[158px] w-[158px] rounded-md hidden lg:block" />
            </div>
          </div>
        </section>

        <div className="grid gap-1 rounded-xl bg-slate-100/60 p-1 sm:grid-cols-3">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_300px]">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-white p-3 shadow-sm flex-wrap">
              <Skeleton className="h-9 w-32 sm:w-48" />
              <div className="flex gap-2 flex-wrap">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-32" />
              </div>
            </div>
            <div className="columns-2 gap-4 md:columns-3 xl:columns-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className={`mb-4 w-full rounded-xl ${i % 2 === 0 ? "h-[300px]" : "h-[200px]"}`}
                />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-xl hidden lg:block" />
          </div>
        </div>
      </div>
    );
  }

  const shareLink = getGalleryShareLink(data.gallery.slug);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm transition-all">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Workspace
            </p>
            <h1 className="mt-2 text-4xl font-light tracking-tight text-foreground">
              {data.gallery.title}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-lg">
              Manage photos, albums, settings, and client sharing.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 lg:gap-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col justify-center rounded-xl border border-border/60 bg-slate-50/50 px-4 py-3 min-w-[100px]">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Photos
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-lg font-light">
                  <Images className="h-4 w-4 text-foreground/40" />
                  {data.gallery.photos.length}
                </p>
              </div>
              <div className="flex flex-col justify-center rounded-xl border border-border/60 bg-slate-50/50 px-4 py-3 min-w-[100px]">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Albums
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-lg font-light">
                  <FolderKanban className="h-4 w-4 text-foreground/40" />
                  {data.gallery.albums.length}
                </p>
              </div>
              <div className="flex flex-col justify-center rounded-xl border border-border/60 bg-slate-50/50 px-4 py-3 min-w-[120px]">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Status
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-lg font-light">
                  <Badge
                    variant="outline"
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      data.gallery.isPublished
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-amber-200 bg-amber-50 text-amber-700"
                    }`}
                  >
                    {data.gallery.isPublished ? "Published" : "Draft"}
                  </Badge>
                </div>
              </div>
              {data.gallery.isPublished && (
                <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-slate-50/50 px-3 py-3 min-w-[220px]">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Share
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(shareLink);
                        toast.success("Share link copied");
                      }}
                      className="mt-1 flex w-full items-center gap-1 text-left font-bold text-xs text-blue-500 hover:text-blue-500/80"
                      title={shareLink}
                    >
                      <span className="truncate">Copy Link</span>
                      <Copy className="h-3.5 w-3.5 shrink-0" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {data.gallery.isPublished && (
              <div className="rounded-md border bg-white p-1">
                <QRCodeSVG
                  value={shareLink}
                  size={150}
                  level="H"
                  includeMargin={false}
                  bgColor="#ffffff"
                  fgColor="#0f172a"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="grid gap-1 rounded-xl bg-slate-100/60 p-1 sm:grid-cols-3">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          const Icon = TAB_META[tab].icon;
          return (
            <button
              type="button"
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 transition-all ${
                isActive
                  ? "bg-white text-foreground shadow-sm ring-1 ring-border/50"
                  : "text-muted-foreground hover:bg-slate-200/50 hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium">{TAB_META[tab].label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === "photos" && (
        <PhotosTab
          galleryId={galleryId}
          mutate={mutate}
          photos={data.gallery.photos}
        />
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
    </div>
  );
}

function getGalleryShareLink(slug: string) {
  const configuredGalleryUrl = process.env.NEXT_PUBLIC_GALLERY_URL?.replace(
    /\/$/,
    "",
  );

  const buildShareUrl = (baseUrl: string) =>
    `${baseUrl.replace(/\/$/, "")}/${slug}`;

  const mapLocalhostToCurrentHost = (urlString: string): string => {
    if (typeof window === "undefined") {
      return urlString;
    }

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

  if (configuredGalleryUrl) {
    return buildShareUrl(mapLocalhostToCurrentHost(configuredGalleryUrl));
  }

  if (typeof window === "undefined") {
    return buildShareUrl("http://localhost:3003");
  }

  const inferredBaseUrl =
    window.location.port === "3001"
      ? `${window.location.protocol}//${window.location.hostname}:3003`
      : window.location.origin;

  return buildShareUrl(inferredBaseUrl);
}

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
    if (typeof window === "undefined") {
      return;
    }

    const persistedRaw = window.localStorage.getItem(
      getUploadQueueStorageKey(galleryId),
    );

    if (!persistedRaw) {
      return;
    }

    try {
      const parsed = JSON.parse(persistedRaw);
      if (!Array.isArray(parsed)) {
        return;
      }

      for (const item of parsed) {
        if (typeof item !== "object" || item === null) {
          continue;
        }

        const candidate = item as Partial<UploadQueueItem>;
        if (
          typeof candidate.id !== "string" ||
          typeof candidate.fileName !== "string" ||
          typeof candidate.progress !== "number" ||
          typeof candidate.status !== "string"
        ) {
          continue;
        }

        const normalizedStatus =
          candidate.status === "queued" ||
          candidate.status === "uploading" ||
          candidate.status === "confirming" ||
          candidate.status === "paused" ||
          candidate.status === "done" ||
          candidate.status === "error"
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
    } catch {
      // Ignore malformed persisted queue data.
    }
  }, [galleryId, upsertQueueItem]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

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
      if (
        item.status === "queued" ||
        item.status === "uploading" ||
        item.status === "confirming"
      ) {
        upsertQueueItem({
          ...item,
          status: "paused",
          errorMessage: reason,
        });
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
        (item) =>
          item.status === "queued" ||
          item.status === "uploading" ||
          item.status === "confirming",
      );

      if (!hasInFlight) {
        return;
      }

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
      photoId: string;
      filename: string;
      mimeType: string;
      checksum?: string | null;
      totalSize?: string;
      totalParts: number;
      completedParts: Array<{ partNumber: number; etag: string }>;
      presignedParts: Array<{ partNumber: number; url: string }>;
    };

    const syncRemoteSessions = async () => {
      try {
        const response = await apiRequest<{ sessions?: ResumeSession[] }>(
          `/api/galleries/${galleryId}/photos/session`,
          { method: "GET" },
        );

        if (cancelled) {
          return;
        }

        const sessions = Array.isArray(response.sessions)
          ? response.sessions
          : [];
        for (const session of sessions) {
          const progress =
            20 +
            Math.floor(
              ((session.completedParts.length || 0) /
                Math.max(1, session.totalParts || 1)) *
                65,
            );

          const existing = uploadQueueRef.current.find(
            (item) => item.photoId === session.photoId,
          );

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
      } catch {
        // Optional enhancement; no blocking behavior.
      }
    };

    void syncRemoteSessions();

    return () => {
      cancelled = true;
    };
  }, [galleryId, upsertQueueItem]);

  const computeFileChecksum = async (file: File): Promise<string> => {
    const sample = file.slice(0, 1024 * 1024);
    const buffer = await sample.arrayBuffer();
    const digest = await crypto.subtle.digest("SHA-256", buffer);

    return Array.from(new Uint8Array(digest))
      .map((value) => value.toString(16).padStart(2, "0"))
      .join("");
  };

  async function uploadFiles(files: File[]) {
    if (files.length === 0) {
      return;
    }

    type PresignResponse = {
      photoId: string;
      totalParts: number;
      chunkSizeBytes: number;
      duplicate: boolean;
      presignedParts: Array<{ partNumber: number; url: string }>;
      partCompleteUrl: string;
      confirmUrl: string;
    };

    type ResumeSession = {
      photoId: string;
      filename: string;
      mimeType: string;
      checksum?: string | null;
      totalSize?: string;
      totalParts: number;
      completedParts: Array<{ partNumber: number; etag: string }>;
      presignedParts: Array<{ partNumber: number; url: string }>;
    };

    const withAbortSignal = async <T,>(
      task: (signal: AbortSignal) => Promise<T>,
    ): Promise<T> => {
      const controller = new AbortController();
      activeUploadControllersRef.current.add(controller);
      try {
        return await task(controller.signal);
      } finally {
        activeUploadControllersRef.current.delete(controller);
      }
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
      upsertQueueItem({
        id: item.tempId,
        galleryId,
        fileName: item.file.name,
        progress: 5,
        status: "queued",
      });
    }

    let resumableSessions: ResumeSession[] = [];

    try {
      const response = await withAbortSignal((signal) =>
        apiRequest<{ sessions?: ResumeSession[] }>(
          `/api/galleries/${galleryId}/photos/session`,
          { method: "GET", signal },
        ),
      );
      resumableSessions = Array.isArray(response.sessions)
        ? response.sessions
        : [];
    } catch (error) {
      if (isAbortError(error)) {
        markInFlightUploadsAsPaused("Paused");
        return;
      }
      resumableSessions = [];
    }

    const claimResumeSession = (
      file: File,
      checksum: string,
    ): ResumeSession | undefined => {
      const indexByChecksum = resumableSessions.findIndex((session) => {
        if (!session.checksum) {
          return false;
        }
        const expectedSize = Number(session.totalSize ?? 0);
        return session.checksum === checksum && expectedSize === file.size;
      });

      if (indexByChecksum >= 0) {
        return resumableSessions.splice(indexByChecksum, 1)[0];
      }

      const indexByNameAndSize = resumableSessions.findIndex((session) => {
        const expectedSize = Number(session.totalSize ?? 0);
        return (
          session.filename === file.name &&
          session.mimeType === file.type &&
          expectedSize === file.size
        );
      });

      if (indexByNameAndSize >= 0) {
        return resumableSessions.splice(indexByNameAndSize, 1)[0];
      }

      return undefined;
    };

    const uploadSingleFile = async (
      file: File,
      tempId: string,
    ): Promise<void> => {
      try {
        const checksum = await computeFileChecksum(file);
        const resumeSession = claimResumeSession(file, checksum);

        let presigned: PresignResponse;
        let alreadyCompletedParts = 0;

        if (resumeSession) {
          alreadyCompletedParts = resumeSession.completedParts.length;
          clearStaleQueueForPhotoId(resumeSession.photoId, tempId);
          presigned = {
            photoId: resumeSession.photoId,
            totalParts: resumeSession.totalParts,
            chunkSizeBytes: DEFAULT_CHUNK_SIZE_BYTES,
            duplicate: false,
            presignedParts: resumeSession.presignedParts,
            partCompleteUrl: `/api/galleries/${galleryId}/photos/part-complete`,
            confirmUrl: `/api/galleries/${galleryId}/photos/confirm`,
          };
        } else {
          presigned = await withAbortSignal((signal) =>
            apiRequest<PresignResponse>(
              `/api/galleries/${galleryId}/photos/presign`,
              {
                method: "POST",
                body: JSON.stringify({
                  fileName: file.name,
                  fileType: file.type,
                  size: file.size,
                  checksum,
                }),
                signal,
              },
            ),
          );
        }

        if (presigned.duplicate) {
          upsertQueueItem({
            id: tempId,
            galleryId,
            fileName: file.name,
            progress: 100,
            status: "done",
            photoId: presigned.photoId,
          });
          fileByQueueIdRef.current.delete(tempId);
          return;
        }

        clearStaleQueueForPhotoId(presigned.photoId, tempId);

        const chunkSizeBytes =
          Number(presigned.chunkSizeBytes) > 0
            ? Number(presigned.chunkSizeBytes)
            : DEFAULT_CHUNK_SIZE_BYTES;
        const parts = presigned.presignedParts
          .slice()
          .sort((a, b) => a.partNumber - b.partNumber);
        const totalParts = Math.max(
          Number(presigned.totalParts ?? 0),
          parts.length,
        );

        if (totalParts <= 0) {
          throw new Error("No upload parts were returned for this file");
        }

        let completedPartsCount = alreadyCompletedParts;
        const updateUploadProgress = () => {
          const progress =
            20 +
            Math.floor(
              (Math.min(completedPartsCount, totalParts) / totalParts) * 65,
            );
          upsertQueueItem({
            id: tempId,
            galleryId,
            fileName: file.name,
            progress: Math.min(85, progress),
            status: "uploading",
            photoId: presigned.photoId,
            errorMessage: undefined,
          });
        };

        updateUploadProgress();

        const partCompleteUrl =
          presigned.partCompleteUrl ??
          `/api/galleries/${galleryId}/photos/part-complete`;

        const uploadPart = async (
          partNumber: number,
          url: string,
        ): Promise<void> => {
          const start = (partNumber - 1) * chunkSizeBytes;
          if (start >= file.size) {
            throw new Error(
              `Invalid partNumber ${partNumber} for file ${file.name}`,
            );
          }
          const end = Math.min(start + chunkSizeBytes, file.size);
          const chunk = file.slice(start, end);

          const uploadResponse = await withAbortSignal((signal) =>
            fetch(url, {
              method: "PUT",
              body: chunk,
              headers: {
                "Content-Type": file.type || "application/octet-stream",
              },
              signal,
            }),
          );

          if (!uploadResponse.ok) {
            throw new Error(
              `Upload failed with status ${uploadResponse.status}`,
            );
          }

          const etag =
            uploadResponse.headers.get("etag") ??
            uploadResponse.headers.get("ETag");

          if (!etag) {
            throw new Error(
              "Upload succeeded but response did not include an ETag header",
            );
          }

          await withAbortSignal((signal) =>
            apiRequest(partCompleteUrl, {
              method: "PATCH",
              body: JSON.stringify({
                photoId: presigned.photoId,
                partNumber,
                etag,
              }),
              signal,
            }),
          );

          completedPartsCount += 1;
          updateUploadProgress();
        };

        const partQueue = [...parts];
        const partWorkers = Array.from(
          {
            length: Math.max(
              1,
              Math.min(MAX_CONCURRENT_CHUNKS, partQueue.length || 1),
            ),
          },
          async () => {
            while (partQueue.length > 0) {
              const part = partQueue.shift();
              if (!part) {
                return;
              }
              await uploadPart(part.partNumber, part.url);
            }
          },
        );
        await Promise.all(partWorkers);

        upsertQueueItem({
          id: tempId,
          galleryId,
          fileName: file.name,
          progress: 85,
          status: "confirming",
          photoId: presigned.photoId,
          errorMessage: undefined,
        });

        await withAbortSignal((signal) =>
          apiRequest(presigned.confirmUrl, {
            method: "POST",
            body: JSON.stringify({
              photoId: presigned.photoId,
            }),
            signal,
          }),
        );

        upsertQueueItem({
          id: tempId,
          galleryId,
          fileName: file.name,
          progress: 100,
          status: "done",
          photoId: presigned.photoId,
          errorMessage: undefined,
        });
        fileByQueueIdRef.current.delete(tempId);
      } catch (error) {
        const existingQueueItem = uploadQueueRef.current.find(
          (item) => item.id === tempId,
        );

        if (isAbortError(error)) {
          upsertQueueItem({
            id: tempId,
            galleryId,
            fileName: file.name,
            progress: existingQueueItem?.progress ?? 0,
            status: "paused",
            photoId: existingQueueItem?.photoId,
            errorMessage: "Paused. Select files to resume.",
          });
          return;
        }

        const errorMessage =
          error instanceof Error ? error.message : "Upload failed";

        upsertQueueItem({
          id: tempId,
          galleryId,
          fileName: file.name,
          progress: 100,
          status: "error",
          photoId: existingQueueItem?.photoId,
          errorMessage,
        });
        toast.error(errorMessage);
      }
    };

    const fileQueue = [...queuedFiles];
    const fileWorkers = Array.from(
      {
        length: Math.max(1, Math.min(MAX_CONCURRENT_FILES, fileQueue.length)),
      },
      async () => {
        while (fileQueue.length > 0) {
          const next = fileQueue.shift();
          if (!next) {
            return;
          }
          await uploadSingleFile(next.file, next.tempId);
        }
      },
    );
    await Promise.all(fileWorkers);

    if (resumableSessions.length > 0) {
      toast.message(
        `${resumableSessions.length} paused upload(s) still need files selected to resume`,
      );
    }

    await mutate();
  }

  const retryUploadItem = async (item: UploadQueueItem): Promise<void> => {
    const file = fileByQueueIdRef.current.get(item.id);
    if (!file) {
      toast.message("Select files again to resume this upload");
      fileInputRef.current?.click();
      return;
    }

    removeQueueItem(item.id);
    await uploadFiles([file]);
  };

  const retryAllFailedUploads = async (): Promise<void> => {
    const retryFiles: File[] = [];
    let missingFiles = 0;

    for (const item of failedUploads) {
      const file = fileByQueueIdRef.current.get(item.id);
      if (!file) {
        missingFiles += 1;
        continue;
      }
      retryFiles.push(file);
      removeQueueItem(item.id);
    }

    if (retryFiles.length > 0) {
      await uploadFiles(retryFiles);
    }

    if (missingFiles > 0) {
      toast.message(
        `${missingFiles} failed upload(s) require selecting the original files again`,
      );
      fileInputRef.current?.click();
    }
  };

  const resumePausedUploads = async (): Promise<void> => {
    const localFilesToResume: File[] = [];
    let missingFiles = 0;

    for (const item of pausedUploads) {
      const file = fileByQueueIdRef.current.get(item.id);
      if (!file) {
        missingFiles += 1;
        continue;
      }

      localFilesToResume.push(file);
      removeQueueItem(item.id);
    }

    if (localFilesToResume.length > 0) {
      await uploadFiles(localFilesToResume);
    }

    if (missingFiles > 0) {
      toast.message(
        `${missingFiles} paused upload(s) need source files. Select your full batch and resume will auto-match.`,
      );
      fileInputRef.current?.click();
    }
  };

  const clearCompletedUploadsForGallery = () => {
    for (const item of galleryUploadQueue) {
      removeQueueItem(item.id);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: true,
    accept: {
      "image/*": [],
    },
    onDrop: uploadFiles,
  });

  async function deletePhoto(id: string) {
    try {
      await apiRequest(`/api/photos/${id}`, { method: "DELETE" });
      await Promise.all([
        mutateCache("/api/storage/summary"),
        mutateCache("/api/storage/events?limit=10&offset=0"),
      ]);
      toast.success("Photo deleted");
      await mutate();
      setSelected(
        galleryId,
        selected.filter((photoId) => photoId !== id),
      );
      setPhotoToDelete(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete photo",
      );
    }
  }

  async function deleteSelected() {
    if (selected.length === 0) {
      return;
    }

    try {
      await Promise.all(
        selected.map((id) =>
          apiRequest(`/api/photos/${id}`, { method: "DELETE" }),
        ),
      );
      await Promise.all([
        mutateCache("/api/storage/summary"),
        mutateCache("/api/storage/events?limit=10&offset=0"),
      ]);
      clearSelected(galleryId);
      await mutate();
      toast.success("Selected photos deleted");
      setDeleteSelectedOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete selected photos",
      );
    }
  }

  async function createAlbumFromSelected() {
    if (selected.length === 0 || !newAlbumTitle.trim()) {
      return;
    }

    try {
      await apiRequest(`/api/galleries/${galleryId}/albums`, {
        method: "POST",
        body: JSON.stringify({
          title: newAlbumTitle.trim(),
          photoIds: selected,
        }),
      });
      clearSelected(galleryId);
      setCreateAlbumOpen(false);
      setNewAlbumTitle("");
      await mutate();
      toast.success("Album created");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create album",
      );
    }
  }

  async function setAsCover() {
    if (selected.length !== 1) {
      toast.error("Select exactly one photo to set as cover");
      return;
    }

    try {
      await apiRequest(`/api/galleries/${galleryId}`, {
        method: "PATCH",
        body: JSON.stringify({ coverPhotoId: selected[0] }),
      });

      clearSelected(galleryId);
      await mutate();
      toast.success("Cover photo updated");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update cover photo",
      );
    }
  }

  async function setPhotoAsCover(photoId: string) {
    try {
      await apiRequest(`/api/galleries/${galleryId}`, {
        method: "PATCH",
        body: JSON.stringify({ coverPhotoId: photoId }),
      });
      await mutate();
      toast.success("Cover photo updated");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update cover photo",
      );
    }
  }

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_300px]">
      <div className="space-y-4">
        <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-white/95 p-3 backdrop-blur shadow-sm transition-all">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">
              {selected.length > 0
                ? `${selected.length} selected`
                : "No selection"}
            </p>
            <Button
              size="sm"
              variant="ghost"
              onClick={() =>
                setSelected(
                  galleryId,
                  photos.map((photo) => photo.id),
                )
              }
              disabled={photos.length === 0}
            >
              Select all
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => clearSelected(galleryId)}
              disabled={selected.length === 0}
            >
              Clear
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Dialog open={createAlbumOpen} onOpenChange={setCreateAlbumOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={selected.length === 0}
                >
                  Add to Album
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Album</DialogTitle>
                  <DialogDescription>
                    Create a new album with the {selected.length} selected
                    photo(s).
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Label htmlFor="album-title" className="mb-2 block">
                    Album Title
                  </Label>
                  <Input
                    id="album-title"
                    value={newAlbumTitle}
                    onChange={(e) => setNewAlbumTitle(e.target.value)}
                    placeholder="E.g., Getting Ready, Ceremony..."
                    autoFocus
                  />
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setCreateAlbumOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={createAlbumFromSelected}>
                    Create Album
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button
              size="sm"
              variant="outline"
              onClick={setAsCover}
              disabled={selected.length !== 1}
            >
              Set as Cover
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setDeleteSelectedOpen(true)}
              disabled={selected.length === 0}
            >
              Delete Selected
            </Button>

            <Dialog
              open={deleteSelectedOpen}
              onOpenChange={setDeleteSelectedOpen}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Selected Photos</DialogTitle>
                  <DialogDescription>
                    Delete {selected.length} selected{" "}
                    {selected.length === 1 ? "photo" : "photos"}? This action
                    cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDeleteSelectedOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={deleteSelected}>
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="columns-2 gap-4 md:columns-3 xl:columns-4">
          {photos.map((photo) => {
            const isSelected = selected.includes(photo.id);
            return (
              <div
                key={photo.id}
                className="group relative mb-4  overflow-hidden border border-border/50 bg-white shadow-sm transition-all break-inside-avoid rounded-xl"
              >
                <div className="relative aspect-[3/4] bg-slate-100">
                  <Image
                    src={photo.thumbnailUrl ?? photo.previewUrl ?? photo.url}
                    alt="Gallery photo"
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    className={`object-cover transition-all duration-300 ${isSelected ? "scale-[1.02]" : "group-hover:scale-[1.02]"}`}
                    unoptimized
                    onClick={() => {
                      toggleSelected(galleryId, photo.id);
                    }}
                  />

                  <div
                    className={`pointer-events-none absolute inset-0 bg-black/40 transition-opacity duration-300 ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                  />

                  <div
                    className={`absolute left-3 top-3 flex items-center gap-2 transition-opacity duration-300 ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() =>
                        toggleSelected(galleryId, photo.id)
                      }
                      className="border-white/50 data-[state=checked]:border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                    />
                  </div>

                  <div
                    className={cn(
                      "absolute right-3 bottom-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                      photo.isCover && "opacity-100",
                    )}
                  >
                    <Button
                      variant="secondary"
                      size="icon"
                      className={cn(
                        "h-8 w-8 rounded-full shadow-md hover:bg-white/80",
                        photo.isCover &&
                          "bg-yellow-500 hover:bg-yellow-400 text-white",
                      )}
                      onClick={() => setPhotoAsCover(photo.id)}
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="absolute right-3 top-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8 rounded-full shadow-md hover:bg-red-600"
                      onClick={() => setPhotoToDelete(photo.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Dialog
        open={!!photoToDelete}
        onOpenChange={(open) => !open && setPhotoToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Photo</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this photo? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPhotoToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => photoToDelete && deletePhoto(photoToDelete)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-4 lg:sticky lg:top-4">
        <Card className="shadow-sm">
          <CardHeader className="pb-3 pt-5">
            <CardTitle className="text-sm font-medium">Upload Photos</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`rounded-xl border border-dashed p-6 text-center transition-all ${
                isDragActive
                  ? "border-foreground bg-slate-50"
                  : "border-border hover:bg-slate-50"
              }`}
            >
              <input
                {...getInputProps()}
                className="hidden"
                ref={fileInputRef}
              />
              <UploadCloud className="mx-auto mb-3 h-6 w-6 text-muted-foreground" />
              <p className="text-[13px] font-medium text-foreground">
                Drag and drop files
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Or click to choose
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4 w-full"
                onClick={() => fileInputRef.current?.click()}
              >
                Select files
              </Button>
            </div>

            {galleryUploadQueue.length > 0 && (
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Upload Queue
                  </p>
                  <div className="flex items-center gap-1.5">
                    {hasRunningUploads && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 px-2 text-[11px]"
                        onClick={() => {
                          pauseAllUploads("Paused manually");
                          toast.message("Uploads paused");
                        }}
                      >
                        Pause all
                      </Button>
                    )}
                    {pausedUploads.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 px-2 text-[11px]"
                        onClick={() => {
                          void resumePausedUploads();
                        }}
                      >
                        Resume all paused
                      </Button>
                    )}
                    {failedUploads.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 px-2 text-[11px]"
                        onClick={() => {
                          void retryAllFailedUploads();
                        }}
                      >
                        Retry all failed
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-[11px]"
                      onClick={clearCompletedUploadsForGallery}
                    >
                      Clear
                    </Button>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {galleryUploadQueue.map((item) => (
                    <div
                      key={item.id}
                      className="space-y-1.5 rounded-lg border border-border/40 bg-slate-50/50 p-2.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <p className="truncate pr-2 font-medium">
                          {item.fileName}
                        </p>
                        <p className="flex-shrink-0 capitalize text-muted-foreground">
                          {item.status}
                        </p>
                      </div>
                      {item.errorMessage && (
                        <p className="text-[11px] text-muted-foreground">
                          {item.errorMessage}
                        </p>
                      )}
                      <Progress value={item.progress} className="h-1.5" />
                      {item.status === "error" && (
                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 px-2 text-[11px]"
                            onClick={() => {
                              void retryUploadItem(item);
                            }}
                          >
                            Retry
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

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
  const photoMap = useMemo(
    () => new Map(photos.map((photo) => [photo.id, photo])),
    [photos],
  );

  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [albumToRename, setAlbumToRename] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [newTitle, setNewTitle] = useState("");

  const handleRenameClick = (album: { id: string; title: string }) => {
    setAlbumToRename(album);
    setNewTitle(album.title);
    setRenameDialogOpen(true);
  };

  const confirmRename = async () => {
    if (
      !albumToRename ||
      !newTitle.trim() ||
      newTitle === albumToRename.title
    ) {
      setRenameDialogOpen(false);
      return;
    }

    try {
      await apiRequest(
        `/api/galleries/${galleryId}/albums/${albumToRename.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({ title: newTitle.trim() }),
        },
      );
      await mutate();
      toast.success("Album updated");
      setRenameDialogOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update album",
      );
    }
  };

  const deleteAlbum = async (albumId: string) => {
    try {
      await apiRequest(`/api/galleries/${galleryId}/albums/${albumId}`, {
        method: "DELETE",
      });
      await mutate();
      toast.success("Album deleted");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete album",
      );
    }
  };

  if (albums.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-sm text-muted-foreground">
          No albums yet. Select photos in the Photos tab and click "Add to
          Album".
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {albums.map((album) => (
        <Card key={album.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-base">{album.title}</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRenameClick(album)}
                >
                  Rename
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => void deleteAlbum(album.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-xs text-muted-foreground">
              {album.photoIds.length} photos
            </p>
            <div className="flex flex-wrap gap-2">
              {album.photoIds.map((photoId) => {
                const photo = photoMap.get(photoId);
                const albumThumb =
                  photo?.thumbnailUrl ?? photo?.previewUrl ?? photo?.url;
                if (!albumThumb) {
                  return null;
                }
                return (
                  <Image
                    key={photoId}
                    src={albumThumb}
                    alt={album.title}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-md border object-cover"
                    unoptimized
                  />
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Album</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="rename-album" className="mb-2 block">
              Album Title
            </Label>
            <Input
              id="rename-album"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRenameDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={confirmRename}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

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
  const [passwordEnabled, setPasswordEnabled] = useState(
    data.gallery.passwordEnabled,
  );
  const [password, setPassword] = useState(data.gallery.password ?? "");
  const [isPublished, setIsPublished] = useState(data.gallery.isPublished);
  const [saving, setSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteGalleryTitle, setDeleteGalleryTitle] = useState("");
  const [disableDeleteButton, setDisableDeleteButton] = useState(true);

  async function onSave() {
    setSaving(true);
    try {
      await apiRequest(`/api/galleries/${galleryId}`, {
        method: "PATCH",
        body: JSON.stringify({
          title,
          slug,
          eventDate: eventDate || null,
          deadline: deadline || null,
          passwordEnabled,
          password,
          isPublished,
        }),
      });
      await mutate();
      toast.success("Gallery settings updated");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update gallery",
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteGallery() {
    await apiRequest(`/api/galleries/${galleryId}`, { method: "DELETE" });
    await Promise.all([
      mutateCache("/api/storage/summary"),
      mutateCache("/api/storage/events?limit=10&offset=0"),
    ]);
    toast.success("Gallery deleted");
    window.location.href = "/galleries";
  }

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle>Gallery Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gallery-title">Gallery title</Label>
            <Input
              id="gallery-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="eventDate">Date</Label>
              <Input
                id="eventDate"
                type="date"
                value={eventDate}
                onChange={(event) => setEventDate(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(event) => setDeadline(event.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-slate-50/50 p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">
                  Enable password protection
                </Label>
                <p className="text-xs text-muted-foreground">
                  Require clients to enter a password.
                </p>
              </div>
              <Checkbox
                checked={passwordEnabled}
                onCheckedChange={(value) => setPasswordEnabled(Boolean(value))}
                className="mt-1"
              />
            </div>

            {passwordEnabled && (
              <div className="pt-2">
                <Input
                  type="text"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter gallery password"
                  className="max-w-sm bg-white"
                />
              </div>
            )}
          </div>

          <div className="flex items-start justify-between rounded-xl border border-border/60 bg-slate-50/50 p-4">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Published</Label>
              <p className="text-xs text-muted-foreground">
                Make this gallery visible through the share link.
              </p>
            </div>
            <Checkbox
              checked={isPublished}
              onCheckedChange={(value) => setIsPublished(Boolean(value))}
              className="mt-1"
            />
          </div>

          <Button
            onClick={onSave}
            disabled={saving}
            className="mt-2 w-full sm:w-auto"
          >
            {saving ? "Saving..." : "Save settings"}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-red-100 bg-red-50/30 shadow-none h-fit">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-medium text-red-600">
            <AlertTriangle className="h-4 w-4" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-5 text-sm text-red-900/70">
            Deleting a gallery permanently removes all photos and queues S3
            cleanup. This action cannot be undone.
          </p>
        </CardContent>

        <CardFooter>
          <Dialog>
            <DialogTrigger asChild>
              <div className="w-full sm:w-auto">
                <Button
                  type="button"
                  variant="destructive"
                  className="w-full bg-red-600 hover:bg-red-700 sm:w-auto"
                >
                  Delete gallery
                </Button>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete this gallery?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. All photos and links will stop
                  working.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Type gallery title to delete "{title}"
                </p>
                <Input
                  placeholder={title}
                  value={deleteGalleryTitle}
                  onChange={(e) => {
                    setDeleteGalleryTitle(e.target.value);
                    if (e.target.value === title) {
                      setDisableDeleteButton(false);
                    } else {
                      setDisableDeleteButton(true);
                    }
                  }}
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  disabled={disableDeleteButton}
                  onClick={() => {
                    setShowDeleteDialog(false);
                    deleteGallery();
                  }}
                >
                  Confirm delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  );
}

function ShareTab({
  data,
  galleryId,
}: {
  data: GetGalleryResponse;
  galleryId: string;
}) {
  const { data: viewersData, mutate: refreshViewers } = useSWR<{
    count: number;
    viewers?: Array<{
      id: string;
      name: string;
      role: "client" | "photographer";
    }>;
  }>(`/api/galleries/${galleryId}/viewers`, jsonFetcher, {
    revalidateOnFocus: true,
  });

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      void refreshViewers();
    }, 15000);

    return () => window.clearInterval(intervalId);
  }, [refreshViewers]);

  const shareLink = useMemo(
    () => getGalleryShareLink(data.gallery.slug),
    [data.gallery.slug],
  );

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle>Share Link</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!data.gallery.isPublished && (
            <div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              Publish this gallery first, then you can share the public link.
            </div>
          )}

          <div className="flex gap-2">
            <Input readOnly value={shareLink} />
            <Button
              variant="outline"
              disabled={!data.gallery.isPublished}
              onClick={() => {
                if (!data.gallery.isPublished) {
                  toast.error("Publish this gallery before sharing");
                  return;
                }
                navigator.clipboard.writeText(shareLink);
                toast.success("Share link copied");
              }}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </Button>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" disabled>
              Send via WhatsApp (Phase 6)
            </Button>
            <Button variant="outline" disabled>
              Send via Email (Phase 6)
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>QR Code</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.gallery.isPublished ? (
            <>
              <div
                id="gallery-share-qr-wrap"
                className="flex items-center justify-center rounded-lg border bg-white p-3"
              >
                <QRCodeSVG
                  value={shareLink}
                  size={220}
                  level="H"
                  includeMargin
                  bgColor="#ffffff"
                  fgColor="#0f172a"
                />
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  const svg = document.querySelector(
                    "#gallery-share-qr-wrap svg",
                  );
                  if (!svg) {
                    toast.error("Unable to export QR code");
                    return;
                  }

                  const serializer = new XMLSerializer();
                  const source = serializer.serializeToString(svg);
                  const blob = new Blob([source], {
                    type: "image/svg+xml;charset=utf-8",
                  });
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
            <p className="text-sm text-muted-foreground">
              Publish to enable QR sharing.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
