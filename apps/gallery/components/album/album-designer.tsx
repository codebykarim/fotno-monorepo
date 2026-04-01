"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Separator } from "@workspace/ui/components/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { Badge } from "@workspace/ui/components/badge";
import {
  Undo2,
  Redo2,
  Eye,
  Send,
  MessageSquare,
  ArrowLeft,
  Pencil,
  Type,
} from "lucide-react";
import { useAlbumDesigner } from "../../lib/album-store";
import { ProductSelector } from "./product-selector";
import { SpreadCanvas } from "./spread-canvas";
import { ImageTray } from "./image-tray";
import { LayoutPicker } from "./layout-picker";
import { PageNavigator } from "./page-navigator";
import { AlbumPreview } from "./album-preview";
import type {
  SmartAlbumDesign,
  DesignData,
  PageText,
} from "../../lib/album-types";
import { SlotSidebar } from "./slot-sidebar";
import { TextOptions } from "./text-options";
import { StatusBadge } from "./status-badge";

// Google Fonts URL for text feature
const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Playfair+Display&family=Lora&family=Montserrat&family=Great+Vibes&family=Cormorant+Garamond&family=Raleway&family=Dancing+Script&family=Roboto&family=Open+Sans&display=swap";

interface Product {
  id: string;
  name: string;
  size: string;
  coverType: string;
  paperType: string;
  maxPages: number;
  priceCents: number;
  currency: string;
}

interface LayoutItem {
  id: string;
  name: string;
  displayName?: string;
  category: string;
  slots: Array<{ x: number; y: number; width: number; height: number }>;
}

interface Layouts {
  cover: LayoutItem[];
  singlePage: LayoutItem[];
  spreads: LayoutItem[];
}

interface Photo {
  id: string;
  thumbnailSrc: string;
  previewSrc?: string;
  fileName?: string;
}

interface AlbumDesignerProps {
  design: SmartAlbumDesign;
  products: Product[];
  layouts: Layouts;
  photos: Photo[];
  photographerNotes?: string | null;
  shareToken: string;
  designId: string;
  onPreview: () => void;
  onSubmit: () => void;
  onBack?: () => void;
  isSubmitting?: boolean;
}

