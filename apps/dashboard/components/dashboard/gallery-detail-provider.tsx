"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { jsonFetcher } from "@/lib/api/client";
import { GetGalleryResponse } from "@/lib/types/api";
import { PhotoProcessingStatus } from "@/lib/types/gallery";

type GalleryDetailContextValue = {
  galleryId: string;
  data: GetGalleryResponse | undefined;
  mutate: () => Promise<GetGalleryResponse | undefined>;
  isLoading: boolean;
  processingStatus: PhotoProcessingStatus | undefined;
  mutateProcessingStatus: () => void;
};

const GalleryDetailContext = createContext<GalleryDetailContextValue | null>(
  null,
);

export function GalleryDetailProvider({
  galleryId,
  children,
}: {
  galleryId: string;
  children: React.ReactNode;
}) {
  const { data, mutate, isLoading } = useSWR<GetGalleryResponse>(
    `/api/galleries/${galleryId}`,
    jsonFetcher,
    { revalidateOnFocus: false },
  );

  const [processingStatus, setProcessingStatus] = useState<PhotoProcessingStatus>();
  const prevDone = useRef<boolean | undefined>(undefined);
  // Bump this to restart polling (e.g. after a retry)
  const [pollEpoch, setPollEpoch] = useState(0);

  const fetchProcessingStatus = useCallback(async () => {
    try {
      const status = await jsonFetcher<PhotoProcessingStatus>(
        `/api/galleries/${galleryId}/photos/processing-status`,
      );
      setProcessingStatus(status);
      return status;
    } catch {
      return undefined;
    }
  }, [galleryId]);

  // Called from banner after retry — re-fetch + restart polling
  const refreshProcessingStatus = useCallback(() => {
    fetchProcessingStatus();
    setPollEpoch((e) => e + 1);
  }, [fetchProcessingStatus]);

  // Polling: restart whenever pollEpoch changes
  useEffect(() => {
    fetchProcessingStatus();
    const id = setInterval(async () => {
      const status = await fetchProcessingStatus();
      if (status?.done && status.total > 0) {
        clearInterval(id);
      }
    }, 4000);
    return () => clearInterval(id);
  }, [fetchProcessingStatus, pollEpoch]);

  // When processing finishes, revalidate gallery data
  useEffect(() => {
    if (processingStatus?.done && prevDone.current === false) {
      mutate();
    }
    prevDone.current = processingStatus?.done;
  }, [processingStatus?.done, mutate]);

  return (
    <GalleryDetailContext.Provider
      value={{
        galleryId,
        data,
        mutate,
        isLoading,
        processingStatus,
        mutateProcessingStatus: refreshProcessingStatus,
      }}
    >
      {children}
    </GalleryDetailContext.Provider>
  );
}

export function useGalleryDetail() {
  const ctx = useContext(GalleryDetailContext);
  if (!ctx) {
    throw new Error("useGalleryDetail must be used within GalleryDetailProvider");
  }
  return ctx;
}
