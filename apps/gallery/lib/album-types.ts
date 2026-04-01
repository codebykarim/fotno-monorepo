/**
 * Smart Album Feature Types
 * Shared types for album designer and related components
 */

import type { LayoutTemplate, Slot } from "./layout-templates";
export type { LayoutTemplate, Slot };

// ─── Enums ─────────────────────────────────────────────────────────────

export enum SmartAlbumDesignStatus {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  APPROVED = "APPROVED",
  CHANGES_REQUESTED = "CHANGES_REQUESTED",
  REJECTED = "REJECTED",
}

export enum SmartAlbumSubmissionStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  CHANGES_REQUESTED = "CHANGES_REQUESTED",
  REJECTED = "REJECTED",
}

export enum SmartAlbumPaymentMethod {
  OUTSIDE_FOTNO = "OUTSIDE_FOTNO",
  INSIDE_FOTNO = "INSIDE_FOTNO",
}

// ─── Product Types ─────────────────────────────────────────────────────

export interface SmartAlbumProduct {
  id: string;
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
  images: string[];
  imageUrls?: string[]; // signed download URLs
  priceCents: number;
  currency: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductListResponse {
  products: SmartAlbumProduct[];
}

// ─── Design Slot Types ─────────────────────────────────────────────────

export interface DesignSlot {
  photoId: string; // UUID of the photo
  x: number; // position percentage (0-100)
  y: number;
  width: number; // size percentage (0-100)
  height: number;
  cropX: number; // crop offset percentage
  cropY: number;
  cropWidth: number; // crop area percentage
  cropHeight: number;
  rotation: number; // degrees (0, 90, 180, 270)
}

export interface PageText {
  id: string;
  content: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  x: number; // position percentage (0-100)
  y: number;
  textAlign: "left" | "center" | "right";
}

export interface PageLayout {
  layoutId: string; // ID from layout-templates
  slots: DesignSlot[];
  texts?: PageText[];
}

export interface SpreadData extends PageLayout {
  order: number; // 0 = first spread
}

// ─── Design Data (JSONB structure) ─────────────────────────────────────

export interface DesignData {
  cover?: PageLayout | null;
  firstPage?: PageLayout | null;
  spreads: SpreadData[];
  lastPage?: PageLayout | null;
}

// ─── Design Types ──────────────────────────────────────────────────────

export interface SmartAlbumDesign {
  id: string;
  galleryId: string;
  productId: string;
  clientName: string;
  clientEmail: string;
  title: string;
  designData: DesignData;
  status: SmartAlbumDesignStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDesignRequest {
  productId: string;
  clientName?: string;
  clientEmail?: string;
}

export interface CreateDesignResponse {
  design: SmartAlbumDesign;
}

export interface ListDesignsResponse {
  designs: SmartAlbumDesign[];
}

export interface GetDesignResponse {
  design: SmartAlbumDesign;
  product: SmartAlbumProduct;
}

export interface UpdateDesignRequest {
  designData?: DesignData;
  title?: string;
  productId?: string;
}

export interface UpdateDesignResponse {
  design: SmartAlbumDesign;
}

// ─── Submission Types ──────────────────────────────────────────────────

export interface SmartAlbumSubmission {
  id: string;
  designId: string;
  version: number;
  status: SmartAlbumSubmissionStatus;
  photographerNotes?: string;
  reviewedAt?: string;
  submittedAt: string;
}

export interface SubmitDesignRequest {
  // Empty body - submission is implicit
}

export interface SubmitDesignResponse {
  submission: SmartAlbumSubmission;
  clientSecret?: string; // Only if INSIDE_FOTNO payment required
}

export interface ConfirmPaymentRequest {
  paymentIntentId: string;
}

export interface ConfirmPaymentResponse {
  submission: SmartAlbumSubmission;
  success: boolean;
}

// ─── Layout Response ────────────────────────────────────────────────────

export interface LayoutsResponse {
  spreads: LayoutTemplate[];
  singles: LayoutTemplate[];
}

// ─── Designer State ────────────────────────────────────────────────────

export interface AlbumDesignerState {
  design: SmartAlbumDesign;
  selectedSpread: number | "cover" | "firstPage" | "lastPage";
  selectedSlot: number | null;
  isDirty: boolean;
  isSaving: boolean;
  saveError?: string;
  lastSavedAt?: string;
}

export interface DesignHistory {
  past: DesignData[];
  present: DesignData;
  future: DesignData[];
}