export function AlbumDesigner({
  design: initialDesign,
  products,
  layouts,
  photos,
  photographerNotes,
  shareToken,
  designId,
  onPreview,
  onSubmit,
  onBack,
  isSubmitting = false,
}: AlbumDesignerProps) {
  // ─── ALL hooks must come before any early returns ───────────────────

  // Store subscriptions
  const currentDesign = useAlbumDesigner((s) => s.currentDesign);
  const selectedSpreadIndex = useAlbumDesigner((s) => s.selectedSpreadIndex);
  const selectedSlotIndex = useAlbumDesigner((s) => s.selectedSlotIndex);
  const saveStatus = useAlbumDesigner((s) => s.saveStatus);
  const isDirty = useAlbumDesigner((s) => s.isDirty);
  const historyIndex = useAlbumDesigner((s) => s.historyIndex);
  const historyLength = useAlbumDesigner((s) => s.history.length);

  const setCurrentDesign = useAlbumDesigner((s) => s.setCurrentDesign);
  const setSelectedSpreadIndex = useAlbumDesigner(
    (s) => s.setSelectedSpreadIndex,
  );
  const setSelectedSlotIndex = useAlbumDesigner((s) => s.setSelectedSlotIndex);
  const updateDesignData = useAlbumDesigner((s) => s.updateDesignData);
  const updateTitle = useAlbumDesigner((s) => s.updateTitle);
  const saveImmediate = useAlbumDesigner((s) => s.saveImmediate);
  const undo = useAlbumDesigner((s) => s.undo);
  const redo = useAlbumDesigner((s) => s.redo);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState("");
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Text editing state
  const [selectedTextIndex, setSelectedTextIndex] = useState<number | null>(
    null,
  );

  // Load Google Fonts for text feature
  useEffect(() => {
    const existing = document.querySelector(
      `link[href="${GOOGLE_FONTS_URL}"]`,
    );
    if (!existing) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = GOOGLE_FONTS_URL;
      document.head.appendChild(link);
    }
  }, []);

  // Flatten all layouts for lookups
  const allLayouts = useMemo(
    () => [
      ...(layouts.cover || []),
      ...(layouts.singlePage || []),
      ...(layouts.spreads || []),
    ],
    [layouts],
  );

  // Helper: get template slots for a layout ID
  const getTemplateSlots = useCallback(
    (layoutId: string) => {
      const template = allLayouts.find((l) => l.id === layoutId);
      return (template?.slots || []).map((s) => ({
        x: s.x,
        y: s.y,
        width: s.width,
        height: s.height,
      }));
    },
    [allLayouts],
  );

  // Helper: get display name for a layout ID
  const getLayoutDisplayName = useCallback(
    (layoutId?: string) => {
      if (!layoutId) return undefined;
      const found = allLayouts.find((l) => l.id === layoutId);
      return found?.displayName || found?.name;
    },
    [allLayouts],
  );

  // Initialize store + migrate empty slots
  const initializedRef = useRef<string | null>(null);
  useEffect(() => {
    if (initialDesign.id !== initializedRef.current) {
      initializedRef.current = initialDesign.id;

      // Migrate: populate empty slots from layout templates
      const dd = initialDesign.designData as DesignData;
      const populatePage = (
        page: any | null | undefined,
      ): any | null | undefined => {
        if (!page || (page.slots && page.slots.length > 0)) return page;
        const template = allLayouts.find((l) => l.id === page.layoutId);
        if (!template) return page;
        return {
          ...page,
          slots: template.slots.map((s) => ({
            x: s.x,
            y: s.y,
            width: s.width,
            height: s.height,
          })),
        };
      };

      const migratedData: DesignData = {
        cover: populatePage(dd.cover) ?? undefined,
        firstPage: populatePage(dd.firstPage) ?? undefined,
        spreads: (dd.spreads || []).map((s) => ({
          ...populatePage(s)!,
          order: s.order,
        })),
        lastPage: populatePage(dd.lastPage) ?? undefined,
      };

      setCurrentDesign({
        ...initialDesign,
        designData: migratedData,
      });
    }
  }, [initialDesign, setCurrentDesign, allLayouts]);

  // Derived state (computed before hooks that depend on it)
  const designData = currentDesign?.designData as DesignData | undefined;
  const designStatus = (currentDesign?.status ||
    initialDesign.status) as string;
  const isLocked = designStatus === "SUBMITTED" || designStatus === "APPROVED";
  const isAlbumsDisabled = products.length === 0;

  // Compute currentSpread BEFORE the callbacks that reference it
  const currentSpread = useMemo(() => {
    if (!designData) return undefined;
    if (selectedSpreadIndex === null) return designData.cover ?? undefined;
    if (selectedSpreadIndex === -1) return designData.firstPage ?? undefined;
    if (selectedSpreadIndex === -2) return designData.lastPage ?? undefined;
    return designData.spreads?.[selectedSpreadIndex];
  }, [designData, selectedSpreadIndex]);

  const isCurrentSpread =
    selectedSpreadIndex !== null &&
    selectedSpreadIndex !== -1 &&
    selectedSpreadIndex !== -2;

  const showTextFeature =
    selectedSpreadIndex === -1 || selectedSpreadIndex === -2;

  const layoutCategory =
    selectedSpreadIndex === null
      ? ("cover" as const)
      : isCurrentSpread
        ? ("spread" as const)
        : ("single" as const);

  // Editable title
  const startEditingTitle = useCallback(() => {
    if (isLocked) return;
    setTitleValue(currentDesign?.title || "");
    setIsEditingTitle(true);
    setTimeout(() => titleInputRef.current?.select(), 0);
  }, [currentDesign?.title, isLocked]);

  const saveTitle = useCallback(() => {
    const trimmed = titleValue.trim();
    if (trimmed && trimmed !== currentDesign?.title) {
      updateTitle(trimmed);
    }
    setIsEditingTitle(false);
  }, [titleValue, currentDesign?.title, updateTitle]);

  // Collect all used photo IDs for the "used" indicator in the tray
  const usedPhotoIds = useMemo(() => {
    if (!designData) return new Set<string>();
    const ids = new Set<string>();
    const collectSlots = (slots?: Array<{ photoId?: string }>) =>
      slots?.forEach((s) => s.photoId && ids.add(s.photoId));
    collectSlots(designData.cover?.slots);
    collectSlots(designData.firstPage?.slots);
    collectSlots(designData.lastPage?.slots);
    designData.spreads?.forEach((sp) => collectSlots(sp.slots));
    return ids;
  }, [designData]);

  // ─── Text management ───────────────────────────────────────────────
  const updatePageTexts = useCallback(
    (texts: PageText[]) => {
      if (!designData) return;
      const newDesignData = { ...designData } as DesignData;

      if (selectedSpreadIndex === -1 && newDesignData.firstPage) {
        newDesignData.firstPage = { ...newDesignData.firstPage, texts };
      } else if (selectedSpreadIndex === -2 && newDesignData.lastPage) {
        newDesignData.lastPage = { ...newDesignData.lastPage, texts };
      }

      updateDesignData(newDesignData);
    },
    [designData, selectedSpreadIndex, updateDesignData],
  );

  const handleAddText = useCallback(() => {
    if (!currentSpread) return;
    const newText: PageText = {
      id: crypto.randomUUID(),
      content: "Your text here",
      fontFamily: "Playfair Display",
      fontSize: 36,
      color: "#FFFFFF",
      x: 50,
      y: 50,
      textAlign: "center",
    };
    const texts = [...(currentSpread.texts || []), newText];
    updatePageTexts(texts);
    setSelectedTextIndex(texts.length - 1);
    setSelectedSlotIndex(null);
  }, [currentSpread, updatePageTexts, setSelectedSlotIndex]);

  const handleTextUpdate = useCallback(
    (updates: Partial<PageText>) => {
      if (selectedTextIndex === null || !currentSpread) return;
      const texts = [...(currentSpread.texts || [])];
      if (!texts[selectedTextIndex]) return;
      texts[selectedTextIndex] = { ...texts[selectedTextIndex], ...updates };
      updatePageTexts(texts);
    },
    [selectedTextIndex, currentSpread, updatePageTexts],
  );

  const handleDeleteText = useCallback(() => {
    if (selectedTextIndex === null || !currentSpread) return;
    const texts = (currentSpread.texts || []).filter(
      (_, i) => i !== selectedTextIndex,
    );
    updatePageTexts(texts);
    setSelectedTextIndex(null);
  }, [selectedTextIndex, currentSpread, updatePageTexts]);

  // When selecting a slot, deselect text (and vice versa)
  const handleSlotSelect = useCallback(
    (slotIndex: number) => {
      setSelectedSlotIndex(slotIndex);
      setSelectedTextIndex(null);
    },
    [setSelectedSlotIndex],
  );

  const handleTextClick = useCallback(
    (textIndex: number) => {
      setSelectedTextIndex(textIndex);
      setSelectedSlotIndex(null);
    },
    [setSelectedSlotIndex],
  );

  // ─── Save before preview / submit ──────────────────────────────────
  const handlePreview = useCallback(async () => {
    if (isDirty) {
      await saveImmediate(shareToken, designId);
    }
    onPreview();
  }, [isDirty, saveImmediate, shareToken, designId, onPreview]);

  const handleSubmit = useCallback(async () => {
    if (isDirty) {
      await saveImmediate(shareToken, designId);
    }
    onSubmit();
  }, [isDirty, saveImmediate, shareToken, designId, onSubmit]);

  // Reset text selection when changing pages
  useEffect(() => {
    setSelectedTextIndex(null);
  }, [selectedSpreadIndex]);

  // ─── End of hooks — early return is safe here ─────────────────────

  if (!designData) {
    return <div className="p-4 text-center">Loading design...</div>;
  }

  const handleSlotUpdate = (
    slotIndex: number,
    updates: Record<string, any>,
  ) => {
    if (!currentSpread) return;

    const updatedSlots = [...(currentSpread.slots || [])] as any[];
    updatedSlots[slotIndex] = {
      ...updatedSlots[slotIndex],
      ...updates,
    };

    const newDesignData = { ...designData } as DesignData;

    if (selectedSpreadIndex === null && newDesignData.cover) {
      newDesignData.cover = { ...newDesignData.cover, slots: updatedSlots };
    } else if (selectedSpreadIndex === -1 && newDesignData.firstPage) {
      newDesignData.firstPage = {
        ...newDesignData.firstPage,
        slots: updatedSlots,
      };
    } else if (selectedSpreadIndex === -2 && newDesignData.lastPage) {
      newDesignData.lastPage = {
        ...newDesignData.lastPage,
        slots: updatedSlots,
      };
    } else if (
      typeof selectedSpreadIndex === "number" &&
      selectedSpreadIndex >= 0 &&
      newDesignData.spreads?.[selectedSpreadIndex]
    ) {
      newDesignData.spreads = newDesignData.spreads.map((s, i) =>
        i === selectedSpreadIndex ? { ...s, slots: updatedSlots } : s,
      );
    }

    updateDesignData(newDesignData);
  };

  const selectedProduct = products.find(
    (p) => p.id === currentDesign?.productId,
  );
  const maxSpreads = selectedProduct?.maxPages ?? 50;

  // ─── Add / Remove spreads ─────────────────────────────────────────
  const handleAddSpread = () => {
    const currentSpreads = designData.spreads || [];
    if (currentSpreads.length >= maxSpreads) return;

    const templateId = layouts.spreads[0]?.id || "spread-full-bleed";
    const templateSlots = getTemplateSlots(templateId);

    const newSpreads = [...currentSpreads];
    const newOrder = newSpreads.length;
    newSpreads.push({
      order: newOrder,
      layoutId: templateId,
      slots: templateSlots as any,
    });

    updateDesignData({ ...designData, spreads: newSpreads } as DesignData);
    setSelectedSpreadIndex(newOrder);
  };

  const handleRemoveSpread = (order: number) => {
    const newSpreads = (designData.spreads || [])
      .filter((s) => s.order !== order)
      .map((s, i) => ({ ...s, order: i }));

    updateDesignData({ ...designData, spreads: newSpreads } as DesignData);
    if (selectedSpreadIndex === order) {
      setSelectedSpreadIndex(
        newSpreads.length > 0 ? 0 : designData.cover ? null : -1,
      );
    }
  };

  // ─── Remove / Add special pages (cover, first, last) ─────────────
  const handleRemovePage = (page: "cover" | "first" | "last") => {
    const newDesignData = { ...designData } as DesignData;
    if (page === "cover") {
      newDesignData.cover = null;
      if (selectedSpreadIndex === null)
        setSelectedSpreadIndex(
          designData.firstPage ? -1 : designData.spreads?.length ? 0 : -2,
        );
    } else if (page === "first") {
      newDesignData.firstPage = null;
      if (selectedSpreadIndex === -1)
        setSelectedSpreadIndex(designData.cover ? null : 0);
    } else {
      newDesignData.lastPage = null;
      if (selectedSpreadIndex === -2) {
        const spreads = designData.spreads || [];
        setSelectedSpreadIndex(spreads.length > 0 ? spreads.length - 1 : null);
      }
    }
    updateDesignData(newDesignData);
  };

  const handleAddPage = (page: "cover" | "first" | "last") => {
    const newDesignData = { ...designData } as DesignData;
    if (page === "cover") {
      const layoutId = layouts.cover[0]?.id || "cover-full-bleed";
      newDesignData.cover = {
        layoutId,
        slots: getTemplateSlots(layoutId) as any,
      };
      setSelectedSpreadIndex(null);
    } else if (page === "first") {
      const layoutId = layouts.singlePage[0]?.id || "single-centered";
      newDesignData.firstPage = {
        layoutId,
        slots: getTemplateSlots(layoutId) as any,
      };
      setSelectedSpreadIndex(-1);
    } else {
      const layoutId = layouts.singlePage[0]?.id || "single-centered";
      newDesignData.lastPage = {
        layoutId,
        slots: getTemplateSlots(layoutId) as any,
      };
      setSelectedSpreadIndex(-2);
    }
    updateDesignData(newDesignData);
  };

  // ─── Select layout: populate slots from template ──────────────────
  const handleSelectLayout = (layoutId: string) => {
    const templateSlots = getTemplateSlots(layoutId);

    const existingSlots = currentSpread?.slots || [];
    const newSlots = templateSlots.map((ts, i) => ({
      ...ts,
      photoId: (existingSlots[i] as any)?.photoId || undefined,
    }));

    const newDesignData = { ...designData } as DesignData;

    if (selectedSpreadIndex === null && newDesignData.cover) {
      newDesignData.cover = { layoutId, slots: newSlots as any };
    } else if (selectedSpreadIndex === -1 && newDesignData.firstPage) {
      newDesignData.firstPage = {
        layoutId,
        slots: newSlots as any,
        texts: newDesignData.firstPage.texts,
      };
    } else if (selectedSpreadIndex === -2 && newDesignData.lastPage) {
      newDesignData.lastPage = {
        layoutId,
        slots: newSlots as any,
        texts: newDesignData.lastPage.texts,
      };
    } else if (
      typeof selectedSpreadIndex === "number" &&
      selectedSpreadIndex >= 0 &&
      newDesignData.spreads?.[selectedSpreadIndex]
    ) {
      newDesignData.spreads = newDesignData.spreads.map((s, i) =>
        i === selectedSpreadIndex
          ? { ...s, layoutId, slots: newSlots as any }
          : s,
      );
    }

    updateDesignData(newDesignData);
  };

  const statusText = {
    idle: isDirty ? "Unsaved changes" : "",
    saving: "Saving...",
    saved: "Saved",
    error: "Save error",
  }[saveStatus];

  // Get the selected text object
  const selectedText =
    selectedTextIndex !== null
      ? (currentSpread?.texts || [])[selectedTextIndex]
      : null;

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Banners */}
      {designStatus === "CHANGES_REQUESTED" && photographerNotes && (
        <div className="border-b bg-amber-950/50 px-4 py-3 flex items-start gap-2 text-sm">
          <MessageSquare className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
          <div>
            <span className="font-medium text-amber-400">
              Photographer feedback:{" "}
            </span>
            <span className="text-amber-300">{photographerNotes}</span>
          </div>
        </div>
      )}

      {isAlbumsDisabled && (
        <div className="border-b bg-amber-950/30 px-4 py-2 text-sm text-center text-amber-400 font-medium">
          Album creation has been disabled by the photographer.
        </div>
      )}

      {isLocked && (
        <div className="border-b bg-muted px-4 py-2 text-sm text-center text-muted-foreground">
          This album is under review and cannot be edited.
        </div>
      )}

      {/* ─── Toolbar ─── */}
      <div className="border-b px-4 py-2 flex items-center gap-3">
        {/* Left: Back + Title + Status */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent transition flex-shrink-0"
              aria-label="Back to albums"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}

          {/* Editable title */}
          {isEditingTitle ? (
            <input
              ref={titleInputRef}
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={saveTitle}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveTitle();
                if (e.key === "Escape") setIsEditingTitle(false);
              }}
              className="text-sm font-semibold bg-transparent border-b border-primary outline-none min-w-[120px] max-w-[300px]"
              autoFocus
            />
          ) : (
            <button
              onClick={startEditingTitle}
              className="flex items-center gap-1.5 text-sm font-semibold hover:text-primary transition truncate"
              title="Click to rename"
            >
              <span className="truncate">
                {currentDesign?.title || "Untitled Album"}
              </span>
              {!isLocked && (
                <Pencil className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              )}
            </button>
          )}

          <StatusBadge status={designStatus as any} />

          {statusText && (
            <Badge
              variant={saveStatus === "error" ? "destructive" : "secondary"}
              className="text-[10px] flex-shrink-0"
            >
              {statusText}
            </Badge>
          )}
        </div>

        {/* Center: Product selector */}
        {!isLocked && (
          <ProductSelector
            products={products}
            selectedProductId={currentDesign?.productId}
            onSelectProduct={(productId) => {
              if (!currentDesign || currentDesign.productId === productId)
                return;
              useAlbumDesigner.setState({
                currentDesign: { ...currentDesign, productId },
                isDirty: true,
              });
            }}
          />
        )}

        <Separator orientation="vertical" className="h-6" />

        {/* Right: Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {!isLocked && (
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => undo()}
                    disabled={historyIndex <= 0}
                    className="h-8 w-8 p-0"
                  >
                    <Undo2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Undo</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => redo()}
                    disabled={historyIndex >= historyLength - 1}
                    className="h-8 w-8 p-0"
                  >
                    <Redo2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Redo</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          <Separator orientation="vertical" className="h-6 mx-1" />

          {!isLocked && (
            <Button
              size="sm"
              variant="outline"
              onClick={handlePreview}
              className="h-8"
            >
              <Eye className="h-3.5 w-3.5 mr-1.5" />
              Preview
            </Button>
          )}

          {!isLocked && (
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={isSubmitting || isAlbumsDisabled}
              className="h-8"
              title={
                isAlbumsDisabled
                  ? "Albums have been disabled by the photographer"
                  : undefined
              }
            >
              <Send className="h-3.5 w-3.5 mr-1.5" />
              {isSubmitting ? "Submitting..." : "Submit Design"}
            </Button>
          )}
        </div>
      </div>

      {/* ─── Main content area ─── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left sidebar: Layout picker */}
        {!isLocked && currentSpread && (
          <div className="w-52 border-r overflow-y-auto p-3 flex-shrink-0">
            <LayoutPicker
              layouts={layouts}
              selectedLayoutId={currentSpread?.layoutId}
              category={layoutCategory}
              onSelectLayout={handleSelectLayout}
            />
          </div>
        )}

        {/* Center: Canvas */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-auto bg-muted/20">
          {isLocked ? (
            <AlbumPreview designData={designData} photos={photos} />
          ) : currentSpread ? (
            <>
              <SpreadCanvas
                layoutId={currentSpread.layoutId}
                layoutDisplayName={getLayoutDisplayName(currentSpread.layoutId)}
                slots={currentSpread.slots || []}
                photos={photos}
                isSpread={isCurrentSpread}
                onSlotUpdate={handleSlotUpdate}
                onSlotSelect={handleSlotSelect}
                selectedSlotIndex={selectedSlotIndex}
                texts={showTextFeature ? currentSpread.texts : undefined}
                selectedTextIndex={
                  showTextFeature ? selectedTextIndex : undefined
                }
                onTextClick={showTextFeature ? handleTextClick : undefined}
              />
              {/* Add Text button for first/last pages */}
              {showTextFeature && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAddText}
                  className="mt-3 h-8 text-xs"
                >
                  <Type className="h-3.5 w-3.5 mr-1.5" />
                  Add Text
                </Button>
              )}
            </>
          ) : (
            <div className="text-muted-foreground text-sm">
              Select a page to start editing
            </div>
          )}
        </div>

        {/* Right sidebar: text options or slot options */}
        {(() => {
          if (isLocked) return null;

          // Text options sidebar (when text is selected on first/last pages)
          if (showTextFeature && selectedText && selectedTextIndex !== null) {
            return (
              <TextOptions
                text={selectedText}
                onUpdate={handleTextUpdate}
                onDelete={handleDeleteText}
                onClose={() => setSelectedTextIndex(null)}
              />
            );
          }

          // Slot options sidebar (when a filled slot is selected)
          if (selectedSlotIndex === null || !currentSpread) return null;
          const selectedSlot = (currentSpread.slots || [])[
            selectedSlotIndex
          ] as any;
          if (!selectedSlot?.photoId) return null;
          return (
            <SlotSidebar
              slot={selectedSlot}
              slotIndex={selectedSlotIndex}
              onUpdate={handleSlotUpdate}
              onClose={() => setSelectedSlotIndex(null)}
            />
          );
        })()}
      </div>

      {/* ─── Bottom: Page navigator ─── */}
      <div className="space-y-5">
        {!isLocked && (
          <PageNavigator
            cover={designData.cover}
            firstPage={designData.firstPage}
            spreads={designData.spreads || []}
            lastPage={designData.lastPage}
            selectedIndex={selectedSpreadIndex}
            onSelectPage={setSelectedSpreadIndex}
            onAddSpread={handleAddSpread}
            onRemoveSpread={handleRemoveSpread}
            onRemovePage={handleRemovePage}
            onAddPage={handleAddPage}
            maxPages={maxSpreads}
          />
        )}

        {/* ─── Bottom: Photo tray ─── */}
        {!isLocked && (
          <ImageTray
            photos={photos}
            usedPhotoIds={usedPhotoIds}
            onSelectPhoto={(photoId) => {
              if (selectedSlotIndex !== null && currentSpread) {
                handleSlotUpdate(selectedSlotIndex, { photoId });
              }
            }}
          />
        )}
      </div>
    </div>
  );
}
