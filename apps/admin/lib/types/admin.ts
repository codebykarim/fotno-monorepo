export interface AdminOverview {
  totalUsers: number;
  totalGalleries: number;
  totalPhotos: number;
  totalClients: number;
  newUsersThisMonth: number;
  newGalleriesThisMonth: number;
  uploadsThisWeek: number;
  platformStorageUsed: string;
  planBreakdown: { plan: string; count: number }[];
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  plan: string;
  role: string | null;
  banned: boolean;
  storageUsed: string;
  storageLimit: string;
  galleryCount: number;
  createdAt: string;
}

export interface AdminUserDetail extends AdminUser {
  subscribed: boolean | null;
  finishOnboarding: boolean | null;
  banReason: string | null;
  banExpires: string | null;
  storageReserved: string;
  overageBytes: string;
  subscriptions: AdminSubscription[];
}

export interface AdminGallery {
  id: string;
  title: string;
  slug: string;
  isPublished: boolean;
  photoCount: number;
  albumCount: number;
  storageUsed: string;
  createdAt: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
}

export interface AdminClient {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  galleryCount: number;
  createdAt: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
}

export interface AdminStorageOverview {
  totalUsed: string;
  totalAllocated: string;
  utilizationPercent: number;
  users: AdminStorageUser[];
}

export interface AdminStorageUser {
  id: string;
  name: string;
  email: string;
  plan: string;
  storageUsed: string;
  storageLimit: string;
  usagePercent: number;
  overageBytes: string;
}

export interface AdminSubscription {
  id: string;
  source: "LEMON_SQUEEZY" | "MANUAL";
  status: string;
  storageTierGb: number;
  priceCents: number;
  currency: string;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelledAt: string | null;
  endsAt: string | null;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface AdminSubscriptionsOverview {
  totalRevenue: number;
  activeCount: number;
  cancelledCount: number;
  expiredCount: number;
  pastDueCount: number;
  subscriptions: AdminSubscription[];
}

export interface ServiceHealth {
  name: string;
  status: "healthy" | "degraded" | "down";
  responseTime: number;
  details?: Record<string, unknown>;
}

export interface ServicesHealthResponse {
  services: ServiceHealth[];
  checkedAt: string;
}

export interface AnalyticsData {
  userSignups: TimeSeriesPoint[];
  galleryCreations: TimeSeriesPoint[];
  uploadVolume: { date: string; count: number; bytes: string }[];
  revenueByMonth: { month: string; total_cents: number }[];
  planDistribution: { plan: string; count: number }[];
  storageGrowth: { date: string; delta: string }[];
  summary: {
    totalRevenue: number;
    mrr: number;
    avgGalleriesPerUser: number;
    avgPhotosPerGallery: number;
  };
}

export interface TimeSeriesPoint {
  date: string;
  count: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AdminManualRequest {
  id: string;
  storageTierGb: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminNotes: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    plan: string;
  };
}

export interface AdminManualRequestsResponse {
  requests: AdminManualRequest[];
  total: number;
  page: number;
  pageSize: number;
}
