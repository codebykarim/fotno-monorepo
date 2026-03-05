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
  payments: AdminPayment[];
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

export interface AdminPayment {
  id: number;
  plan: string;
  status: string;
  amount_cents: number;
  planStartedAt: string | null;
  planExpiresAt: string | null;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface AdminPaymentsOverview {
  totalRevenue: number;
  activeCount: number;
  cancelledCount: number;
  expiredCount: number;
  payments: AdminPayment[];
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
