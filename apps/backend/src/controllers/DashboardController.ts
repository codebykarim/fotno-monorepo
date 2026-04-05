import { type Request, type Response } from "express";
import AppError from "../errors/AppError";
import * as DashboardService from "../services/DashboardServices";
import { withSpan, captureWithContext } from "../utils/sentry";

const asStatusCode = (value: unknown, fallback: number): number =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

const getUserId = (req: Request): string => {
  const userId = req.user?.id;
  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }
  return userId;
};

export const getOverviewController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const overview = await DashboardService.getOverview(userId);
  return res.status(200).json(overview);
};

export const listGalleriesController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const galleries = await DashboardService.listGalleries(
    userId,
    String(req.query.q ?? ""),
    String(req.query.status ?? "all"),
    String(req.query.sort ?? "newest"),
  );

  return res.status(200).json({ galleries });
};

export const createGalleryController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const result = await withSpan("gallery.create", { userId, title: req.body?.title }, () =>
    DashboardService.createGallery(userId, req.body),
  );
  if ("error" in result) {
    return res
      .status(asStatusCode(result.status, 400))
      .json({ error: result.error });
  }

  return res
    .status(asStatusCode(result.status, 201))
    .json({ gallery: result.gallery });
};

export const getGalleryController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const result = await DashboardService.getGallery(userId, req.params.id);
  if (!result) {
    return res.status(404).json({ error: "Gallery not found" });
  }

  return res.status(200).json(result);
};

export const getGalleryPhotosController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const limit = Number(req.query.limit) || 50;
  const offset = Number(req.query.offset) || 0;
  const result = await DashboardService.getGalleryPhotos(
    userId,
    req.params.id,
    limit,
    offset,
  );
  if (!result) {
    return res.status(404).json({ error: "Gallery not found" });
  }

  return res.status(200).json(result);
};

export const updateGalleryController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const result = await withSpan(
    "gallery.update",
    { userId, galleryId: req.params.id, fields: Object.keys(req.body || {}).join(",") },
    () => DashboardService.updateGallery(userId, req.params.id, req.body),
  );
  if (!result) {
    return res.status(404).json({ error: "Gallery not found" });
  }

  return res.status(200).json(result);
};

export const deleteGalleryController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const deleted = await withSpan("gallery.delete", { userId, galleryId: req.params.id }, () =>
    DashboardService.deleteGallery(userId, req.params.id),
  );
  if (!deleted) {
    return res.status(404).json({ error: "Gallery not found" });
  }

  return res.status(200).json({ success: true, cleanupEnqueued: true });
};

export const reorderGalleryPhotosController = async (
  req: Request,
  res: Response,
) => {
  const userId = getUserId(req);
  const items = Array.isArray(req.body?.items) ? req.body.items : [];
  const reordered = await DashboardService.reorderGalleryPhotos(
    userId,
    req.params.id,
    items,
  );
  if (!reordered) {
    return res.status(404).json({ error: "Gallery not found" });
  }

  return res.status(200).json({ success: true });
};

export const presignPhotoUploadController = async (
  req: Request,
  res: Response,
) => {
  const userId = getUserId(req);
  const result = await withSpan(
    "photo.presign_upload",
    { userId, galleryId: req.params.id, fileName: req.body?.fileName, fileSize: req.body?.fileSize },
    () => DashboardService.presignPhotoUpload(userId, req.params.id, req.body),
  );
  if ("error" in result) {
    return res
      .status(asStatusCode(result.status, 400))
      .json({ error: result.error });
  }

  return res.status(200).json(result);
};

export const getPhotoUploadSessionsController = async (
  req: Request,
  res: Response,
) => {
  const userId = getUserId(req);
  const result = await DashboardService.getPhotoUploadSessions(
    userId,
    req.params.id,
  );
  if ("error" in result) {
    return res
      .status(asStatusCode(result.status, 400))
      .json({ error: result.error });
  }

  return res
    .status(asStatusCode(result.status, 200))
    .json({ sessions: result.sessions });
};

