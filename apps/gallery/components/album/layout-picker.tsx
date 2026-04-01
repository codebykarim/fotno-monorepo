"use client";

import { ScrollArea } from "@workspace/ui/components/scroll-area";

interface Layout {
  id: string;
  name: string;
  displayName?: string;
  category: string;
  slots: Array<{ x: number; y: number; width: number; height: number }>;
}

interface LayoutPickerProps {
  layouts: {
    cover: Layout[];
    singlePage: Layout[];
    spreads: Layout[];
  };
  selectedLayoutId?: string;
  onSelectLayout: (layoutId: string) => void;
  category?: "cover" | "single" | "spread";
}

export function LayoutPicker({
  layouts,
  selectedLayoutId,
  onSelectLayout,
  category = "spread",
}: LayoutPickerProps) {
  const currentLayouts =
    category === "cover"
      ? layouts.cover
      : category === "single"
        ? layouts.singlePage
        : layouts.spreads;

  const isSpreadView = category === "spread";

  return (
    <div className="flex flex-col h-full">
      <div className="pb-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Layouts
        </h3>
      </div>

      <ScrollArea className="flex-1">
        <div className="grid grid-cols-2 gap-2.5 pr-2">
          {currentLayouts.map((layout) => {
            const isSelected = selectedLayoutId === layout.id;

            return (
              <button
                key={layout.id}
                onClick={() => onSelectLayout(layout.id)}
                className={`
                  group p-2 rounded-lg border transition-all text-left
                  ${isSelected
                    ? "border-primary bg-primary/10 ring-1 ring-primary"
                    : "border-border/50 hover:border-primary/50 hover:bg-muted/50"
                  }
                `}
              >
                {/* Visual preview */}
                <div
                  className="relative w-full bg-muted/80 rounded overflow-hidden"
                  style={{ aspectRatio: isSpreadView ? "2 / 1" : "3 / 4" }}
                >
                  {layout.slots.map((slot, idx) => (
                    <div
                      key={idx}
                      className={`absolute ${
                        isSelected
                          ? "bg-primary/25 border-primary/50"
                          : "bg-foreground/10 border-foreground/15 group-hover:bg-primary/15 group-hover:border-primary/30"
                      } border`}
                      style={{
                        left: `${slot.x}%`,
                        top: `${slot.y}%`,
                        width: `${slot.width}%`,
                        height: `${slot.height}%`,
                      }}
                    />
                  ))}
                </div>

                {/* Full label — 2 lines max */}
                <div
                  className={`mt-1.5 text-[10px] leading-snug text-center ${
                    isSelected
                      ? "text-primary font-medium"
                      : "text-muted-foreground group-hover:text-foreground"
                  }`}
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {layout.displayName || layout.name}
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
