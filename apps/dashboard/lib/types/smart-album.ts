/**
 * Smart Album Dashboard Types
 * Types for photographer settings, config, products, submissions, and review
 */

export enum SmartAlbumPaymentMethod {
  OUTSIDE_FOTNO = "OUTSIDE_FOTNO",
  INSIDE_FOTNO = "INSIDE_FOTNO",
}

// ─── Config Types ──────────────────────────────────────────────────────

export interface SmartAlbumConfig {
  id: string;
  userId: string;
  enabled: boolean;
  paymentMethod: SmartAlbumPaymentMethod;
  stripeConnectAccountId?: string;
  stripeConnectOnboarded: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetConfigResponse {
  config: SmartAlbumConfig;
  products: SmartAlbumProduct[];
}

export interface UpdateConfigRequest {
  enabled?: boolean;
  paymentMethod?: SmartAlbumPaymentMethod;
}

export interface UpdateConfigResponse {
  config: SmartAlbumConfig;
}

// ─── Product Types ────────────────────────────────────────────────────

export interface SmartAlbumProduct {
  id: string;
  configId: string;
  name: string;
  widthCm: number;
  heightCm: number;
  coverType: string;
  paperType: string;
  maxSpreads: number;
  minSpreads: number | null;
  allowFewerSpreads: boolean;
  hasCover: boolean;
  hasFirstPage: boolean;
  hasLastPage: boolean;
  images: string[]; // S3 keys
  priceCents: number;
  currency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  widthCm: number;
  heightCm: number;
  coverType: string;
  paperType: string;
  maxSpreads: number;
  minSpreads?: number | null;
  allowFewerSpreads?: boolean;
  hasCover?: boolean;
  hasFirstPage?: boolean;
  hasLastPage?: boolean;
  priceCents: number;
  currency?: string;
}

export interface CreateProductResponse {
  product: SmartAlbumProduct;
}

export interface UpdateProductRequest {
  name?: string;
  maxSpreads?: number;
  minSpreads?: number | null;
  allowFewerSpreads?: boolean;
  hasCover?: boolean;
  hasFirstPage?: boolean;
  hasLastPage?: boolean;
  priceCents?: number;
  isActive?: boolean;
  images?: string[];
}

export interface UpdateProductResponse {
  product: SmartAlbumProduct;
}

// ─── Submission Types ──────────────────────────────────────────────────

export enum SubmissionStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  CHANGES_REQUESTED = "CHANGES_REQUESTED",
  REJECTED = "REJECTED",
}

export interface SubmissionListItem {
  id: string;
  designId: string;
  version: number;
  status: SubmissionStatus;
  submittedAt: string;
  clientName: string;
  clientEmail: string;
  galleryTitle: string;
  productName: string;
  pageCount: number; // calculated from designSnapshot
}

export interface GetSubmissionsResponse {
  submissions: SubmissionListItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SubmissionDetail {
  id: string;
  designId: string;
  version: number;
  status: SubmissionStatus;
  clientName: string;
  clientEmail: string;
  galleryTitle: string;
  productName: string;
  productId: string;
  productWidthCm?: number;
  productHeightCm?: number;
  designSnapshot: DesignSnapshot;
  photographerNotes?: string;
  reviewedAt?: string;
  submittedAt: string;
  exportUrl?: string; // S3 signed URL if exported
  exportReady: boolean;
  transactionId?: string; // if payment was made
  transactionStatus?: string; // PENDING, SUCCEEDED, FAILED, REFUNDED
  transactionAmountCents?: number;
  transactionFeeCents?: number;
  transactionNetCents?: number;
  transactionCurrency?: string;
  transactionPaidAt?: string;
}

export interface GetSubmissionResponse {
  submission: SubmissionDetail;
}

// ─── Design Snapshot (frozen copy from submission) ────────────────────

export interface DesignSlot {
  photoId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  cropX: number;
  cropY: number;
  cropWidth: number;
  cropHeight: number;
  rotation: number;
}

export interface PageText {
  id: string;
  content: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  x: number;
  y: number;
  textAlign: "left" | "center" | "right";
}

export interface PageLayout {
  layoutId: string;
  slots: DesignSlot[];
  texts?: PageText[];
}

export interface SpreadData extends PageLayout {
  order: number;
}

export interface DesignSnapshot {
  cover: PageLayout;
  firstPage: PageLayout;
  spreads: SpreadData[];
  lastPage: PageLayout;
}

// ─── Review Types ────────────────────────────────────────────────────

export interface ReviewSubmissionRequest {
  action: "approve" | "request_changes" | "reject";
  notes?: string; // For request_changes and reject
  reason?: string; // For reject (alternative to notes)
}

export interface ReviewSubmissionResponse {
  submission: SubmissionDetail;
}

// ─── Export Types ────────────────────────────────────────────────────

export interface ExportSubmissionRequest {
  // Empty body - export is implicit
}

export interface ExportSubmissionResponse {
  exportUrl: string; // S3 signed download URL
  expiresAt: string; // ISO timestamp
  fileName: string; // e.g., "album_submission_v1.zip"
}

// ─── Stripe Connect Types ────────────────────────────────────────────

export interface StripeConnectAccount {
  id: string;
  accountId: string;
  onboarded: boolean;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  dashboard?: string; // URL to Stripe Connect dashboard
}

export interface ConnectOnboardRequest {
  // Empty body
}

export interface ConnectOnboardResponse {
  accountId: string;
  onboardingUrl: string; // URL to Stripe Connect onboarding
}

export interface ConnectStatusRequest {
  // Empty body
}

export interface ConnectStatusResponse {
  accountId?: string;
  onboarded: boolean;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  ready: boolean; // true if both chargesEnabled and payoutsEnabled
}

// ─── Form Types ────────────────────────────────────────────────────

export interface ConfigFormData {
  enabled: boolean;
  paymentMethod: SmartAlbumPaymentMethod;
}

export interface ProductFormData {
  name: string;
  widthCm: number;
  heightCm: number;
  coverType: string;
  paperType: string;
  maxSpreads: number;
  minSpreads: number | null;
  allowFewerSpreads: boolean;
  hasCover: boolean;
  hasFirstPage: boolean;
  hasLastPage: boolean;
  priceCents: number;
}
