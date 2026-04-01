import { Router, Request, Response, NextFunction } from "express";
import isAuth from "../middleware/isAuth";
import isActiveSubscriber from "../middleware/isActiveSubscriber";
import { getConfig } from "../services/SmartAlbumServices/getConfig";

// isAuth/isActiveSubscriber were designed for the init() wrapper which awaits
// them; they never call next(). Wrap them for direct Express middleware use.
const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await isAuth(req, res, next);
    next();
  } catch (err) {
    next(err);
  }
};

const requireActiveSubscriber = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await isActiveSubscriber(req, res, next);
    next();
  } catch (err) {
    next(err);
  }
};
import { upsertConfig } from "../services/SmartAlbumServices/upsertConfig";
import { createProduct } from "../services/SmartAlbumServices/createProduct";
import { updateProduct } from "../services/SmartAlbumServices/updateProduct";
import { deleteProduct } from "../services/SmartAlbumServices/deleteProduct";
import { getSmartAlbumProducts } from "../services/PublicGalleryServices/getSmartAlbumProducts";
import { getSmartAlbumLayouts } from "../services/PublicGalleryServices/getSmartAlbumLayouts";
import { createSmartAlbumDesign } from "../services/PublicGalleryServices/createSmartAlbumDesign";
import { listSmartAlbumDesigns } from "../services/PublicGalleryServices/listSmartAlbumDesigns";
import { getSmartAlbumDesign } from "../services/PublicGalleryServices/getSmartAlbumDesign";
import { updateSmartAlbumDesign } from "../services/PublicGalleryServices/updateSmartAlbumDesign";
import { submitSmartAlbumDesign } from "../services/PublicGalleryServices/submitSmartAlbumDesign";
import { getSubmissions } from "../services/SmartAlbumServices/getSubmissions";
import { getSubmissionDetail } from "../services/SmartAlbumServices/getSubmissionDetail";
import { reviewSubmission } from "../services/SmartAlbumServices/reviewSubmission";
import { generateExport } from "../services/SmartAlbumServices/generateExport";
import { stripeConnectOnboard } from "../services/SmartAlbumServices/stripeConnectOnboard";
import { stripeConnectStatus } from "../services/SmartAlbumServices/stripeConnectStatus";
import { stripeConnectDisconnect } from "../services/SmartAlbumServices/stripeConnectDisconnect";
import { confirmSmartAlbumPayment } from "../services/PublicGalleryServices/confirmSmartAlbumPayment";
import { presignProductImage, confirmProductImage, removeProductImage } from "../services/SmartAlbumServices/productImages";

const smartAlbumRoutes = Router();

// ─── Photographer Album Configuration (Dashboard) ────────────────────────────

// GET /dashboard/smart-album/config
smartAlbumRoutes.get("/dashboard/smart-album/config", requireAuth, async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const result = await getConfig(userId);
  if (result.error) {
    return res.status(result.status || 500).json({ error: result.error });
  }
  res.json(result.data);
});

// PATCH /dashboard/smart-album/config
// Validation: enabled (boolean?), paymentMethod (OUTSIDE_FOTNO | INSIDE_FOTNO?)
smartAlbumRoutes.patch("/dashboard/smart-album/config", requireAuth, async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const result = await upsertConfig(userId, req.body);
  if (result.error) {
    return res.status(result.status || 500).json({ error: result.error });
  }
  res.json(result.data);
});

// POST /dashboard/smart-album/products
// Validation: name (string), widthCm (number > 0), heightCm (number > 0), coverType (string), paperType (string), maxSpreads (number >= 1), priceCents (number >= 0), currency? (string, default USD)
smartAlbumRoutes.post(
  "/dashboard/smart-album/products",
  requireAuth,
  requireActiveSubscriber,
  async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    const result = await createProduct(userId, req.body);
    if (result.error) {
      return res.status(result.status || 500).json({ error: result.error });
    }
    res.status(201).json(result.data);
  }
);

// PATCH /dashboard/smart-album/products/:productId
// Validation: name? (string), maxSpreads? (number >= 1), priceCents? (number >= 0), isActive? (boolean), plus page config and images
smartAlbumRoutes.patch(
  "/dashboard/smart-album/products/:productId",
  requireAuth,
  async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    const { productId } = req.params;
    const result = await updateProduct(userId, productId, req.body);
    if (result.error) {
      return res.status(result.status || 500).json({ error: result.error });
    }
    res.json(result.data);
  }
);