export const partCompletePhotoUploadController = async (
  req: Request,
  res: Response,
) => {
  const userId = getUserId(req);
  const result = await DashboardService.partCompletePhotoUpload(
    userId,
    req.params.id,
    req.body,
  );

  if ("error" in result) {
    return res
      .status(asStatusCode(result.status, 400))
      .json({ error: result.error });
  }

  return res.status(200).json(result);
};

export const confirmPhotoUploadController = async (
  req: Request,
  res: Response,
) => {
  const userId = getUserId(req);
  const photoId = req.body?.photoId ?? req.body?.uploadId;
  const result = await withSpan(
    "photo.confirm_upload",
    { userId, galleryId: req.params.id, photoId },
    () => DashboardService.confirmPhotoUpload(userId, req.params.id, photoId),
  );
  if ("error" in result) {
    return res
      .status(asStatusCode(result.status, 400))
      .json({ error: result.error });
  }

  return res
    .status(asStatusCode(result.status, 201))
    .json({ photo: result.photo });
};

export const createAlbumController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const result = await withSpan(
    "album.create",
    { userId, galleryId: req.params.id, title: req.body?.title },
    () => DashboardService.createAlbum(userId, req.params.id, req.body),
  );
  if ("error" in result) {
    return res
      .status(asStatusCode(result.status, 400))
      .json({ error: result.error });
  }

  return res
    .status(asStatusCode(result.status, 201))
    .json({ album: result.album });
};

export const updateAlbumController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const result = await withSpan(
    "album.update",
    { userId, galleryId: req.params.id, albumId: req.params.albumId },
    () => DashboardService.updateAlbum(userId, req.params.id, req.params.albumId, req.body),
  );
  if (!result) {
    return res.status(404).json({ error: "Album not found" });
  }

  return res.status(200).json(result);
};

export const deleteAlbumController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const deleted = await withSpan(
    "album.delete",
    { userId, galleryId: req.params.id, albumId: req.params.albumId },
    () => DashboardService.deleteAlbum(userId, req.params.id, req.params.albumId),
  );
  if (!deleted) {
    return res.status(404).json({ error: "Album not found" });
  }

  return res.status(200).json({ success: true });
};

export const updatePhotoController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const result = await DashboardService.updatePhotoLoved(
    userId,
    req.params.id,
    Boolean(req.body?.loved),
  );
  if (!result) {
    return res.status(404).json({ error: "Photo not found" });
  }

  return res.status(200).json(result);
};

export const deletePhotoController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const deleted = await withSpan("photo.delete", { userId, photoId: req.params.id }, () =>
    DashboardService.deletePhoto(userId, req.params.id),
  );
  if (!deleted) {
    return res.status(404).json({ error: "Photo not found" });
  }

  return res.status(200).json({ success: true });
};

// ─── Google Drive Import ────────────────────────────────────────────────────

export const gdriveAuthStatusController = async (
  req: Request,
  res: Response,
) => {
  const userId = getUserId(req);
  const result = await DashboardService.gdriveAuthStatus(userId);
  return res.status(200).json(result);
};

export const gdriveDisconnectController = async (
  req: Request,
  res: Response,
) => {
  const userId = getUserId(req);
  const result = await DashboardService.gdriveDisconnect(userId);
  if ("error" in result) {
    return res
      .status(asStatusCode(result.status, 400))
      .json({ error: result.error });
  }
  return res.status(200).json(result);
};

export const gdriveAccessTokenController = async (
  req: Request,
  res: Response,
) => {
  const userId = getUserId(req);
  const result = await DashboardService.gdriveAccessToken(userId);
  if ("error" in result) {
    return res
      .status(asStatusCode(result.status, 400))
      .json({ error: result.error });
  }
  return res.status(200).json(result);
};

