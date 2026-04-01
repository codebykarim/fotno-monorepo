"use client";

import { create } from "zustand";
import type { SmartAlbumDesign, DesignData } from "./album-types";

type AlbumDesignerState = {
  // Current design
  currentDesign: SmartAlbumDesign | null;
  setCurrentDesign: (design: SmartAlbumDesign) => void;

  // Navigation
  selectedSpreadIndex: number | null; // null = cover, -1 = first page, spreads[n], -2 = last page
  setSelectedSpreadIndex: (index: number | null) => void;

  selectedSlotIndex: number | null;
  setSelectedSlotIndex: (index: number | null) => void;

  // State management
  isDirty: boolean;
  setIsDirty: (dirty: boolean) => void;

  // Auto-save status
  saveStatus: "idle" | "saving" | "saved" | "error";
  setSaveStatus: (status: "idle" | "saving" | "saved" | "error") => void;

  // Undo/Redo history
  history: DesignData[];
  historyIndex: number;
  undo: () => boolean;
  redo: () => boolean;

  // Update title (triggers auto-save via isDirty)
  updateTitle: (title: string) => void;

  // Helper: update designData and push to history in a single atomic set()
  updateDesignData: (newDesignData: DesignData) => void;

  // Immediate save (for preview/submit - skips debounce)
  saveImmediate: (shareToken: string, designId: string) => Promise<boolean>;
};

const MAX_HISTORY = 50;

export const useAlbumDesigner = create<AlbumDesignerState>((set, get) => ({
  currentDesign: null,
  setCurrentDesign: (design) => {
    set({
      currentDesign: design,
      history: [design.designData as DesignData],
      historyIndex: 0,
      isDirty: false,
      saveStatus: "idle",
    });
  },

  selectedSpreadIndex: null,
  setSelectedSpreadIndex: (index) => {
    set({ selectedSpreadIndex: index, selectedSlotIndex: null });
  },

  selectedSlotIndex: null,
  setSelectedSlotIndex: (index) => {
    set({ selectedSlotIndex: index });
  },

  isDirty: false,
  setIsDirty: (dirty) => {
    set({ isDirty: dirty });
  },

  saveStatus: "idle",
  setSaveStatus: (status) => {
    set({ saveStatus: status });
  },

  history: [],
  historyIndex: -1,

  undo: () => {
    const state = get();
    if (state.historyIndex <= 0 || !state.currentDesign) return false;

    const newIndex = state.historyIndex - 1;
    const restoredData = state.history[newIndex];

    set({
      historyIndex: newIndex,
      currentDesign: {
        ...state.currentDesign,
        designData: restoredData!,
      },
      isDirty: true,
      saveStatus: "idle",
    });
    return true;
  },

  redo: () => {
    const state = get();
    if (state.historyIndex >= state.history.length - 1 || !state.currentDesign)
      return false;

    const newIndex = state.historyIndex + 1;
    const restoredData = state.history[newIndex];

    set({
      historyIndex: newIndex,
      currentDesign: {
        ...state.currentDesign,
        designData: restoredData!,
      },
      isDirty: true,
      saveStatus: "idle",
    });
    return true;
  },

  updateTitle: (title) => {
    set((state) => {
      if (!state.currentDesign) return state;
      return {
        currentDesign: { ...state.currentDesign, title },
        isDirty: true,
        saveStatus: "idle" as const,
      };
    });
  },

  updateDesignData: (newDesignData) => {
    // Single atomic set() to avoid race conditions between design update and history push
    set((state) => {
      if (!state.currentDesign) return state;

      // Truncate future history (if we're in middle of undo chain)
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(newDesignData);

      // Keep history size manageable
      if (newHistory.length > MAX_HISTORY) {
        newHistory.shift();
      }

      return {
        currentDesign: {
          ...state.currentDesign,
          designData: newDesignData,
        },
        history: newHistory,
        historyIndex: newHistory.length - 1,
        isDirty: true,
        saveStatus: "idle",
      };
    });
  },

  saveImmediate: async (shareToken, designId) => {
    const state = get();
    if (!state.isDirty || !state.currentDesign) return true;

    set({ saveStatus: "saving" });

    try {
      const { designData, title, productId } = state.currentDesign;
      const response = await fetch(
        `/api/gallery/${encodeURIComponent(shareToken)}/smart-album/designs/${encodeURIComponent(designId)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ designData, title, productId }),
        },
      );

      if (!response.ok) {
        set({ saveStatus: "error" });
        return false;
      }

      set({ isDirty: false, saveStatus: "saved" });
      setTimeout(() => {
        if (get().saveStatus === "saved") set({ saveStatus: "idle" });
      }, 2000);
      return true;
    } catch {
      set({ saveStatus: "error" });
      return false;
    }
  },
}));
