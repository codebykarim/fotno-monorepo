"use client";

import { Plus, X } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

interface PageData {
  layoutId: string;
  slots?: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    photoId?: string;
  }>;
}

interface PageNavigatorProps {
  cover?: PageData | null;
  firstPage?: PageData | null;
  spreads: Array<PageData & { order: number }>;
  lastPage?: PageData | null;
  selectedIndex: number | null;
  onSelectPage: (index: number | null) => void;
  onAddSpread?: () => void;
  onRemoveSpread?: (order: number) => void;
  onRemovePage?: (page: "cover" | "first" | "last") => void;
  onAddPage?: (page: "cover" | "first" | "last") => void;
  maxPages?: number;
  isReadOnly?: boolean;
}

function PageThumb({
  label,
  isSelected,
  isSpread,
  slots,
  onClick,
  onDelete,
}: {
  label: string;
  isSelected: boolean;
  isSpread?: boolean;
  slots?: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    photoId?: string;
  }>;
  onClick: () => void;
  onDelete?: () => void;
}) {
  const thumbWidth = isSpread ? 80 : 44;
  const thumbHeight = 44;

  return (
    <div className="relative group flex-shrink-0 p-1 mt-5">
      <button
        onClick={onClick}
        className={`
          flex flex-col items-center gap-1.5 p-1.5 rounded-lg transition-all
          ${
            isSelected
              ? "ring-2 ring-primary bg-primary/10"
              : "hover:bg-muted/60"
          }
        `}
      >
        {/* Mini page thumbnail with layout pattern */}
        <div
          className={`
            relative rounded overflow-hidden
            ${isSelected ? "border-2 border-primary" : "border border-border/60"}
            bg-muted/40
          `}
          style={{ width: thumbWidth, height: thumbHeight }}
        >
          {/* Render layout slot pattern */}
          {slots?.map((slot, i) => (
            <div
              key={i}
              className={`absolute ${
                slot.photoId
                  ? "bg-primary/30 border-primary/40"
                  : "bg-foreground/8 border-foreground/10"
              } border`}
              style={{
                left: `${slot.x}%`,
                top: `${slot.y}%`,
                width: `${slot.width}%`,
                height: `${slot.height}%`,
              }}
            />
          ))}

          {/* Center line for spreads */}
          {isSpread && (
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border/30 pointer-events-none" />
          )}
        </div>

        <span className="text-[10px] leading-none text-muted-foreground whitespace-nowrap">
          {label}
        </span>
      </button>

      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground
                     flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <X className="h-2.5 w-2.5" />
        </button>
      )}
    </div>
  );
}

function AddPageButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 p-1.5 flex-shrink-0 opacity-40 hover:opacity-80 transition-opacity"
    >
      <div className="w-[44px] h-[44px] rounded border border-dashed border-border/60 flex items-center justify-center">
        <Plus className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <span className="text-[10px] leading-none text-muted-foreground whitespace-nowrap">
        {label}
      </span>
    </button>
  );
}

export function PageNavigator({
  cover,
  firstPage,
  spreads,
  lastPage,
  selectedIndex,
  onSelectPage,
  onAddSpread,
  onRemoveSpread,
  onRemovePage,
  onAddPage,
  maxPages = 50,
  isReadOnly = false,
}: PageNavigatorProps) {
  const canAddSpread = spreads.length < maxPages;

  return (
    <div className="border-t border-border/50 bg-background/80 px-4 py-.5">
      <div className="flex items-center gap-2 overflow-x-auto">
        {/* Cover */}
        {cover ? (
          <PageThumb
            label="Cover"
            isSelected={selectedIndex === null}
            slots={cover.slots as any}
            onClick={() => onSelectPage(null)}
            onDelete={!isReadOnly ? () => onRemovePage?.("cover") : undefined}
          />
        ) : (
          !isReadOnly && (
            <AddPageButton label="Cover" onClick={() => onAddPage?.("cover")} />
          )
        )}

        {/* First Page */}
        {firstPage ? (
          <PageThumb
            label="First"
            isSelected={selectedIndex === -1}
            slots={firstPage.slots as any}
            onClick={() => onSelectPage(-1)}
            onDelete={!isReadOnly ? () => onRemovePage?.("first") : undefined}
          />
        ) : (
          !isReadOnly && (
            <AddPageButton label="First" onClick={() => onAddPage?.("first")} />
          )
        )}

        {/* Separator */}
        {(cover || firstPage) && spreads.length > 0 && (
          <div className="w-px h-10 bg-border/30 flex-shrink-0 mx-1" />
        )}

        {/* Spreads */}
        {spreads.map((spread) => (
          <PageThumb
            key={spread.order}
            label={`Spread ${spread.order + 1}`}
            isSelected={selectedIndex === spread.order}
            isSpread
            slots={spread.slots as any}
            onClick={() => onSelectPage(spread.order)}
            onDelete={
              !isReadOnly ? () => onRemoveSpread?.(spread.order) : undefined
            }
          />
        ))}

        {/* Add spread */}
        {!isReadOnly && canAddSpread && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onAddSpread}
            className="h-[60px] w-12 flex-shrink-0 rounded-lg border border-dashed border-border/50 hover:border-primary/50"
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}

        {/* Separator before last */}
        {spreads.length > 0 && (lastPage || !isReadOnly) && (
          <div className="w-px h-10 bg-border/30 flex-shrink-0 mx-1" />
        )}

        {/* Last Page */}
        {lastPage ? (
          <PageThumb
            label="Last"
            isSelected={selectedIndex === -2}
            slots={lastPage.slots as any}
            onClick={() => onSelectPage(-2)}
            onDelete={!isReadOnly ? () => onRemovePage?.("last") : undefined}
          />
        ) : (
          !isReadOnly && (
            <AddPageButton label="Last" onClick={() => onAddPage?.("last")} />
          )
        )}

        {spreads.length >= maxPages && (
          <span className="text-[10px] text-amber-500 flex-shrink-0 ml-2">
            Max spreads
          </span>
        )}
      </div>
    </div>
  );
}
