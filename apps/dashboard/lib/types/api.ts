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
  previewPhotoUrls: string[];
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

export type UserAccessStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "cancelled_grace"
  | "no_subscription";

export type SubscriptionResponse = {
  access: {
    status: UserAccessStatus;
    canUpload: boolean;
    canCreateGallery: boolean;
    storageLimitBytes: string;
    trialEndsAt?: string | null;
    trialDaysLeft?: number;
    subscription?: {
      id: string;
      source: string;
      status: string;
      storageTierGb: number;
      currentPeriodEnd: string | null;
      cancelledAt: string | null;
      endsAt: string | null;
    };
  };
  subscription: {
    id: string;
    source: string;
    status: string;
    storageTierGb: number;
    priceCents: number;
    currency: string;
    currentPeriodStart: string | null;
    currentPeriodEnd: string | null;
    cancelledAt: string | null;
    endsAt: string | null;
  } | null;
};

export type PlanTier = {
  gb: number;
  priceCents: number;
  label: string;
  /** Price in local currency minor units (only present for regional pricing) */
  localPriceCents?: number;
  /** PPP-adjusted USD price in cents (what LS will charge) */
  pppPriceCents?: number;
  /** ISO 4217 currency code, e.g. "EGP" */
  currency?: string;
  /** Display symbol */
  symbol?: string;
  /** BCP 47 locale for Intl.NumberFormat */
  locale?: string;
};

