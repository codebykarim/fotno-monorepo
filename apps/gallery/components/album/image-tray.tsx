"use client";

import { useCallback, useRef, useState } from "react";
import { Images } from "lucide-react";

interface Photo {
  id: string;
  thumbnailSrc: string;
  fileName?: string;
}

interface ImageTrayProps {
  photos: Photo[];
  usedPhotoIds?: Set<string>;
  onSelectPhoto?: (photoId: string) => void;
}

export function ImageTray({
  photos,
  usedPhotoIds,
  onSelectPhoto,
}: ImageTrayProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const lastClickedRef = useRef<number>(-1);

  const handleClick = useCallback(
    (photoId: string, index: number, e: React.MouseEvent) => {
      // Shift+click for range select
      if (e.shiftKey && lastClickedRef.current >= 0) {
        const start = Math.min(lastClickedRef.current, index);
        const end = Math.max(lastClickedRef.current, index);
        const range = new Set<string>();
        for (let i = start; i <= end; i++) {
          range.add(photos[i]!.id);
        }
        setSelectedIds(range);
        return;
      }

      // Normal click: select single + assign to slot
      setSelectedIds(new Set([photoId]));
      lastClickedRef.current = index;
      onSelectPhoto?.(photoId);
    },
    [photos, onSelectPhoto],
  );

  const handleDragStart = useCallback(
    (e: React.DragEvent, photoId: string) => {
      // If dragging a selected photo and multiple are selected, drag all
      const idsToTransfer =
        selectedIds.has(photoId) && selectedIds.size > 1
          ? Array.from(selectedIds)
          : [photoId];

      e.dataTransfer.setData(
        "application/x-photo-ids",
        JSON.stringify(idsToTransfer),
      );
      e.dataTransfer.setData("text/plain", photoId);
      e.dataTransfer.effectAllowed = "copy";

      // Create a small drag preview (64x64)
      const preview = document.createElement("div");
      preview.style.cssText =
        "width:64px;height:64px;border-radius:6px;overflow:hidden;position:absolute;top:-9999px;left:-9999px;background:#222";
      const img = document.createElement("img");
      img.src = photos.find((p) => p.id === photoId)?.thumbnailSrc || "";
      img.style.cssText = "width:100%;height:100%;object-fit:cover";
      preview.appendChild(img);
      document.body.appendChild(preview);
      e.dataTransfer.setDragImage(preview, 32, 32);
      requestAnimationFrame(() => document.body.removeChild(preview));
    },
    [selectedIds, photos],
  );

  if (photos.length === 0) {
    return (
      <div className="border-t border-border/50 bg-background/50 px-4 py-3 text-center text-xs text-muted-foreground">
        No photos in this gallery
      </div>
    );
  }

  return (
    <div className="border-t border-border/50 bg-background/80">
      <div className="flex items-center gap-2 px-4 py-1.5">
        <Images className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">
          Photos ({photos.length})
        </span>
        <span className="text-[10px] text-muted-foreground/60">
          Drag onto spread &middot; Shift+click to select range
        </span>
      </div>

      <div ref={scrollRef} className="overflow-x-auto px-4 pb-3">
        <div className="flex gap-2.5" style={{ minWidth: "max-content" }}>
          {photos.map((photo, index) => {
            const isUsed = usedPhotoIds?.has(photo.id);
            const isSelected = selectedIds.has(photo.id);

            return (
              <div
                key={photo.id}
                draggable
                onDragStart={(e) => handleDragStart(e, photo.id)}
                onClick={(e) => handleClick(photo.id, index, e)}
                className={`
                  relative flex-shrink-0 rounded-md cursor-grab active:cursor-grabbing
                  overflow-hidden transition-all duration-100 select-none
                  ${isSelected
                    ? "ring-2 ring-primary ring-offset-1 ring-offset-background scale-[1.03]"
                    : "ring-1 ring-border/40 hover:ring-primary/40"
                  }
                `}
                style={{ width: 140, height: 140 }}
                title={photo.fileName}
              >
                <img
                  src={photo.thumbnailSrc}
                  alt={photo.fileName || "photo"}
                  className="w-full h-full object-cover pointer-events-none"
                  draggable={false}
                />
                {isUsed && (
                  <div className="absolute top-1.5 right-1.5 w-3 h-3 rounded-full bg-green-500 border-2 border-background shadow-sm" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
