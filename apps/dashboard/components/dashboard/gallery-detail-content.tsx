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
import { Badge } from "@workspace/ui/components/badge";
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
              </p>
            </div>
          </div>
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [createAlbumOpen, setCreateAlbumOpen] = useState(false);
  const [newAlbumTitle, setNewAlbumTitle] = useState("");

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
                className="group relative mb-4 break-inside-avoid overflow-hidden rounded-xl border border-border/50 bg-white shadow-sm transition-all"
              >
                <div className="relative aspect-[3/4] bg-slate-100">
                  <Image
                    src={photo.url}
                    alt="Gallery photo"
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    className={`object-cover transition-all duration-300 ${isSelected ? "scale-[1.02]" : "group-hover:scale-[1.02]"}`}
                    unoptimized
                  />

                  <div
                    className={`pointer-events-none absolute inset-0 bg-black/40 transition-opacity duration-300 ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                  />

                  <div
                    className={`absolute left-3 top-3 transition-opacity duration-300 ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() =>
                        toggleSelected(galleryId, photo.id)
                      }
                      className="border-white/50 data-[state=checked]:border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                    />
                  </div>

                  <div className="absolute right-3 top-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8 rounded-full shadow-md hover:bg-red-600"
                      onClick={() => void deletePhoto(photo.id)}
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

            {uploadQueue.length > 0 && (
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Upload Queue
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-[11px]"
                    onClick={clearCompletedUploads}
                  >
                    Clear done
                  </Button>
                </div>

                <div className="space-y-2.5">
                  {uploadQueue.map((item) => (
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
                      <Progress value={item.progress} className="h-1.5" />
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

      <Card className="border-red-100 bg-red-50/30 shadow-none">
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

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                className="w-full bg-red-600 hover:bg-red-700 sm:w-auto"
              >
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
                <Button variant="outline" onClick={(e) => e.stopPropagation()}>
                  Cancel
                </Button>
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