export const gdriveStartImportController = async (
  req: Request,
  res: Response,
) => {
  const userId = getUserId(req);
  const result = await DashboardService.gdriveStartImport(userId, req.body);
  if ("error" in result) {
    return res
      .status(asStatusCode(result.status, 400))
      .json({ error: result.error });
  }
  return res.status(201).json(result);
};

export const gdriveImportStatusController = async (
  req: Request,
  res: Response,
) => {
  const userId = getUserId(req);
  const result = await DashboardService.gdriveImportStatus(
    userId,
    req.params.jobId,
  );
  if ("error" in result) {
    return res
      .status(asStatusCode(result.status, 400))
      .json({ error: result.error });
  }
  return res.status(200).json(result);
};

export const gdriveListImportsController = async (
  req: Request,
  res: Response,
) => {
  const userId = getUserId(req);
  const result = await DashboardService.gdriveListImports(userId);
  return res.status(200).json(result);
};

export const gdriveCancelImportController = async (
  req: Request,
  res: Response,
) => {
  const userId = getUserId(req);
  const result = await DashboardService.gdriveCancelImport(
    userId,
    req.params.jobId,
  );
  if ("error" in result) {
    return res
      .status(asStatusCode(result.status, 400))
      .json({ error: result.error });
  }
  return res.status(200).json(result);
};

// ─── Google Photos Import ───────────────────────────────────────────────────

export const gphotosAuthStatusController = async (
  req: Request,
  res: Response,
) => {
  const userId = getUserId(req);
  const result = await DashboardService.gphotosAuthStatus(userId);
  return res.status(200).json(result);
};

export const gphotosDisconnectController = async (
  req: Request,
  res: Response,
) => {
  const userId = getUserId(req);
  const result = await DashboardService.gphotosDisconnect(userId);
  if ("error" in result) {
    return res
      .status(asStatusCode(result.status, 400))
      .json({ error: result.error });
  }
  return res.status(200).json(result);
};
export const gphotosCreateSessionController = async (
  req: Request,
  res: Response,
) => {
  const userId = getUserId(req);
  const result = await DashboardService.gphotosCreateSession(userId);
  if ("error" in result) {
    return res
      .status(asStatusCode(result.status, 400))
      .json({ error: result.error });
  }
  return res.status(201).json(result);
};

export const gphotosSessionStatusController = async (
  req: Request,
  res: Response,
) => {
  const userId = getUserId(req);
  const sessionId = req.params.sessionId;
  const result = await DashboardService.gphotosSessionStatus(userId, sessionId);
  if ("error" in result) {
    return res
      .status(asStatusCode(result.status, 400))
      .json({ error: result.error });
  }
  return res.status(200).json(result);
};

export const gphotosPickedItemsController = async (
  req: Request,
  res: Response,
) => {
  const userId = getUserId(req);
  const sessionId = req.params.sessionId;
  const result = await DashboardService.gphotosPickedItems(userId, sessionId);
  if ("error" in result) {
    return res
      .status(asStatusCode(result.status, 400))
      .json({ error: result.error });
  }
  return res.status(200).json(result);
};

export const gphotosProxyImageController = async (
  req: Request,
  res: Response,
) => {
  const userId = getUserId(req);
  const url = String(req.query.url ?? "");
  const result = await DashboardService.gphotosProxyImage(userId, url);
  if ("error" in result) {
    return res
      .status(asStatusCode(result.status, 400))
      .json({ error: result.error });
  }
  res.setHeader("Content-Type", result.contentType);
  res.setHeader("Cache-Control", "private, max-age=3600");
  return res.send(result.buffer);
};

export const gphotosStartImportController = async (
  req: Request,
  res: Response,
) => {
  const userId = getUserId(req);
  const result = await DashboardService.gphotosStartImport(userId, req.body);
  if ("error" in result) {
    return res
      .status(asStatusCode(result.status, 400))
      .json({ error: result.error });
  }
  return res.status(201).json(result);
};

// ─── Gallery Favorites ──────────────────────────────────────────────────────

