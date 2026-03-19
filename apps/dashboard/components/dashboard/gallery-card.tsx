"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Images, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { Input } from "@workspace/ui/components/input";
import { GalleryListItem } from "@/lib/types/api";
import { cn } from "@workspace/ui/lib/utils";

type Props = {
  gallery: GalleryListItem;
  onDelete: (id: string) => Promise<void>;
};

const GRID_SLOTS = 12;

export function GalleryCard({ gallery, onDelete }: Props) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteGalleryTitle, setDeleteGalleryTitle] = useState("");
  const galleryBaseUrl =
    process.env.NEXT_PUBLIC_GALLERY_URL ?? "http://localhost:3003";

  const urls = gallery.previewPhotoUrls ?? [];

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/5 hover:border-primary/25">
      <Link href={`/galleries/${gallery.id}`} className="block">
        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
          {urls.length > 0 ? (
            <div className="grid h-full w-full grid-cols-4 grid-rows-3 gap-px bg-border/30">
              {Array.from({ length: GRID_SLOTS }).map((_, i) => {
                const url = urls[i];
                return (
                  <div key={i} className="relative overflow-hidden bg-muted">
                    {url ? (
                      <Image
                        src={url}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 25vw, 10vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        unoptimized
                      />
                    ) : (
                      <div className="h-full w-full bg-muted/60" />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
              <Images className="h-8 w-8 opacity-30" />
              <span className="text-xs">No photos yet</span>
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      </Link>

      <div className="flex items-center justify-between gap-2 px-3.5 py-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Link
              href={`/galleries/${gallery.id}`}
              className="truncate text-sm font-medium hover:underline"
            >
              {gallery.title}
            </Link>
            <span
              className={cn(
                "inline-block h-2 w-2 shrink-0 rounded-full",
                gallery.status === "published" ? "bg-emerald-500" : "bg-zinc-400",
              )}
              title={gallery.status === "published" ? "Published" : "Draft"}
            />
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {gallery.photoCount} photo{gallery.photoCount !== 1 ? "s" : ""}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0 text-muted-foreground"
              aria-label="More actions"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem asChild>
              <Link href={`/galleries/${gallery.id}`}>Open</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/galleries/${gallery.id}/settings`}>Settings</Link>
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
              Copy share link
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
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
              Type &ldquo;{gallery.title}&rdquo; to confirm
            </p>
            <Input
              placeholder={gallery.title}
              value={deleteGalleryTitle}
              onChange={(e) => setDeleteGalleryTitle(e.target.value)}
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
              disabled={deleteGalleryTitle !== gallery.title}
              onClick={() => {
                setShowDeleteDialog(false);
                onDelete(gallery.id);
              }}
            >
              Delete gallery
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