// DELETE /dashboard/smart-album/products/:productId
smartAlbumRoutes.delete(
  "/dashboard/smart-album/products/:productId",
  requireAuth,
  async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    const { productId } = req.params;
    const result = await deleteProduct(userId, productId);
    if (result.error) {
      return res.status(result.status || 500).json({ error: result.error });
    }
    res.json(result.data);
  }
);

// ─── Product Images ────────────────────────────────────────────────────────────

// POST /dashboard/smart-album/products/:productId/images/presign
// Body: { fileName, contentType }
smartAlbumRoutes.post(
  "/dashboard/smart-album/products/:productId/images/presign",
  requireAuth,
  async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    const { productId } = req.params;
    const result = await presignProductImage(userId, productId, req.body);
    if (result.error) {
      return res.status(result.status || 500).json({ error: result.error });
    }
    res.json(result.data);
  }
);

// POST /dashboard/smart-album/products/:productId/images
// Body: { key }
smartAlbumRoutes.post(
  "/dashboard/smart-album/products/:productId/images",
  requireAuth,
  async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    const { productId } = req.params;
    const result = await confirmProductImage(userId, productId, req.body);
    if (result.error) {
      return res.status(result.status || 500).json({ error: result.error });
    }
    res.json(result.data);
  }
);

// DELETE /dashboard/smart-album/products/:productId/images
// Body: { key }
smartAlbumRoutes.delete(
  "/dashboard/smart-album/products/:productId/images",
  requireAuth,
  async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    const { productId } = req.params;
    const result = await removeProductImage(userId, productId, req.body);
    if (result.error) {
      return res.status(result.status || 500).json({ error: result.error });
    }
    res.json(result.data);
  }
);

// ─── Client Album Design (Public Gallery) ─────────────────────────────────────

// GET /public/gallery/:shareToken/smart-album/products
smartAlbumRoutes.get(
  "/public/gallery/:shareToken/smart-album/products",
  async (req, res) => {
    const { shareToken } = req.params;
    const result = await getSmartAlbumProducts(shareToken);
    if (result.error) {
      return res.status(result.status || 500).json({ error: result.error });
    }
    res.json(result.products);
  }
);

// GET /public/gallery/:shareToken/smart-album/layouts
smartAlbumRoutes.get(
  "/public/gallery/:shareToken/smart-album/layouts",
  async (req, res) => {
    const result = await getSmartAlbumLayouts();
    res.json(result.layouts);
  }
);

// POST /public/gallery/:shareToken/smart-album/designs
// Body: { productId, clientName, clientEmail, title? }
smartAlbumRoutes.post(
  "/public/gallery/:shareToken/smart-album/designs",
  async (req, res) => {
    const { shareToken } = req.params;
    const result = await createSmartAlbumDesign(shareToken, req.body);
    if (result.error) {
      return res.status(result.status || 500).json({ error: result.error });
    }
    res.status(201).json(result.design);
  }
);

// GET /public/gallery/:shareToken/smart-album/designs
// Query: ?clientEmail=...
smartAlbumRoutes.get(
  "/public/gallery/:shareToken/smart-album/designs",
  async (req, res) => {
    const { shareToken } = req.params;
    const { clientEmail } = req.query;
    if (!clientEmail || typeof clientEmail !== "string") {
      return res.status(400).json({ error: "clientEmail query parameter required" });
    }
    const result = await listSmartAlbumDesigns(shareToken, clientEmail);
    if (result.error) {
      return res.status(result.status || 500).json({ error: result.error });
    }
    res.json(result.designs);
  }
);

// GET /public/gallery/:shareToken/smart-album/designs/:designId
smartAlbumRoutes.get(
  "/public/gallery/:shareToken/smart-album/designs/:designId",
  async (req, res) => {
    const { shareToken, designId } = req.params;
    const result = await getSmartAlbumDesign(shareToken, designId);
    if (result.error) {
      return res.status(result.status || 500).json({ error: result.error });
    }
    res.json(result.design);
  }
);

// PATCH /public/gallery/:shareToken/smart-album/designs/:designId
// Body: { designData?, title?, productId? }
smartAlbumRoutes.patch(
  "/public/gallery/:shareToken/smart-album/designs/:designId",
  async (req, res) => {
    const { shareToken, designId } = req.params;
    const result = await updateSmartAlbumDesign(shareToken, designId, req.body);
    if (result.error) {
      return res.status(result.status || 500).json({ error: result.error });
    }
    res.json(result.design);
  }
);

