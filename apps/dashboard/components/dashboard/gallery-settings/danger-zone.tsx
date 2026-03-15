"use client";

import { useState } from "react";
import { mutate as mutateCache } from "swr";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { apiRequest } from "@/lib/api/client";
import { GetGalleryResponse } from "@/lib/types/api";

type Props = {
  galleryId: string;
  data: GetGalleryResponse;
};

export function DangerZone({ galleryId, data }: Props) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");

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
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-destructive">
          Danger Zone
        </h3>
        <p className="text-sm text-muted-foreground">
          Irreversible actions for this gallery.
        </p>
      </div>

      <section className="space-y-4 rounded-xl border border-destructive/15 bg-destructive/5 p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          <div>
            <h4 className="text-sm font-medium">Delete Gallery</h4>
            <p className="text-xs text-muted-foreground">
              Permanently removes all photos and queues S3 cleanup. This cannot
              be undone.
            </p>
          </div>
        </div>

        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogTrigger asChild>
            <Button variant="destructive" size="sm">
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
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Type &ldquo;{data.gallery.title}&rdquo; to confirm
              </p>
              <Input
                placeholder={data.gallery.title}
                value={confirmTitle}
                onChange={(e) => setConfirmTitle(e.target.value)}
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
                disabled={confirmTitle !== data.gallery.title}
                onClick={() => {
                  setShowDeleteDialog(false);
                  deleteGallery();
                }}
              >
                Delete gallery
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
    </div>
  );
}
