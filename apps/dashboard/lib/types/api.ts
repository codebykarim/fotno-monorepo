import { Activity, Client, GalleryWithPhotos } from "@/lib/types/gallery";

export type GalleryListItem = {
  id: string;
  title: string;
  slug: string;
  eventDate: string | null;
  deadline: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  coverPhotoId: string | null;
  status: "draft" | "published";
  photoCount: number;
  coverPhotoUrl: string | null;
};

export type ListGalleriesResponse = {
  galleries: GalleryListItem[];
};

export type GetGalleryResponse = {
  gallery: GalleryWithPhotos;
};

export type OverviewResponse = {
  totalGalleries: number;
  publishedGalleries: number;
  totalPhotos: number;
  lovedPhotos: number;
  recentUploads7d: number;
  totalStorageUsedMb: number;
  recentActivity: Activity[];
};

export type ListClientsResponse = {
  clients: Array<
    Client & {
      galleries: Array<{
        id: string;
        title: string;
        eventDate: string | null;
        deadline: string | null;
      }>;
    }
  >;
  galleries: Array<{ id: string; title: string; eventDate: string | null; deadline: string | null }>;
};

export type StorageSummaryResponse = {
  used: string;
  limit: string;
  overageBytes: string;
  percentage: number;
  overageGB: number;
  overageCostCents: number;
  formatted: {
    used: string;
    limit: string;
    overage: string;
  };
};

export type StorageEventItem = {
  id: string;
  userId: string;
  photoId: string | null;
  delta: string;
  reason: string;
  createdAt: string;
};

export type StorageEventsResponse = {
  total: number;
  limit: number;
  offset: number;
  events: StorageEventItem[];
};
