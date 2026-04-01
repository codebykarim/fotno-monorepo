"use client";

import { useEffect, useRef, useState } from "react";
import type {
  DesignSnapshot,
  DesignSlot,
  PageLayout,
  PageText,
} from "@/lib/types/smart-album";

// Google Fonts URL — must match the gallery app's font list
const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Playfair+Display&family=Lora&family=Montserrat&family=Great+Vibes&family=Cormorant+Garamond&family=Raleway&family=Dancing+Script&family=Roboto&family=Open+Sans&display=swap";

// ─── Single page/spread renderer ─────────────────────────────────────

interface SpreadPreviewProps {
  page: PageLayout;
  photoUrls: Record<string, string>;
  label: string;
  isSpread: boolean;
  widthCm?: number;
  heightCm?: number;
}

function SpreadPreview({
  page,
  photoUrls,
  label,
  isSpread,
  widthCm,
  heightCm,
}: SpreadPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasScale, setCanvasScale] = useState(1);

  // Track canvas size for text scaling (same logic as gallery SpreadCanvas)
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

  return (
    <div>
      <h3 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
        {label}
      </h3>
      <div className="flex justify-center">
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

          {/* Slots */}
          {(page.slots || []).map((slot: DesignSlot, i: number) => {
            const url = slot.photoId ? photoUrls[slot.photoId] : undefined;
            const rotation = slot.rotation || 0;
            const zoom = slot.cropWidth || 100;
            const s = zoom / 100;
            const posX = slot.cropX ?? 50;
            const posY = slot.cropY ?? 50;

            return (
              <div
                key={i}
                className="absolute overflow-hidden ring-1 ring-white/10"
                style={{
                  left: `${slot.x}%`,
                  top: `${slot.y}%`,
                  width: `${slot.width}%`,
                  height: `${slot.height}%`,
                }}
              >
                {url ? (
                  <img
                    src={url}
                    alt=""
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
                      transformOrigin:
                        zoom !== 100
                          ? `${100 - posX}% ${100 - posY}%`
                          : "center",
                    }}
                    loading="lazy"
                    draggable={false}
                  />
                ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center">
                    <span className="text-xs text-muted-foreground/50">
                      Empty
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          {/* Text overlays */}
          {page.texts && page.texts.length > 0 && (
            <div className="absolute inset-0 pointer-events-none z-30">
              {page.texts.map((text: PageText) => {
                const scaledFontSize = Math.max(
                  10,
                  text.fontSize * canvasScale,
                );
                return (
                  <div
                    key={text.id}
                    className="absolute select-none"
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
                  >
                    {text.content}
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty page state */}
          {(!page.slots || page.slots.length === 0) && (
            <div className="w-full h-full flex items-center justify-center bg-muted/30">
              <span className="text-xs text-muted-foreground">No layout</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Full album viewer ───────────────────────────────────────────────

interface AlbumPreviewViewerProps {
  designSnapshot: DesignSnapshot;
  photoUrls: Record<string, string>;
  widthCm?: number;
  heightCm?: number;
}

export function AlbumPreviewViewer({
  designSnapshot,
  photoUrls,
  widthCm,
  heightCm,
}: AlbumPreviewViewerProps) {
  // Load Google Fonts for text overlays
  useEffect(() => {
    if (document.querySelector(`link[href="${GOOGLE_FONTS_URL}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = GOOGLE_FONTS_URL;
    document.head.appendChild(link);
  }, []);

  return (
    <div className="space-y-6 max-w-[900px] mx-auto">
      {designSnapshot.cover && (
        <SpreadPreview
          page={designSnapshot.cover}
          photoUrls={photoUrls}
          label="Cover"
          isSpread={false}
          widthCm={widthCm}
          heightCm={heightCm}
        />
      )}

      {designSnapshot.firstPage && (
        <SpreadPreview
          page={designSnapshot.firstPage}
          photoUrls={photoUrls}
          label="First Page"
          isSpread={false}
          widthCm={widthCm}
          heightCm={heightCm}
        />
      )}

      {(designSnapshot.spreads || []).map((spread) => (
        <SpreadPreview
          key={spread.order}
          page={spread}
          photoUrls={photoUrls}
          label={`Spread ${spread.order + 1}`}
          isSpread={true}
          widthCm={widthCm}
          heightCm={heightCm}
        />
      ))}

      {designSnapshot.lastPage && (
        <SpreadPreview
          page={designSnapshot.lastPage}
          photoUrls={photoUrls}
          label="Last Page"
          isSpread={false}
          widthCm={widthCm}
          heightCm={heightCm}
        />
      )}
    </div>
  );
}
