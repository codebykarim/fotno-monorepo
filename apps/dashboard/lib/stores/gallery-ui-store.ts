"use client";

import { create } from "zustand";

type UploadQueueItem = {
  id: string;
  fileName: string;
  progress: number;
  status: "queued" | "uploading" | "confirming" | "done" | "error";
};

type GalleryUiState = {
  selectedByGallery: Record<string, string[]>;
  uploadQueue: UploadQueueItem[];
  setSelected: (galleryId: string, photoIds: string[]) => void;
  toggleSelected: (galleryId: string, photoId: string) => void;
  clearSelected: (galleryId: string) => void;
  upsertQueueItem: (item: UploadQueueItem) => void;
  clearCompletedUploads: () => void;
};

export const useGalleryUiStore = create<GalleryUiState>((set, get) => ({
  selectedByGallery: {},
  uploadQueue: [],
  setSelected: (galleryId, photoIds) => {
    set((state) => ({
      selectedByGallery: {
        ...state.selectedByGallery,
        [galleryId]: photoIds,
      },
    }));
  },
  toggleSelected: (galleryId, photoId) => {
    const selected = get().selectedByGallery[galleryId] ?? [];
    const next = selected.includes(photoId)
      ? selected.filter((id) => id !== photoId)
      : [...selected, photoId];

    set((state) => ({
      selectedByGallery: {
        ...state.selectedByGallery,
        [galleryId]: next,
      },
    }));
  },
  clearSelected: (galleryId) => {
    set((state) => ({
      selectedByGallery: {
        ...state.selectedByGallery,
        [galleryId]: [],
      },
    }));
  },
  upsertQueueItem: (item) => {
    set((state) => {
      const index = state.uploadQueue.findIndex((current) => current.id === item.id);
      if (index === -1) {
        return { uploadQueue: [item, ...state.uploadQueue] };
      }

      const next = [...state.uploadQueue];
      next[index] = item;
      return { uploadQueue: next };
    });
  },
  clearCompletedUploads: () => {
    set((state) => ({
      uploadQueue: state.uploadQueue.filter((item) => item.status !== "done"),
    }));
  },
}));

export type { UploadQueueItem };
