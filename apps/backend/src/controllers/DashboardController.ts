import { type Request, type Response } from "express";
import AppError from "../errors/AppError";
import * as DashboardService from "../services/DashboardServices";

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
  const result = await DashboardService.createGallery(userId, req.body);
  if ("error" in result) {
    return res.status(asStatusCode(result.status, 400)).json({ error: result.error });
  }

  return res.status(asStatusCode(result.status, 201)).json({ gallery: result.gallery });
};

export const getGalleryController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const result = await DashboardService.getGallery(userId, req.params.id);
  if (!result) {
    return res.status(404).json({ error: "Gallery not found" });
  }

  return res.status(200).json(result);
};

export const updateGalleryController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const result = await DashboardService.updateGallery(userId, req.params.id, req.body);
  if (!result) {
    return res.status(404).json({ error: "Gallery not found" });
  }

  return res.status(200).json(result);
};

export const deleteGalleryController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const deleted = await DashboardService.deleteGallery(userId, req.params.id);
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

export const presignPhotoUploadController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const result = await DashboardService.presignPhotoUpload(userId, req.params.id, req.body);
  if ("error" in result) {
    return res.status(asStatusCode(result.status, 400)).json({ error: result.error });
  }

  return res.status(200).json(result);
};

export const getPhotoUploadSessionsController = async (
  req: Request,
  res: Response,
) => {
  const userId = getUserId(req);
  const result = await DashboardService.getPhotoUploadSessions(userId, req.params.id);
  if ("error" in result) {
    return res.status(asStatusCode(result.status, 400)).json({ error: result.error });
  }

  return res.status(asStatusCode(result.status, 200)).json({ sessions: result.sessions });
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
    return res.status(asStatusCode(result.status, 400)).json({ error: result.error });
  }

  return res.status(200).json(result);
};

export const confirmPhotoUploadController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const result = await DashboardService.confirmPhotoUpload(
    userId,
    req.params.id,
    req.body?.photoId ?? req.body?.uploadId,
  );
  if ("error" in result) {
    return res.status(asStatusCode(result.status, 400)).json({ error: result.error });
  }

  return res.status(asStatusCode(result.status, 201)).json({ photo: result.photo });
};

export const createAlbumController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const result = await DashboardService.createAlbum(userId, req.params.id, req.body);
  if ("error" in result) {
    return res.status(asStatusCode(result.status, 400)).json({ error: result.error });
  }

  return res.status(asStatusCode(result.status, 201)).json({ album: result.album });
};

export const updateAlbumController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const result = await DashboardService.updateAlbum(
    userId,
    req.params.id,
    req.params.albumId,
    req.body,
  );
  if (!result) {
    return res.status(404).json({ error: "Album not found" });
  }

  return res.status(200).json(result);
};

export const deleteAlbumController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const deleted = await DashboardService.deleteAlbum(
    userId,
    req.params.id,
    req.params.albumId,
  );
  if (!deleted) {
    return res.status(404).json({ error: "Album not found" });
  }

  return res.status(200).json({ success: true });
};

export const listClientsController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const result = await DashboardService.listClients(userId);
  return res.status(200).json(result);
};

export const updateClientController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const result = await DashboardService.updateClient(userId, req.params.id, req.body);
  if (!result) {
    return res.status(404).json({ error: "Client not found" });
  }

  return res.status(200).json(result);
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
  const deleted = await DashboardService.deletePhoto(userId, req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: "Photo not found" });
  }

  return res.status(200).json({ success: true });
};
