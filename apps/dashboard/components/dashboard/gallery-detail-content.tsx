"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { useDropzone } from "react-dropzone";
import { QRCodeSVG } from "qrcode.react";
import {
  AlertTriangle,
  Copy,
  Trash2,
  GripVertical,
  UploadCloud,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
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

const tabs = ["photos", "settings", "share"] as const;
type Tab = (typeof tabs)[number];

type Props = {
  galleryId: string;
  initialTab?: Tab;
};

export function GalleryDetailContent({ galleryId, initialTab = "photos" }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const { data, mutate, isLoading } = useSWR<GetGalleryResponse>(
    `/api/galleries/${galleryId}`,
    jsonFetcher
  );

  if (isLoading || !data) {
    return <div className="py-10 text-sm text-muted-foreground">Loading gallery...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{data.gallery.title}</h1>
          <p className="text-muted-foreground">Manage photos, settings, and client sharing.</p>
        </div>
      </div>

      <div className="inline-flex rounded-lg border bg-muted p-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-md px-4 py-2 text-sm font-medium capitalize transition ${
              activeTab === tab ? "bg-background shadow-sm" : "text-muted-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "photos" && (
        <PhotosTab galleryId={galleryId} mutate={mutate} photos={data.gallery.photos} />
      )}
      {activeTab === "settings" && <SettingsTab galleryId={galleryId} mutate={mutate} data={data} />}
      {activeTab === "share" && <ShareTab data={data} />}
    </div>
  );
}

type PhotosTabProps = {
  galleryId: string;
  photos: GetGalleryResponse["gallery"]["photos"];
  mutate: () => Promise<GetGalleryResponse | undefined>;
};

