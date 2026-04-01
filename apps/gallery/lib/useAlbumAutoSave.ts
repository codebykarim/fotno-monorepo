"use client";

import { useEffect, useRef } from "react";
import { useAlbumDesigner } from "./album-store";

/**
 * Auto-save hook for album designer.
 * Debounces saves with a 2-second delay after designData changes.
 */
export function useAlbumAutoSave(
  shareToken: string,
  designId: string,
  enabled = true,
) {
  // Subscribe to specific slices — avoids depending on the whole store object
  const designData = useAlbumDesigner((s) => s.currentDesign?.designData);
  const title = useAlbumDesigner((s) => s.currentDesign?.title);
  const productId = useAlbumDesigner((s) => s.currentDesign?.productId);
  const isDirty = useAlbumDesigner((s) => s.isDirty);
  const setIsDirty = useAlbumDesigner((s) => s.setIsDirty);
  const setSaveStatus = useAlbumDesigner((s) => s.setSaveStatus);

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const statusResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastSavedJsonRef = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled || !isDirty || !designData) return;

    // Clear any existing debounce timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      const currentJson = JSON.stringify({ designData, productId });

      // Skip if nothing actually changed since last save
      if (currentJson === lastSavedJsonRef.current) {
        setIsDirty(false);
        return;
      }

      // Abort any in-flight save request
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        setSaveStatus("saving");

        const response = await fetch(
          `/api/gallery/${encodeURIComponent(shareToken)}/smart-album/designs/${encodeURIComponent(designId)}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ designData, title, productId }),
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          setSaveStatus("error");
          console.error("Auto-save failed:", await response.json());
          return;
        }

        lastSavedJsonRef.current = currentJson;
        setIsDirty(false);
        setSaveStatus("saved");

        // Clear any previous status-reset timer before scheduling a new one
        if (statusResetTimeoutRef.current) {
          clearTimeout(statusResetTimeoutRef.current);
        }
        statusResetTimeoutRef.current = setTimeout(() => {
          const freshStatus = useAlbumDesigner.getState().saveStatus;
          if (freshStatus === "saved") {
            setSaveStatus("idle");
          }
        }, 2000);
      } catch (error) {
        // Ignore aborted requests — a newer save superseded this one
        if ((error as Error).name === "AbortError") return;
        setSaveStatus("error");
        console.error("Auto-save error:", error);
      }
    }, 2000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [designData, title, productId, isDirty, enabled, shareToken, designId, setIsDirty, setSaveStatus]);

  // Cleanup on unmount: abort in-flight fetch + clear status-reset timeout
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      if (statusResetTimeoutRef.current) {
        clearTimeout(statusResetTimeoutRef.current);
      }
    };
  }, []);
}