export const listGalleryFavoritesController = async (
  req: Request,
  res: Response,
) => {
  const userId = getUserId(req);
  const result = await DashboardService.listGalleryFavorites(
    userId,
    req.params.id,
  );
  if (!result) {
    return res.status(404).json({ error: "Gallery not found" });
  }
  return res.status(200).json(result);
};

// ─── Download Activity ──────────────────────────────────────────────────────

export const getDownloadActivityController = async (
  req: Request,
  res: Response,
) => {
  const userId = getUserId(req);
  const limit = Math.min(Number(req.query.limit) || 50, 200);
  const offset = Number(req.query.offset) || 0;
  const result = await DashboardService.getDownloadActivity(
    userId,
    req.params.id,
    limit,
    offset,
  );
  if (!result) {
    return res.status(404).json({ error: "Gallery not found" });
  }
  return res.status(200).json(result);
};

// ─── Photo Processing Status ───────────────────────────────────────────────

export const getGalleryProcessingStatusController = async (
  req: Request,
  res: Response,
) => {
  const userId = getUserId(req);
  const result = await DashboardService.getGalleryProcessingStatus(
    userId,
    req.params.id,
  );
  if (!result) {
    return res.status(404).json({ error: "Gallery not found" });
  }
  return res.status(200).json(result);
};

export const retryFailedPhotosController = async (
  req: Request,
  res: Response,
) => {
  const userId = getUserId(req);
  const result = await DashboardService.retryFailedPhotos(
    userId,
    req.params.id,
  );
  if (!result) {
    return res.status(404).json({ error: "Gallery not found" });
  }
  return res.status(200).json(result);
};

// ─── Gallery Comments ─────────────────────────────────────────────────────

export const listGalleryCommentsController = async (
  req: Request,
  res: Response,
) => {
  const userId = getUserId(req);
  const result = await DashboardService.listGalleryComments(
    userId,
    req.params.id,
  );
  if (!result) {
    return res.status(404).json({ error: "Gallery not found" });
  }
  return res.status(200).json(result);
};

export const createGalleryCommentController = async (
  req: Request,
  res: Response,
) => {
  const userId = getUserId(req);
  const { message, photoId, parentId } = req.body;
  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "Message is required" });
  }
  const result = await DashboardService.createGalleryComment(
    userId,
    req.params.id,
    message.trim(),
    photoId ?? null,
    parentId ?? null,
  );
  if (!result) {
    return res.status(404).json({ error: "Gallery not found" });
  }
  return res.status(201).json(result);
};

export const editGalleryCommentController = async (
  req: Request,
  res: Response,
) => {
  const userId = getUserId(req);
  const { message } = req.body;
  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "Message is required" });
  }
  const result = await DashboardService.editGalleryComment(
    userId,
    req.params.id,
    req.params.commentId,
    message.trim(),
  );
  if (!result) {
    return res.status(404).json({ error: "Gallery not found" });
  }
  if ("error" in result) {
    return res.status(result.status).json({ error: result.error });
  }
  return res.status(200).json(result);
};

export const deleteGalleryCommentController = async (
  req: Request,
  res: Response,
) => {
  const userId = getUserId(req);
  const result = await DashboardService.deleteGalleryComment(
    userId,
    req.params.id,
    req.params.commentId,
  );
  if (!result) {
    return res.status(404).json({ error: "Gallery not found" });
  }
  if ("error" in result) {
    return res.status(result.status).json({ error: result.error });
  }
  return res.status(200).json(result);
};

export const toggleGalleryCommentLikeController = async (
  req: Request,
  res: Response,
) => {
  const userId = getUserId(req);
  const result = await DashboardService.toggleGalleryCommentLike(
    userId,
    req.params.id,
    req.params.commentId,
  );
  if (!result) {
    return res.status(404).json({ error: "Gallery not found" });
  }
  if ("error" in result) {
    return res.status(result.status).json({ error: result.error });
  }
  return res.status(200).json(result);
};
