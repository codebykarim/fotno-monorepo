"use client";

import {
  X,
  Type,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Trash2,
  Minus,
  Plus,
} from "lucide-react";

const FONT_OPTIONS = [
  { value: "Inter", label: "Inter" },
  { value: "Playfair Display", label: "Playfair Display" },
  { value: "Lora", label: "Lora" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Great Vibes", label: "Great Vibes" },
  { value: "Cormorant Garamond", label: "Cormorant Garamond" },
  { value: "Raleway", label: "Raleway" },
  { value: "Dancing Script", label: "Dancing Script" },
  { value: "Roboto", label: "Roboto" },
  { value: "Open Sans", label: "Open Sans" },
];

const COLOR_PRESETS = [
  "#FFFFFF",
  "#000000",
  "#D4AF37",
  "#8B7355",
  "#4A4A4A",
  "#C0C0C0",
  "#8B0000",
  "#1B3A4B",
];

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

interface TextOptionsProps {
  text: PageText;
  onUpdate: (updates: Partial<PageText>) => void;
  onDelete: () => void;
  onClose: () => void;
}

export function TextOptions({
  text,
  onUpdate,
  onDelete,
  onClose,
}: TextOptionsProps) {
  return (
    <div className="w-60 border-l flex-shrink-0 overflow-y-auto bg-background/95 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground/70">
          Text Options
        </h3>
        <button
          onClick={onClose}
          className="h-6 w-6 rounded-md hover:bg-accent flex items-center justify-center transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="p-4 space-y-5">
        {/* Content */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center">
              <Type className="h-3 w-3 text-primary" />
            </div>
            <span className="text-xs font-medium text-foreground">Content</span>
          </div>
          <textarea
            value={text.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            placeholder="Enter text..."
            rows={3}
            className="w-full rounded-lg border border-border/50 bg-muted/20 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 resize-none transition-all"
          />
        </div>

        {/* Font Family */}
        <div className="space-y-2.5">
          <span className="text-xs font-medium text-foreground">Font</span>
          <select
            value={text.fontFamily}
            onChange={(e) => onUpdate({ fontFamily: e.target.value })}
            className="w-full h-9 rounded-lg border border-border/50 bg-muted/20 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 cursor-pointer transition-all appearance-none"
            style={{ fontFamily: text.fontFamily }}
          >
            {FONT_OPTIONS.map((f) => (
              <option
                key={f.value}
                value={f.value}
                style={{ fontFamily: f.value }}
              >
                {f.label}
              </option>
            ))}
          </select>
          {/* Font preview */}
          <div
            className="rounded-lg bg-muted/30 border border-border/20 px-3 py-2 text-center"
            style={{ fontFamily: `"${text.fontFamily}", sans-serif` }}
          >
            <span className="text-sm text-foreground/80">Aa Bb Cc 123</span>
          </div>
        </div>

        {/* Font Size */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-foreground">Size</span>
            <span className="text-xs font-mono text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
              {text.fontSize}px
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                onUpdate({ fontSize: Math.max(12, text.fontSize - 2) })
              }
              className="h-7 w-7 rounded-md border border-border/40 bg-muted/20 flex items-center justify-center hover:bg-accent transition-colors"
            >
              <Minus className="h-3 w-3" />
            </button>
            <div className="flex-1 relative">
              <input
                type="range"
                min={12}
                max={120}
                step={2}
                value={text.fontSize}
                onChange={(e) =>
                  onUpdate({ fontSize: Number(e.target.value) })
                }
                className="w-full h-1.5 accent-primary cursor-pointer"
              />
            </div>
            <button
              onClick={() =>
                onUpdate({ fontSize: Math.min(120, text.fontSize + 2) })
              }
              className="h-7 w-7 rounded-md border border-border/40 bg-muted/20 flex items-center justify-center hover:bg-accent transition-colors"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Color */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center">
              <Palette className="h-3 w-3 text-primary" />
            </div>
            <span className="text-xs font-medium text-foreground">Color</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="color"
                value={text.color}
                onChange={(e) => onUpdate({ color: e.target.value })}
                className="h-9 w-9 rounded-lg cursor-pointer bg-transparent border-0 p-0"
              />
              <div
                className="absolute inset-0 rounded-lg border-2 border-border/40 pointer-events-none"
                style={{ backgroundColor: text.color }}
              />
            </div>
            <input
              type="text"
              value={text.color}
              onChange={(e) => {
                const v = e.target.value;
                if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) onUpdate({ color: v });
              }}
              className="flex-1 h-9 rounded-lg border border-border/40 bg-muted/20 px-3 text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 uppercase transition-all"
            />
          </div>
          {/* Quick color presets */}
          <div className="flex gap-1.5 flex-wrap">
            {COLOR_PRESETS.map((c) => (
              <button
                key={c}
                onClick={() => onUpdate({ color: c })}
                className={`h-6 w-6 rounded-full transition-all ${
                  text.color.toUpperCase() === c
                    ? "ring-2 ring-primary ring-offset-1 ring-offset-background scale-110"
                    : "ring-1 ring-border/30 hover:ring-border hover:scale-105"
                }`}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
        </div>

        {/* Alignment */}
        <div className="space-y-2.5">
          <span className="text-xs font-medium text-foreground">Alignment</span>
          <div className="grid grid-cols-3 gap-1.5">
            {(
              [
                { value: "left" as const, icon: AlignLeft },
                { value: "center" as const, icon: AlignCenter },
                { value: "right" as const, icon: AlignRight },
              ] as const
            ).map((opt) => (
              <button
                key={opt.value}
                onClick={() => onUpdate({ textAlign: opt.value })}
                className={`
                  h-9 rounded-lg text-[11px] font-medium transition-all flex items-center justify-center
                  ${
                    text.textAlign === opt.value
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted/30 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/30"
                  }
                `}
              >
                <opt.icon className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
        </div>

        {/* Vertical Position */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-foreground">
              Vertical Position
            </span>
            <span className="text-xs font-mono text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
              {Math.round(text.y)}%
            </span>
          </div>
          <input
            type="range"
            min={5}
            max={95}
            step={1}
            value={text.y}
            onChange={(e) => onUpdate({ y: Number(e.target.value) })}
            className="w-full h-1.5 accent-primary cursor-pointer"
          />
        </div>

        {/* Delete */}
        <button
          onClick={onDelete}
          className="w-full h-9 rounded-lg text-xs font-medium text-destructive-foreground bg-destructive/90 hover:bg-destructive transition-colors flex items-center justify-center gap-2"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Remove Text
        </button>
      </div>
    </div>
  );
}