function PhotosTab({ galleryId, photos, mutate }: PhotosTabProps) {
  const selected = useGalleryUiStore((state) => state.selectedByGallery[galleryId] ?? []);
  const toggleSelected = useGalleryUiStore((state) => state.toggleSelected);
  const clearSelected = useGalleryUiStore((state) => state.clearSelected);
  const setSelected = useGalleryUiStore((state) => state.setSelected);
  const uploadQueue = useGalleryUiStore((state) => state.uploadQueue);
  const upsertQueueItem = useGalleryUiStore((state) => state.upsertQueueItem);
  const clearCompletedUploads = useGalleryUiStore((state) => state.clearCompletedUploads);
  const [draggingPhotoId, setDraggingPhotoId] = useState<string | null>(null);

  async function uploadFiles(files: File[]) {
    for (const file of files) {
      const tempId = `upload-${file.name}-${Date.now()}`;
      upsertQueueItem({ id: tempId, fileName: file.name, progress: 5, status: "queued" });

      try {
        const presigned = await apiRequest<{
          uploadId: string;
          uploadUrl: string;
          confirmUrl: string;
        }>(`/api/galleries/${galleryId}/photos/presign`, {
          method: "POST",
          body: JSON.stringify({ fileName: file.name, fileType: file.type, size: file.size }),
        });

        upsertQueueItem({ id: tempId, fileName: file.name, progress: 20, status: "uploading" });

        await fetch(presigned.uploadUrl, {
          method: "PUT",
          body: file,
        });

        upsertQueueItem({ id: tempId, fileName: file.name, progress: 85, status: "confirming" });

        await apiRequest(presigned.confirmUrl, {
          method: "POST",
          body: JSON.stringify({ uploadId: presigned.uploadId, fileName: file.name }),
        });

        upsertQueueItem({ id: tempId, fileName: file.name, progress: 100, status: "done" });
      } catch (error) {
        upsertQueueItem({ id: tempId, fileName: file.name, progress: 100, status: "error" });
        toast.error(error instanceof Error ? error.message : "Upload failed");
      }
    }

    await mutate();
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: true,
    onDrop: uploadFiles,
  });

  async function deletePhoto(id: string) {
    try {
      await apiRequest(`/api/photos/${id}`, { method: "DELETE" });
      toast.success("Photo deleted");
      await mutate();
      setSelected(galleryId, selected.filter((photoId) => photoId !== id));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete photo");
    }
  }

  async function deleteSelected() {
    try {
      await Promise.all(selected.map((id) => apiRequest(`/api/photos/${id}`, { method: "DELETE" })));
      clearSelected(galleryId);
      await mutate();
      toast.success("Selected photos deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete selected photos");
    }
  }

  async function setAsCover() {
    if (selected.length === 0) {
      return;
    }

    await apiRequest(`/api/galleries/${galleryId}`, {
      method: "PATCH",
      body: JSON.stringify({ coverPhotoId: selected[0] }),
    });

    clearSelected(galleryId);
    await mutate();
    toast.success("Cover photo updated");
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
        items: orderedIds.map((photoId, index) => ({ photoId, order: index + 1 })),
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
            <input {...getInputProps()} />
            <UploadCloud className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium">Drag and drop files here, or click to browse</p>
            <p className="mt-1 text-xs text-muted-foreground">Supports multiple image files per upload.</p>
          </div>

          {uploadQueue.length > 0 && (
            <div className="mt-4 space-y-2 rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Upload Queue</p>
                <Button variant="ghost" size="sm" onClick={clearCompletedUploads}>
                  Clear done
                </Button>
              </div>

              {uploadQueue.map((item) => (
                <div key={item.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <p>{item.fileName}</p>
                    <p className="capitalize text-muted-foreground">{item.status}</p>
                  </div>
                  <Progress value={item.progress} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selected.length > 0 && (
        <div className="sticky top-0 z-20 flex items-center justify-between rounded-lg border bg-background p-3">
          <p className="text-sm font-medium">{selected.length} selected</p>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={setAsCover}>
              Set as Cover
            </Button>
            <Button size="sm" variant="destructive" onClick={deleteSelected}>
              Delete Selected
            </Button>
          </div>
        </div>
      )}

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
              <div className="relative">
                <img src={photo.url} alt="Gallery photo" className="h-auto w-full object-cover" />
                <div className="absolute left-2 top-2">
                  <Checkbox checked={isSelected} onCheckedChange={() => toggleSelected(galleryId, photo.id)} />
                </div>
              </div>

              <div className="flex items-center justify-between border-t p-2">
                <button
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground"
                  onMouseDown={(event) => event.preventDefault()}
                >
                  <GripVertical className="h-3 w-3" />
                  Drag
                </button>

                <Button variant="ghost" size="icon" onClick={() => void deletePhoto(photo.id)}>
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
  const [passwordEnabled, setPasswordEnabled] = useState(data.gallery.passwordEnabled);
  const [password, setPassword] = useState(data.gallery.password ?? "");
  const [isPublished, setIsPublished] = useState(data.gallery.isPublished);
  const [saving, setSaving] = useState(false);

  async function onSave() {
    setSaving(true);
    try {
      await apiRequest(`/api/galleries/${galleryId}`, {
        method: "PATCH",
        body: JSON.stringify({ title, slug, passwordEnabled, password, isPublished }),
      });
      await mutate();
      toast.success("Gallery settings updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update gallery");
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
            <Input id="gallery-title" value={title} onChange={(event) => setTitle(event.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" value={slug} onChange={(event) => setSlug(event.target.value)} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Enable password protection</p>
                <p className="text-xs text-muted-foreground">Require clients to enter a password.</p>
              </div>
              <Checkbox checked={passwordEnabled} onCheckedChange={(value) => setPasswordEnabled(Boolean(value))} />
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
              <p className="text-xs text-muted-foreground">Make this gallery visible through the share link.</p>
            </div>
            <Checkbox checked={isPublished} onCheckedChange={(value) => setIsPublished(Boolean(value))} />
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
            Deleting a gallery permanently removes all photos and queues S3 cleanup.
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
                  This action cannot be undone. All photos and links will stop working.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button variant="destructive" onClick={() => void deleteGallery()}>
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

function ShareTab({ data }: { data: GetGalleryResponse }) {
  const shareLink = useMemo(() => {
    if (typeof window === "undefined") {
      return `/gallery/${data.gallery.slug}`;
    }
    return `${window.location.origin}/gallery/${data.gallery.slug}`;
  }, [data.gallery.slug]);

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle>Share Link</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input readOnly value={shareLink} />
            <Button
              variant="outline"
              onClick={() => {
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
        <CardContent className="flex items-center justify-center">
          <QRCodeSVG value={shareLink} className="rounded-md border p-2" />
        </CardContent>
      </Card>
    </div>
  );
}
