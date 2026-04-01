"use client";

import { SpreadCanvas } from "./spread-canvas";
import type { DesignData } from "../../lib/album-types";

interface Photo {
  id: string;
  thumbnailSrc: string;
  previewSrc?: string;
  fileName?: string;
}

interface AlbumPreviewProps {
  designData: DesignData;
  photos?: Photo[];
  widthCm?: number;
  heightCm?: number;
}

export function AlbumPreview({ designData, photos = [], widthCm, heightCm }: AlbumPreviewProps) {
  return (
    <div className="space-y-6 w-full max-w-[900px] mx-auto max-h-[90vh] overflow-y-auto p-4">
      {designData.cover && (
        <div>
          <h2 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
            Cover
          </h2>
          <SpreadCanvas
            layoutId={designData.cover.layoutId}
            slots={designData.cover.slots || []}
            photos={photos}
            isSpread={false}
            widthCm={widthCm}
            heightCm={heightCm}
            onSlotUpdate={() => {}}
            isReadOnly
          />
        </div>
      )}

      {designData.firstPage && (
        <div>
          <h2 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
            First Page
          </h2>
          <SpreadCanvas
            layoutId={designData.firstPage.layoutId}
            slots={designData.firstPage.slots || []}
            photos={photos}
            isSpread={false}
            widthCm={widthCm}
            heightCm={heightCm}
            onSlotUpdate={() => {}}
            isReadOnly
            texts={designData.firstPage.texts}
          />
        </div>
      )}

      {designData.spreads && designData.spreads.length > 0 && (
        <div className="space-y-4">
          {designData.spreads.map((spread) => (
            <div key={spread.order}>
              <h2 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                Spread {spread.order + 1}
              </h2>
              <SpreadCanvas
                layoutId={spread.layoutId}
                slots={spread.slots || []}
                photos={photos}
                isSpread
                widthCm={widthCm}
                heightCm={heightCm}
                onSlotUpdate={() => {}}
                isReadOnly
              />
            </div>
          ))}
        </div>
      )}

      {designData.lastPage && (
        <div>
          <h2 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
            Last Page
          </h2>
          <SpreadCanvas
            layoutId={designData.lastPage.layoutId}
            slots={designData.lastPage.slots || []}
            photos={photos}
            isSpread={false}
            widthCm={widthCm}
            heightCm={heightCm}
            onSlotUpdate={() => {}}
            isReadOnly
            texts={designData.lastPage.texts}
          />
        </div>
      )}
    </div>
  );
}
