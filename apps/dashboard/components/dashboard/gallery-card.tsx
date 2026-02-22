"use client";

import Image from "next/image";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { toast } from "sonner";
import { GalleryListItem } from "@/lib/types/api";
import { GalleryStatusBadge } from "@/components/dashboard/gallery-status-badge";

type Props = {
  gallery: GalleryListItem;
  onDelete: (id: string) => Promise<void>;
};

export function GalleryCard({ gallery, onDelete }: Props) {
  const createdDate = new Date(gallery.createdAt).toLocaleDateString();

  return (
    <Card className="overflow-hidden">
      <Link href={`/galleries/${gallery.id}`}>
        <div className="relative aspect-[4/3] bg-muted">
          {gallery.coverPhotoUrl ? (
            <Image src={gallery.coverPhotoUrl} alt={gallery.title} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
              No cover photo
            </div>
          )}
        </div>
      </Link>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 space-y-1">
            <CardTitle className="truncate text-lg">{gallery.title}</CardTitle>
            <p className="text-xs text-muted-foreground">Created {createdDate}</p>
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
                  const link = `${window.location.origin}/gallery/${gallery.slug}`;
                  navigator.clipboard.writeText(link);
                  toast.success("Share link copied");
                }}
              >
                Share
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(gallery.id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="flex items-center justify-between pt-0">
        <p className="text-sm text-muted-foreground">{gallery.photoCount} photos</p>
        <GalleryStatusBadge status={gallery.status} />
      </CardContent>
    </Card>
  );
}
