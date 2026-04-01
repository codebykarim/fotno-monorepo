"use client";

import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Button } from "@workspace/ui/components/button";

interface Photo {
  id: string;
  thumbnailSrc: string;
  fileName?: string;
}

interface ImageSidebarProps {
  photos: Photo[];
  onSelectPhoto: (photoId: string) => void;
  selectedPhotoId?: string;
}

export function ImageSidebar({
  photos,
  onSelectPhoto,
  selectedPhotoId,
}: ImageSidebarProps) {
  if (photos.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
        No photos in this gallery
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-2 p-3">
        <h3 className="text-sm font-semibold px-1">Photos ({photos.length})</h3>
        <div className="grid grid-cols-2 gap-2">
          {photos.map((photo) => (
            <Button
              key={photo.id}
              variant={selectedPhotoId === photo.id ? "default" : "outline"}
              size="sm"
              className="h-auto p-0 overflow-hidden"
              onClick={() => onSelectPhoto(photo.id)}
              title={photo.fileName}
            >
              <img
                src={photo.thumbnailSrc}
                alt={photo.fileName || "photo"}
                className="w-full h-20 object-cover"
              />
            </Button>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}
