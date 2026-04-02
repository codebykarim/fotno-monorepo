import { type Request, type Response } from "express";
import AppError from "../errors/AppError";
import { getConfig } from "../services/SmartAlbumServices/getConfig";
import { upsertConfig } from "../services/SmartAlbumServices/upsertConfig";
import { createProduct } from "../services/SmartAlbumServices/createProduct";
import { updateProduct } from "../services/SmartAlbumServices/updateProduct";
import { deleteProduct } from "../services/SmartAlbumServices/deleteProduct";
import {
  presignProductImage,
  confirmProductImage,
  removeProductImage,
} from "../services/SmartAlbumServices/productImages";
import { getSmartAlbumProducts } from "../services/PublicGalleryServices/getSmartAlbumProducts";
import { getSmartAlbumLayouts } from "../services/PublicGalleryServices/getSmartAlbumLayouts";
import { createSmartAlbumDesign } from "../services/PublicGalleryServices/createSmartAlbumDesign";
import { listSmartAlbumDesigns } from "../services/PublicGalleryServices/listSmartAlbumDesigns";
import { getSmartAlbumDesign } from "../services/PublicGalleryServices/getSmartAlbumDesign";
import { updateSmartAlbumDesign } from "../services/PublicGalleryServices/updateSmartAlbumDesign";
import { submitSmartAlbumDesign } from "../services/PublicGalleryServices/submitSmartAlbumDesign";
import { confirmSmartAlbumPayment } from "../services/PublicGalleryServices/confirmSmartAlbumPayment";
import { getSubmissions } from "../services/SmartAlbumServices/getSubmissions";
import { getSubmissionDetail } from "../services/SmartAlbumServices/getSubmissionDetail";
import { reviewSubmission } from "../services/SmartAlbumServices/reviewSubmission";
import { generateExport } from "../services/SmartAlbumServices/generateExport";
import { stripeConnectOnboard } from "../services/SmartAlbumServices/stripeConnectOnboard";
import { stripeConnectStatus } from "../services/SmartAlbumServices/stripeConnectStatus";
import { stripeConnectDisconnect } from "../services/SmartAlbumServices/stripeConnectDisconnect";

const getUserId = (req: Request): string => {
  const userId = req.user?.id;
  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }
  return userId;
};

const asStatusCode = (value: unknown, fallback: number): number =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

// ─── Photographer Album Configuration (Dashboard) ────────────────────────────

export const getConfigController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const result = await getConfig(userId);
  if ("error" in result) {
    return res.status(asStatusCode(result.status, 500)).json({ error: result.error });
  }
  return res.status(200).json(result.data);
};

export const upsertConfigController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const result = await upsertConfig(userId, req.body);
  if ("error" in result) {
    return res.status(asStatusCode(result.status, 500)).json({ error: result.error });
  }
  return res.status(200).json(result.data);
};

export const createProductController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const result = await createProduct(userId, req.body);
  if ("error" in result) {
    return res.status(asStatusCode(result.status, 500)).json({ error: result.error });
  }
  return res.status(201).json(result.data);
};

export const updateProductController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { productId } = req.params;
  const result = await updateProduct(userId, productId, req.body);
  if ("error" in result) {
    return res.status(asStatusCode(result.status, 500)).json({ error: result.error });
  }
  return res.status(200).json(result.data);
};

export const deleteProductController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { productId } = req.params;
  const result = await deleteProduct(userId, productId);
  if ("error" in result) {
    return res.status(asStatusCode(result.status, 500)).json({ error: result.error });
  }
  return res.status(200).json(result.data);
};

// ─── Product Images ──────────────────────────────────────────────────────────

export const presignProductImageController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { productId } = req.params;
  const result = await presignProductImage(userId, productId, req.body);
  if ("error" in result) {
    return res.status(asStatusCode(result.status, 500)).json({ error: result.error });
  }
  return res.status(200).json(result.data);
};

export const confirmProductImageController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { productId } = req.params;
  const result = await confirmProductImage(userId, productId, req.body);
  if ("error" in result) {
    return res.status(asStatusCode(result.status, 500)).json({ error: result.error });
  }
  return res.status(200).json(result.data);
};

export const removeProductImageController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { productId } = req.params;
  const result = await removeProductImage(userId, productId, req.body);
  if ("error" in result) {
    return res.status(asStatusCode(result.status, 500)).json({ error: result.error });
  }
  return res.status(200).json(result.data);
};

// ─── Client Album Design (Public Gallery) ────────────────────────────────────

export const getPublicProductsController = async (req: Request, res: Response) => {
  const { shareToken } = req.params;
  const result = await getSmartAlbumProducts(shareToken);
  if ("error" in result) {
    return res.status(asStatusCode(result.status, 500)).json({ error: result.error });
  }
  return res.status(200).json(result.products);
};

