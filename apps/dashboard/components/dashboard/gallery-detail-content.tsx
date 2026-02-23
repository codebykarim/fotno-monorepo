"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import useSWR from "swr";
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
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Progress } from "@workspace/ui/components/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { apiRequest, jsonFetcher } from "@/lib/api/client";
import { GetGalleryResponse } from "@/lib/types/api";
import { useGalleryUiStore } from "@/lib/stores/gallery-ui-store";

const tabs = ["photos", "albums", "settings", "share"] as const;
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
  share: {
    label: "Share",
    icon: Share2,
    description: "Links and QR",
  },
};

type Props = {
  galleryId: string;
  initialTab?: Tab;
};

const EMPTY_SELECTION: string[] = [];

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
      <div className="py-10 text-sm text-muted-foreground">
        Loading gallery...
      </div>
    );
  }

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
              <p className="mt-1 flex items-center gap-1.5 text-lg font-light">
                <div
                  className={`h-2 w-2 rounded-full ${data.gallery.isPublished ? "bg-emerald-500" : "bg-amber-400"}`}
                />
                {data.gallery.isPublished ? "Published" : "Draft"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <span className="font-medium text-foreground">
              {data.gallery.eventDate ?? "No date"}
            </span>
          </span>
          <span className="text-border">•</span>
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <Clock3 className="h-4 w-4" />
            <span className="font-medium text-foreground">
              {data.gallery.deadline ?? "No deadline"}
            </span>
          </span>
        </div>
      </section>

      <div className="grid gap-1 rounded-xl bg-slate-100/60 p-1 sm:grid-cols-4">
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
      {activeTab === "share" && <ShareTab data={data} galleryId={galleryId} />}
    </div>
  );
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
  const clearCompletedUploads = useGalleryUiStore(
    (state) => state.clearCompletedUploads,
  );
  const [draggingPhotoId, setDraggingPhotoId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Prevent browser navigation when files are dropped outside the dropzone.
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

  async function uploadFiles(files: File[]) {
    for (const file of files) {
      const tempId = `upload-${file.name}-${Date.now()}`;
      upsertQueueItem({
        id: tempId,
        fileName: file.name,
        progress: 5,
        status: "queued",
      });

      try {
        const presigned = await apiRequest<{
          uploadId: string;
          uploadUrl: string;
          confirmUrl: string;
        }>(`/api/galleries/${galleryId}/photos/presign`, {
          method: "POST",
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
            size: file.size,
          }),
        });

        upsertQueueItem({
          id: tempId,
          fileName: file.name,
          progress: 20,
          status: "uploading",
        });

        const uploadResponse = await fetch(presigned.uploadUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type || "application/octet-stream",
          },
        });

        if (!uploadResponse.ok) {
          throw new Error(`Upload failed with status ${uploadResponse.status}`);
        }

        upsertQueueItem({
          id: tempId,
          fileName: file.name,
          progress: 85,
          status: "confirming",
        });

        await apiRequest(presigned.confirmUrl, {
          method: "POST",
          body: JSON.stringify({
            uploadId: presigned.uploadId,
            fileName: file.name,
          }),
        });

        upsertQueueItem({
          id: tempId,
          fileName: file.name,
          progress: 100,
          status: "done",
        });
      } catch (error) {
        upsertQueueItem({
          id: tempId,
          fileName: file.name,
          progress: 100,
          status: "error",
        });
        toast.error(error instanceof Error ? error.message : "Upload failed");
      }
    }

    await mutate();
  }

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
      toast.success("Photo deleted");
      await mutate();
      setSelected(
        galleryId,
        selected.filter((photoId) => photoId !== id),
      );
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

    const confirmed = window.confirm(
      `Delete ${selected.length} selected ${selected.length === 1 ? "photo" : "photos"}?`,
    );
    if (!confirmed) {
      return;
    }

    try {
      await Promise.all(
        selected.map((id) =>
          apiRequest(`/api/photos/${id}`, { method: "DELETE" }),
        ),
      );
      clearSelected(galleryId);
      await mutate();
      toast.success("Selected photos deleted");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete selected photos",
      );
    }
  }

  async function toggleLoved(photoId: string, loved: boolean) {
    try {
      await apiRequest(`/api/photos/${photoId}`, {
        method: "PATCH",
        body: JSON.stringify({ loved: !loved }),
      });
      await mutate();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update loved photo",
      );
    }
  }

  async function createAlbumFromSelected() {
    if (selected.length === 0) {
      return;
    }

    const title = window.prompt("Album name");
    if (!title || title.trim().length === 0) {
      return;
    }

    try {
      await apiRequest(`/api/galleries/${galleryId}/albums`, {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          photoIds: selected,
        }),
      });
      clearSelected(galleryId);
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

  async function movePhoto(dropOnPhotoId: string) {
    if (!draggingPhotoId || draggingPhotoId === dropOnPhotoId) {
      return;
    }

    const orderedIds = photos.map((photo) => photo.id);
    const draggingIndex = orderedIds.indexOf(draggingPhotoId);
    const dropIndex = orderedIds.indexOf(dropOnPhotoId);
    if (draggingIndex < 0 || dropIndex < 0) {
      return;
    }

    orderedIds.splice(draggingIndex, 1);
    orderedIds.splice(dropIndex, 0, draggingPhotoId);

    await apiRequest(`/api/galleries/${galleryId}/photos/reorder`, {
      method: "PATCH",
      body: JSON.stringify({
        items: orderedIds.map((photoId, index) => ({
          photoId,
          order: index + 1,
        })),
      }),
    });

    setDraggingPhotoId(null);
    await mutate();
    toast.success("Photos reordered");
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <div
            {...getRootProps()}
            className={`rounded-xl border-2 border-dashed p-8 text-center transition ${
              isDragActive ? "border-primary bg-primary/5" : "border-border"
            }`}
          >
            <input {...getInputProps()} className="hidden" ref={fileInputRef} />
            <UploadCloud className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium">Drag and drop files here</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Supports multiple image files per upload.
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() => fileInputRef.current?.click()}
            >
              Choose images
            </Button>
          </div>

          {uploadQueue.length > 0 && (
            <div className="mt-4 space-y-2 rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Upload Queue</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCompletedUploads}
                >
                  Clear done
                </Button>
              </div>

              {uploadQueue.map((item) => (
                <div key={item.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <p>{item.fileName}</p>
                    <p className="capitalize text-muted-foreground">
                      {item.status}
                    </p>
                  </div>
                  <Progress value={item.progress} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-background/95 p-3 backdrop-blur">
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
          <Button
            size="sm"
            variant="outline"
            onClick={createAlbumFromSelected}
            disabled={selected.length === 0}
          >
            Add to Album
          </Button>
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
            onClick={deleteSelected}
            disabled={selected.length === 0}
          >
            Delete Selected
          </Button>
        </div>
      </div>

      <div className="columns-2 gap-4 md:columns-3 xl:columns-4">
        {photos.map((photo) => {
          const isSelected = selected.includes(photo.id);
          return (
            <div
              key={photo.id}
              draggable
              onDragStart={() => setDraggingPhotoId(photo.id)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => void movePhoto(photo.id)}
              className="mb-4 break-inside-avoid overflow-hidden rounded-lg border bg-card"
            >
              <div className="relative aspect-[3/4] bg-muted/20">
                <Image
                  src={photo.url}
                  alt="Gallery photo"
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute left-2 top-2">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleSelected(galleryId, photo.id)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between border-t p-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground"
                  onMouseDown={(event) => event.preventDefault()}
                >
                  <GripVertical className="h-3 w-3" />
                  Drag
                </button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => void toggleLoved(photo.id, photo.loved)}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      photo.loved
                        ? "fill-rose-500 text-rose-500"
                        : "text-muted-foreground"
                    }`}
                  />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => void deletePhoto(photo.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          );
        })}
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

  const renameAlbum = async (albumId: string, currentTitle: string) => {
    const title = window.prompt("Album name", currentTitle);
    if (!title || title.trim().length === 0 || title === currentTitle) {
      return;
    }

    try {
      await apiRequest(`/api/galleries/${galleryId}/albums/${albumId}`, {
        method: "PATCH",
        body: JSON.stringify({ title: title.trim() }),
      });
      await mutate();
      toast.success("Album updated");
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
                  onClick={() => void renameAlbum(album.id, album.title)}
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
                if (!photo?.url) {
                  return null;
                }
                return (
                  <Image
                    key={photoId}
                    src={photo.url}
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

          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">
                  Enable password protection
                </p>
                <p className="text-xs text-muted-foreground">
                  Require clients to enter a password.
                </p>
              </div>
              <Checkbox
                checked={passwordEnabled}
                onCheckedChange={(value) => setPasswordEnabled(Boolean(value))}
              />
            </div>

            {passwordEnabled && (
              <Input
                type="text"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter gallery password"
              />
            )}
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">Published</p>
              <p className="text-xs text-muted-foreground">
                Make this gallery visible through the share link.
              </p>
            </div>
            <Checkbox
              checked={isPublished}
              onCheckedChange={(value) => setIsPublished(Boolean(value))}
            />
          </div>

          <Button onClick={onSave} disabled={saving}>
            {saving ? "Saving..." : "Save settings"}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-4 w-4" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Deleting a gallery permanently removes all photos and queues S3
            cleanup.
          </p>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                Delete gallery
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete this gallery?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. All photos and links will stop
                  working.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button
                  variant="destructive"
                  onClick={() => void deleteGallery()}
                >
                  Confirm delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
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

  const shareLink = useMemo(() => {
    const configuredGalleryUrl = process.env.NEXT_PUBLIC_GALLERY_URL?.replace(
      /\/$/,
      "",
    );

    const buildShareUrl = (baseUrl: string) =>
      `${baseUrl.replace(/\/$/, "")}/${data.gallery.slug}`;

    const mapLocalhostToCurrentHost = (urlString: string): string => {
      if (typeof window === "undefined") {
        return urlString;
      }

      try {
        const parsed = new URL(urlString);
        if (
          parsed.hostname === "localhost" ||
          parsed.hostname === "127.0.0.1"
        ) {
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
  }, [data.gallery.slug]);

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

      <Card className="xl:col-span-3">
        <CardHeader>
          <CardTitle>Who Is Watching Right Now</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="inline-flex items-center rounded-full border border-border/70 bg-background px-3 py-1 text-sm">
            {viewersData?.count ?? 0} live viewer
            {(viewersData?.count ?? 0) === 1 ? "" : "s"}
          </div>
          <div className="flex flex-wrap gap-2">
            {viewersData?.viewers?.length ? (
              viewersData.viewers.map((viewer) => (
                <span
                  key={viewer.id}
                  className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-background px-2.5 py-1 text-xs"
                >
                  {viewer.name}
                </span>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No active viewers yet.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
