import { Activity, Client, GalleryWithPhotos } from "@/lib/types/gallery";

export type GalleryListItem = {
  id: string;
  title: string;
  slug: string;
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
  totalPhotos: number;
  totalStorageUsedMb: number;
  recentActivity: Activity[];
};

export type ListClientsResponse = {
  clients: Array<Client & { galleries: Array<{ id: string; title: string }> }>;
};
