"use client";

import { createContext, useContext } from "react";
import useSWR from "swr";
import { jsonFetcher } from "@/lib/api/client";
import { GetGalleryResponse } from "@/lib/types/api";

type GalleryDetailContextValue = {
  galleryId: string;
  data: GetGalleryResponse | undefined;
  mutate: () => Promise<GetGalleryResponse | undefined>;
  isLoading: boolean;
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

  return (
    <GalleryDetailContext.Provider value={{ galleryId, data, mutate, isLoading }}>
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