// POST /public/gallery/:shareToken/smart-album/designs/:designId/submit
// Validation: design must be DRAFT and have at least one image
smartAlbumRoutes.post(
  "/public/gallery/:shareToken/smart-album/designs/:designId/submit",
  async (req, res) => {
    const { shareToken, designId } = req.params;
    const result = await submitSmartAlbumDesign(shareToken, designId);
    if (result.error) {
      return res.status(result.status || 500).json({ error: result.error });
    }
    // Return submission + payment info (if INSIDE_FOTNO)
    const response: any = { submission: result.submission };
    if (result.payment) {
      response.payment = result.payment;
    }
    res.status(201).json(response);
  }
);

// POST /public/gallery/:shareToken/smart-album/designs/:designId/confirm-payment
// Body: { paymentIntentId: string }
smartAlbumRoutes.post(
  "/public/gallery/:shareToken/smart-album/designs/:designId/confirm-payment",
  async (req, res) => {
    const { shareToken, designId } = req.params;
    const { paymentIntentId } = req.body;
    if (!paymentIntentId || typeof paymentIntentId !== "string") {
      return res.status(400).json({ error: "paymentIntentId is required" });
    }
    const result = await confirmSmartAlbumPayment(shareToken, designId, paymentIntentId);
    if (result.error) {
      return res.status(result.status || 500).json({ error: result.error });
    }
    res.json(result.data);
  }
);

// ─── Photographer Review & Export (Dashboard) ──────────────────────────────────

// GET /dashboard/smart-album/submissions
// Query: ?status=PENDING&galleryId=...&page=1&pageSize=20
smartAlbumRoutes.get("/dashboard/smart-album/submissions", requireAuth, async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { status, galleryId, page, pageSize } = req.query;
  const result = await getSubmissions(userId, {
    status: typeof status === "string" ? status : undefined,
    galleryId: typeof galleryId === "string" ? galleryId : undefined,
    page: page ? Number(page) : undefined,
    pageSize: pageSize ? Number(pageSize) : undefined,
  });
  if (result.error) {
    return res.status(result.status || 500).json({ error: result.error });
  }
  res.json(result.data);
});

// GET /dashboard/smart-album/submissions/:submissionId
smartAlbumRoutes.get(
  "/dashboard/smart-album/submissions/:submissionId",
  requireAuth,
  async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    const { submissionId } = req.params;
    const result = await getSubmissionDetail(userId, submissionId);
    if (result.error) {
      return res.status(result.status || 500).json({ error: result.error });
    }
    res.json(result.data);
  }
);

// POST /dashboard/smart-album/submissions/:submissionId/review
// Body: { action: "approve" | "request_changes" | "reject", notes?: string, reason?: string }
smartAlbumRoutes.post(
  "/dashboard/smart-album/submissions/:submissionId/review",
  requireAuth,
  async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    const { submissionId } = req.params;
    const result = await reviewSubmission(userId, submissionId, req.body);
    if (result.error) {
      return res.status(result.status || 500).json({ error: result.error });
    }
    res.json(result.data);
  }
);

// POST /dashboard/smart-album/submissions/:submissionId/export
smartAlbumRoutes.post(
  "/dashboard/smart-album/submissions/:submissionId/export",
  requireAuth,
  async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    const { submissionId } = req.params;
    const force = req.query.force === "true" || req.body?.force === true;
    const result = await generateExport(userId, submissionId, force);
    if (result.error) {
      return res.status(result.status || 500).json({ error: result.error });
    }
    res.json(result.data);
  }
);

// ─── Stripe Connect (Dashboard) ────────────────────────────────────────────────

// POST /dashboard/smart-album/connect/onboard
smartAlbumRoutes.post(
  "/dashboard/smart-album/connect/onboard",
  requireAuth,
  async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    const result = await stripeConnectOnboard(userId);
    if (result.error) {
      return res.status(result.status || 500).json({ error: result.error });
    }
    res.json(result.data);
  }
);

// GET /dashboard/smart-album/connect/status
smartAlbumRoutes.get(
  "/dashboard/smart-album/connect/status",
  requireAuth,
  async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    const result = await stripeConnectStatus(userId);
    if (result.error) {
      return res.status(result.status || 500).json({ error: result.error });
    }
    res.json(result.data);
  }
);

// POST /dashboard/smart-album/connect/disconnect
smartAlbumRoutes.post(
  "/dashboard/smart-album/connect/disconnect",
  requireAuth,
  async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    const result = await stripeConnectDisconnect(userId);
    if (result.error) {
      return res.status(result.status || 500).json({ error: result.error });
    }
    res.json(result.data);
  }
);

export default smartAlbumRoutes;
