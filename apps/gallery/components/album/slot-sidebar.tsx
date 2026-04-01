"use client";

import {
  X,
  RotateCcw,
  ZoomIn,
  Trash2,
  Minus,
  Plus,
} from "lucide-react";

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

interface SlotSidebarProps {
  slot: Slot;
  slotIndex: number;
  onUpdate: (slotIndex: number, updates: Partial<Slot>) => void;
  onClose: () => void;
}

export function SlotSidebar({
  slot,
  slotIndex,
  onUpdate,
  onClose,
}: SlotSidebarProps) {
  const rotation = slot.rotation || 0;
  const zoom = slot.cropWidth || 100;

  return (
    <div className="w-60 border-l flex-shrink-0 overflow-y-auto bg-background/95 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground/70">
          Adjustments
        </h3>
        <button
          onClick={onClose}
          className="h-6 w-6 rounded-md hover:bg-accent flex items-center justify-center transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Zoom Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center">
                <ZoomIn className="h-3 w-3 text-primary" />
              </div>
              <span className="text-xs font-medium text-foreground">Zoom</span>
            </div>
            <span className="text-xs font-mono text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
              {Math.round(zoom)}%
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                onUpdate(slotIndex, {
                  cropWidth: Math.max(100, zoom - 10),
                })
              }
              className="h-7 w-7 rounded-md border border-border/40 bg-muted/20 flex items-center justify-center hover:bg-accent transition-colors"
            >
              <Minus className="h-3 w-3" />
            </button>
            <input
              type="range"
              min={100}
              max={250}
              step={5}
              value={zoom}
              onChange={(e) =>
                onUpdate(slotIndex, { cropWidth: Number(e.target.value) })
              }
              className="flex-1 h-1.5 accent-primary cursor-pointer"
            />
            <button
              onClick={() =>
                onUpdate(slotIndex, {
                  cropWidth: Math.min(250, zoom + 10),
                })
              }
              className="h-7 w-7 rounded-md border border-border/40 bg-muted/20 flex items-center justify-center hover:bg-accent transition-colors"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          {zoom !== 100 && (
            <button
              onClick={() =>
                onUpdate(slotIndex, { cropWidth: 100, cropX: 50, cropY: 50 })
              }
              className="w-full text-[10px] text-muted-foreground hover:text-foreground transition-colors py-1"
            >
              Reset to 100%
            </button>
          )}
        </div>

        {/* Rotation Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center">
              <RotateCcw className="h-3 w-3 text-primary" />
            </div>
            <span className="text-xs font-medium text-foreground">
              Rotation
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {[0, 90, 180, 270].map((deg) => (
              <button
                key={deg}
                onClick={() => onUpdate(slotIndex, { rotation: deg })}
                className={`
                  h-8 rounded-lg text-[11px] font-medium transition-all
                  ${
                    rotation === deg
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted/30 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/30"
                  }
                `}
              >
                {deg}&deg;
              </button>
            ))}
          </div>
        </div>

        {/* Hint */}
        <div className="rounded-lg bg-muted/20 border border-border/20 px-3 py-2.5">
          <p className="text-[10px] text-muted-foreground/80 leading-relaxed">
            Drag the image on the canvas to adjust its position within the
            frame. Zoom in for more adjustment range.
          </p>
        </div>

        {/* Remove */}
        <button
          onClick={() => {
            onUpdate(slotIndex, {
              photoId: undefined,
              cropX: 50,
              cropY: 50,
              cropWidth: 100,
              rotation: 0,
            });
            onClose();
          }}
          className="w-full h-9 rounded-lg text-xs font-medium text-destructive-foreground bg-destructive/90 hover:bg-destructive transition-colors flex items-center justify-center gap-2"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Remove Image
        </button>
      </div>
    </div>
  );
}