export const getPublicLayoutsController = async (_req: Request, res: Response) => {
  const result = await getSmartAlbumLayouts();
  return res.status(200).json(result.layouts);
};

export const createDesignController = async (req: Request, res: Response) => {
  const { shareToken } = req.params;
  const result = await createSmartAlbumDesign(shareToken, req.body);
  if ("error" in result) {
    return res.status(asStatusCode(result.status, 500)).json({ error: result.error });
  }
  return res.status(201).json(result.design);
};

export const listDesignsController = async (req: Request, res: Response) => {
  const { shareToken } = req.params;
  const { clientEmail } = req.query;
  if (!clientEmail || typeof clientEmail !== "string") {
    return res.status(400).json({ error: "clientEmail query parameter required" });
  }
  const result = await listSmartAlbumDesigns(shareToken, clientEmail);
  if ("error" in result) {
    return res.status(asStatusCode(result.status, 500)).json({ error: result.error });
  }
  return res.status(200).json(result.designs);
};

export const getDesignController = async (req: Request, res: Response) => {
  const { shareToken, designId } = req.params;
  const result = await getSmartAlbumDesign(shareToken, designId);
  if ("error" in result) {
    return res.status(asStatusCode(result.status, 500)).json({ error: result.error });
  }
  return res.status(200).json(result.design);
};

export const updateDesignController = async (req: Request, res: Response) => {
  const { shareToken, designId } = req.params;
  const result = await updateSmartAlbumDesign(shareToken, designId, req.body);
  if ("error" in result) {
    return res.status(asStatusCode(result.status, 500)).json({ error: result.error });
  }
  return res.status(200).json(result.design);
};

export const submitDesignController = async (req: Request, res: Response) => {
  const { shareToken, designId } = req.params;
  const result = await submitSmartAlbumDesign(shareToken, designId);
  if ("error" in result) {
    return res.status(asStatusCode(result.status, 500)).json({ error: result.error });
  }
  const response: any = { submission: result.submission };
  if (result.payment) {
    response.payment = result.payment;
  }
  return res.status(201).json(response);
};

export const confirmPaymentController = async (req: Request, res: Response) => {
  const { shareToken, designId } = req.params;
  const { paymentIntentId } = req.body;
  if (!paymentIntentId || typeof paymentIntentId !== "string") {
    return res.status(400).json({ error: "paymentIntentId is required" });
  }
  const result = await confirmSmartAlbumPayment(shareToken, designId, paymentIntentId);
  if ("error" in result) {
    return res.status(asStatusCode(result.status, 500)).json({ error: result.error });
  }
  return res.status(200).json(result.data);
};

// ─── Photographer Review & Export (Dashboard) ─────────────────────────────────

export const getSubmissionsController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { status, galleryId, page, pageSize } = req.query;
  const result = await getSubmissions(userId, {
    status: typeof status === "string" ? status : undefined,
    galleryId: typeof galleryId === "string" ? galleryId : undefined,
    page: page ? Number(page) : undefined,
    pageSize: pageSize ? Number(pageSize) : undefined,
  });
  if ("error" in result) {
    return res.status(asStatusCode(result.status, 500)).json({ error: result.error });
  }
  return res.status(200).json(result.data);
};

export const getSubmissionDetailController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { submissionId } = req.params;
  const result = await getSubmissionDetail(userId, submissionId);
  if ("error" in result) {
    return res.status(asStatusCode(result.status, 500)).json({ error: result.error });
  }
  return res.status(200).json(result.data);
};

export const reviewSubmissionController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { submissionId } = req.params;
  const result = await reviewSubmission(userId, submissionId, req.body);
  if ("error" in result) {
    return res.status(asStatusCode(result.status, 500)).json({ error: result.error });
  }
  return res.status(200).json(result.data);
};

export const generateExportController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { submissionId } = req.params;
  const force = req.query.force === "true" || req.body?.force === true;
  const result = await generateExport(userId, submissionId, force);
  if ("error" in result) {
    return res.status(asStatusCode(result.status, 500)).json({ error: result.error });
  }
  return res.status(200).json(result.data);
};

// ─── Stripe Connect (Dashboard) ──────────────────────────────────────────────

export const stripeConnectOnboardController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const result = await stripeConnectOnboard(userId);
  if ("error" in result) {
    return res.status(asStatusCode(result.status, 500)).json({ error: result.error });
  }
  return res.status(200).json(result.data);
};

export const stripeConnectStatusController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const result = await stripeConnectStatus(userId);
  if ("error" in result) {
    return res.status(asStatusCode(result.status, 500)).json({ error: result.error });
  }
  return res.status(200).json(result.data);
};

export const stripeConnectDisconnectController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const result = await stripeConnectDisconnect(userId);
  if ("error" in result) {
    return res.status(asStatusCode(result.status, 500)).json({ error: result.error });
  }
  return res.status(200).json(result.data);
};
