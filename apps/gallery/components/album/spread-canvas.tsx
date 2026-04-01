"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { ImagePlus } from "lucide-react";

interface Slot {
  photoId?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  cropX?: number;
  cropY?: number;
  cropWidth?: number;
  cropHeight?: number;
  rotation?: number;
}

interface PageText {
  id: string;
  content: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  x: number;
  y: number;
  textAlign: "left" | "center" | "right";
}

interface Photo {
  id: string;
  thumbnailSrc: string;
  previewSrc?: string;
  fileName?: string;
}

interface SpreadCanvasProps {
  layoutId: string;
  layoutDisplayName?: string;
  slots: Slot[];
  photos?: Photo[];
  isSpread?: boolean;
  /** Product page width in cm — controls aspect ratio */
  widthCm?: number;
  /** Product page height in cm — controls aspect ratio */
  heightCm?: number;
  onSlotUpdate: (slotIndex: number, updates: Partial<Slot>) => void;
  onSlotSelect?: (slotIndex: number) => void;
  selectedSlotIndex?: number | null;
  isReadOnly?: boolean;
  texts?: PageText[];
  selectedTextIndex?: number | null;
  onTextClick?: (textIndex: number) => void;
}

export function SpreadCanvas({
  layoutId,
  layoutDisplayName,
  slots,
  photos = [],
  isSpread = true,
  widthCm,
  heightCm,
  onSlotUpdate,
  onSlotSelect,
  selectedSlotIndex,
  isReadOnly = false,
  texts,
  selectedTextIndex,
  onTextClick,
}: SpreadCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);
  const [canvasScale, setCanvasScale] = useState(1);

  // Pan state: which slot is being panned, and the start position
  const [panningSlot, setPanningSlot] = useState<number | null>(null);
  const panStartRef = useRef({
    clientX: 0,
    clientY: 0,
    offsetX: 0,
    offsetY: 0,
  });

  const photoMap = new Map(photos.map((p) => [p.id, p]));

  // Track canvas size for text scaling
  useEffect(() => {
    if (!containerRef.current) return;
    const updateScale = () => {
      if (containerRef.current) {
        setCanvasScale(containerRef.current.clientHeight / 500);
      }
    };
    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // ─── Drag-and-drop from image tray ────────────────────────────────
  const handleDragOver = useCallback(
    (e: React.DragEvent, slotIndex: number) => {
      if (isReadOnly) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
      setDragOverSlot(slotIndex);
    },
    [isReadOnly],
  );

  const handleDragLeave = useCallback(() => {
    setDragOverSlot(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, slotIndex: number) => {
      if (isReadOnly) return;
      e.preventDefault();
      setDragOverSlot(null);

      const multiData = e.dataTransfer.getData("application/x-photo-ids");
      if (multiData) {
        try {
          const photoIds: string[] = JSON.parse(multiData);
          photoIds.forEach((pid, i) => {
            const targetIdx = slotIndex + i;
            if (targetIdx < slots.length) {
              onSlotUpdate(targetIdx, { photoId: pid });
            }
          });
          return;
        } catch {
          // fall through
        }
      }

      const photoId = e.dataTransfer.getData("text/plain");
      if (photoId) {
        onSlotUpdate(slotIndex, { photoId });
        onSlotSelect?.(slotIndex);
      }
    },
    [isReadOnly, slots.length, onSlotUpdate, onSlotSelect],
  );

  // ─── Pan / adjust: click-hold on a filled slot image to reposition ─
  const handlePanStart = useCallback(
    (e: React.MouseEvent, slotIndex: number) => {
      if (isReadOnly) return;
      const slot = slots[slotIndex];
      if (!slot?.photoId) return;
      // Only left button
      if (e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();

      onSlotSelect?.(slotIndex);
      setPanningSlot(slotIndex);
      panStartRef.current = {
        clientX: e.clientX,
        clientY: e.clientY,
        offsetX: slot.cropX ?? 50,
        offsetY: slot.cropY ?? 50,
      };
    },
    [isReadOnly, slots, onSlotSelect],
  );

  useEffect(() => {
    if (panningSlot === null) return;

    const handleMouseMove = (e: MouseEvent) => {
      const slot = slots[panningSlot];
      if (!slot) return;

      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const slotPxW = (slot.width / 100) * rect.width;
      const slotPxH = (slot.height / 100) * rect.height;

      const dx = e.clientX - panStartRef.current.clientX;
      const dy = e.clientY - panStartRef.current.clientY;

      const zoom = slot.cropWidth || 100;
      const s = zoom / 100;

      // Sensitivity: at higher zoom, reduce to keep visual speed consistent
      const sensitivity = 80 / s;

      // Drag right → posX increases → see right. Drag up → posY decreases → see top.
      const deltaX = -(dx / slotPxW) * sensitivity;
      const deltaY = -(dy / slotPxH) * sensitivity;

      // object-position: 0-100%, always valid, image always fills slot
      const newCropX = Math.max(
        0,
        Math.min(100, panStartRef.current.offsetX + deltaX),
      );
      const newCropY = Math.max(
        0,
        Math.min(100, panStartRef.current.offsetY + deltaY),
      );

      onSlotUpdate(panningSlot, { cropX: newCropX, cropY: newCropY });
    };

    const handleMouseUp = () => {
      setPanningSlot(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [panningSlot, slots, onSlotUpdate]);

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <div
        ref={containerRef}
        className="relative w-full bg-zinc-900 rounded-lg shadow-lg overflow-hidden"
        style={{
          aspectRatio:
            widthCm && heightCm
              ? isSpread
                ? `${widthCm * 2} / ${heightCm}`
                : `${widthCm} / ${heightCm}`
              : isSpread
                ? "2 / 1"
                : "3 / 4",
          maxWidth: isSpread ? "900px" : "400px",
        }}
      >
        {/* Center line for spreads */}
        {isSpread && (
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border/30 z-10 pointer-events-none" />
        )}

        {slots.map((slot, index) => {
          const photo = slot.photoId ? photoMap.get(slot.photoId) : null;
          const isSelected = selectedSlotIndex === index;
          const isDragTarget = dragOverSlot === index;
          const isPanning = panningSlot === index;
          const rotation = slot.rotation || 0;
          const zoom = slot.cropWidth || 100;
          const s = zoom / 100;
          // object-position 0-100, default 50 (center). Old data (0) → center.
          const posX = slot.cropX ?? 50;
          const posY = slot.cropY ?? 50;

          // Use preview quality for canvas, fallback to thumbnail
          const imgSrc = photo
            ? photo.previewSrc || photo.thumbnailSrc
            : undefined;

          return (
            <div
              key={index}
              className={`
                absolute overflow-hidden
                ${!isReadOnly && photo ? "cursor-grab" : !isReadOnly ? "cursor-pointer" : ""}
                ${isPanning ? "cursor-grabbing" : ""}
                ${
                  isSelected
                    ? "ring-2 ring-primary shadow-lg z-20"
                    : isDragTarget
                      ? "ring-2 ring-primary/70 z-20"
                      : "ring-1 ring-white/10 hover:ring-primary/40"
                }
              `}
              style={{
                left: `${slot.x}%`,
                top: `${slot.y}%`,
                width: `${slot.width}%`,
                height: `${slot.height}%`,
              }}
              onClick={() => {
                if (isReadOnly || panningSlot !== null) return;
                onSlotSelect?.(index);
              }}
              onMouseDown={(e) => {
                if (photo) handlePanStart(e, index);
              }}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
            >
              {photo && imgSrc ? (
                <img
                  src={imgSrc}
                  alt={photo.fileName || "Photo"}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
                  style={{
                    maxWidth: "none",
                    maxHeight: "none",
                    objectPosition: `${posX}% ${posY}%`,
                    transform:
                      [
                        zoom !== 100 ? `scale(${s})` : "",
                        rotation ? `rotate(${rotation}deg)` : "",
                      ]
                        .filter(Boolean)
                        .join(" ") || undefined,
                    // When zoomed, anchor scale to match pan so zoom-pan works in all directions
                    transformOrigin:
                      zoom !== 100 ? `${100 - posX}% ${100 - posY}%` : "center",
                  }}
                  draggable={false}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-white/5">
                  <ImagePlus className="h-6 w-6 text-muted-foreground/40 mb-1" />
                  <span className="text-[10px] text-muted-foreground/50">
                    {isDragTarget ? "Drop here" : "Drop image"}
                  </span>
                </div>
              )}

              {/* Selection overlay for empty slots */}
              {isSelected && !isReadOnly && !photo && (
                <div className="absolute inset-0 bg-primary/10 pointer-events-none" />
              )}
            </div>
          );
        })}

        {/* Text overlays */}
        {texts && texts.length > 0 && (
          <div className="absolute inset-0 pointer-events-none z-30">
            {texts.map((text, textIndex) => {
              const isTextSelected = selectedTextIndex === textIndex;
              const scaledFontSize = Math.max(10, text.fontSize * canvasScale);

              return (
                <div
                  key={text.id}
                  className={`
                    absolute pointer-events-auto cursor-pointer select-none
                    transition-shadow duration-150
                    ${isTextSelected ? "ring-2 ring-primary/80 ring-offset-2 ring-offset-transparent rounded" : "hover:ring-1 hover:ring-primary/30 rounded"}
                  `}
                  style={{
                    left: `${text.x}%`,
                    top: `${text.y}%`,
                    transform: "translate(-50%, -50%)",
                    width: "85%",
                    textAlign: text.textAlign,
                    fontFamily: `"${text.fontFamily}", sans-serif`,
                    fontSize: `${scaledFontSize}px`,
                    color: text.color,
                    lineHeight: 1.3,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    textShadow:
                      "0 1px 4px rgba(0,0,0,0.3), 0 0 2px rgba(0,0,0,0.2)",
                    padding: `${Math.max(4, canvasScale * 8)}px`,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTextClick?.(textIndex);
                  }}
                >
                  {text.content || (
                    <span className="opacity-40 italic">Click to edit...</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {layoutDisplayName && (
        <span className="text-[10px] text-muted-foreground/60">
          {layoutDisplayName}
        </span>
      )}
    </div>
  );
}
