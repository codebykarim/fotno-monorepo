"use client";

import Image from "next/image";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { toast } from "sonner";
import { GalleryListItem } from "@/lib/types/api";
import { GalleryStatusBadge } from "@/components/dashboard/gallery-status-badge";
import { useState } from "react";

type Props = {
  gallery: GalleryListItem;
  onDelete: (id: string) => Promise<void>;
};

export function GalleryCard({ gallery, onDelete }: Props) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const createdDate = new Date(gallery.createdAt).toLocaleDateString();
  const galleryBaseUrl =
    process.env.NEXT_PUBLIC_GALLERY_URL ?? "http://localhost:3003";

  return (
    <Card className="group overflow-hidden border-border/70 bg-white/80 shadow-[0_16px_40px_-34px_rgba(2,6,23,0.8)] transition-transform duration-300 hover:-translate-y-0.5">
      <Link href={`/galleries/${gallery.id}`}>
        <div className="relative aspect-[4/3] bg-muted">
          {gallery.coverPhotoUrl ? (
            <Image
              src={gallery.coverPhotoUrl}
              alt={gallery.title}
              fill
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
              No cover photo
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
        </div>
      </Link>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 space-y-1">
            <CardTitle className="truncate text-lg">{gallery.title}</CardTitle>
            <p className="text-xs text-muted-foreground">
              Created {createdDate}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="More actions">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/galleries/${gallery.id}/settings`}>Edit</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  if (!gallery.isPublished) {
                    toast.error("Publish this gallery before sharing");
                    return;
                  }

                  const link = `${galleryBaseUrl.replace(/\/$/, "")}/${gallery.slug}`;
                  navigator.clipboard.writeText(link);
                  toast.success("Share link copied");
                }}
              >
                Share
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="flex items-center justify-between pt-0">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            {gallery.photoCount} photos
          </p>
          <p className="text-xs text-muted-foreground">
            Date: {gallery.eventDate ?? "-"} • Deadline:{" "}
            {gallery.deadline ?? "-"}
          </p>
        </div>
        <GalleryStatusBadge status={gallery.status} />
      </CardContent>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this gallery?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. All photos and links will stop
              working.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowDeleteDialog(false);
                onDelete(gallery.id);
              }}
            >
              Confirm delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
