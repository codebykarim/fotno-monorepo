/**
 * Smart Album API Client
 * Provides functions for all public gallery album endpoints
 * Used by the album designer, product selector, and submission flows
 */

import { backendFetch } from "./backend";
import type {
  SmartAlbumProduct,
  SmartAlbumDesign,
  SmartAlbumSubmission,
  CreateDesignRequest,
  CreateDesignResponse,
  ListDesignsResponse,
  GetDesignResponse,
  UpdateDesignRequest,
  UpdateDesignResponse,
  SubmitDesignResponse,
  ConfirmPaymentRequest,
  ConfirmPaymentResponse,
  ProductListResponse,
} from "./album-types";
import type { LayoutTemplate } from "./layout-templates";

/**
 * Get available album products for a gallery
 * Returns only active products from the photographer's config
 */
export const getProducts = async (
  shareToken: string
): Promise<SmartAlbumProduct[]> => {
  const response = await backendFetch(
    `/api/public/gallery/${shareToken}/smart-album/products`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  const data: ProductListResponse = await response.json();
  return data.products;
};

/**
 * Get all available layout templates
 * Returns both spread and single page layouts
 */
export const getLayouts = async (
  shareToken: string
): Promise<LayoutTemplate[]> => {
  const response = await backendFetch(
    `/api/public/gallery/${shareToken}/smart-album/layouts`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch layouts: ${response.statusText}`);
  }

  const data = await response.json();
  return data.layouts || [];
};

/**
 * Create a new album design
 * Initializes with DRAFT status and empty designData scaffold
 */
export const createDesign = async (
  shareToken: string,
  request: CreateDesignRequest
): Promise<SmartAlbumDesign> => {
  const response = await backendFetch(
    `/api/public/gallery/${shareToken}/smart-album/designs`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to create design: ${response.statusText}`);
  }

  const data: CreateDesignResponse = await response.json();
  return data.design;
};

/**
 * List all designs for the current client in a gallery
 * Filtered by clientEmail
 */
export const listDesigns = async (
  shareToken: string
): Promise<SmartAlbumDesign[]> => {
  const response = await backendFetch(
    `/api/public/gallery/${shareToken}/smart-album/designs`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch designs: ${response.statusText}`);
  }

  const data: ListDesignsResponse = await response.json();
  return data.designs;
};

/**
 * Get a specific design with full data including product info
 */
export const getDesign = async (
  shareToken: string,
  designId: string
): Promise<{ design: SmartAlbumDesign; product: SmartAlbumProduct }> => {
  const response = await backendFetch(
    `/api/public/gallery/${shareToken}/smart-album/designs/${designId}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch design: ${response.statusText}`);
  }

  const data: GetDesignResponse = await response.json();
  return {
    design: data.design,
    product: data.product,
  };
};

/**
 * Update a design (auto-save)
 * Updates designData, title, or productId with DRAFT status validation
 * Validates maxSpreads constraint
 */
export const updateDesign = async (
  shareToken: string,
  designId: string,
  request: UpdateDesignRequest
): Promise<SmartAlbumDesign> => {
  const response = await backendFetch(
    `/api/public/gallery/${shareToken}/smart-album/designs/${designId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to update design: ${error}`);
  }

  const data: UpdateDesignResponse = await response.json();
  return data.design;
};

/**
 * Submit a design for review
 * Creates SmartAlbumSubmission with PENDING status
 * Validates that design has at least one spread with an image
 * If paymentMethod is INSIDE_FOTNO, returns clientSecret for Stripe Payment Element
 */
export const submitDesign = async (
  shareToken: string,
  designId: string
): Promise<{
  submission: SmartAlbumSubmission;
  clientSecret?: string;
  requiresPayment: boolean;
}> => {
  const response = await backendFetch(
    `/api/public/gallery/${shareToken}/smart-album/designs/${designId}/submit`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to submit design: ${error}`);
  }

  const data: SubmitDesignResponse = await response.json();
  return {
    submission: data.submission,
    clientSecret: data.clientSecret,
    requiresPayment: !!data.clientSecret,
  };
};

/**
 * Confirm payment after Stripe payment succeeds
 * Called after client completes Stripe Payment Element
 * Finalizes submission and creates SmartAlbumTransaction record
 */
export const confirmPayment = async (
  shareToken: string,
  designId: string,
  request: ConfirmPaymentRequest
): Promise<ConfirmPaymentResponse> => {
  const response = await backendFetch(
    `/api/public/gallery/${shareToken}/smart-album/designs/${designId}/confirm-payment`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to confirm payment: ${error}`);
  }

  const data: ConfirmPaymentResponse = await response.json();
  return data;
};

