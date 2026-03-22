import { type Request, type Response } from "express";
import AppError from "../errors/AppError";
import * as DashboardService from "../services/DashboardServices";
import { withDetailedSpan, incrementMetric } from "../utils/datadog";

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
  const galleries = await withDetailedSpan(
    "gallery.list",
    {
      "usr.id": userId,
      "gallery.filter.status": String(req.query.status ?? "all"),
      "gallery.filter.sort": String(req.query.sort ?? "newest"),
      "gallery.filter.query": String(req.query.q ?? ""),
    },
    async (span) => {
      const result = await DashboardService.listGalleries(
        userId,
        String(req.query.q ?? ""),
        String(req.query.status ?? "all"),
        String(req.query.sort ?? "newest"),
      );
      span.setTag("gallery.count", result.length);
      return result;
    },
  );

  incrementMetric("gallery.list", 1, [`user:${userId}`]);
  return res.status(200).json({ galleries });
};

export const createGalleryController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const result = await withDetailedSpan(
    "gallery.create",
    {
      "usr.id": userId,
      "gallery.title": req.body?.title,
    },
    async (span) => {
      const r = await DashboardService.createGallery(userId, req.body);
      if ("gallery" in r) {
        span.setTag("gallery.id", r.gallery?.id);
      }
      return r;
    },
  );

  if ("error" in result) {
    incrementMetric("gallery.create.error", 1, [`user:${userId}`]);
    return res
      .status(asStatusCode(result.status, 400))
      .json({ error: result.error });
  }

  incrementMetric("gallery.create.success", 1, [`user:${userId}`]);
  return res
    .status(asStatusCode(result.status, 201))
    .json({ gallery: result.gallery });
};

export const getGalleryController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const galleryId = req.params.id;
  const result = await withDetailedSpan(
    "gallery.get",
    { "usr.id": userId, "gallery.id": galleryId },
    async (span) => {
      const r = await DashboardService.getGallery(userId, galleryId);
      if (r) {
        span.setTag("gallery.photo_count", (r as any).gallery?.photos?.length ?? 0);
        span.setTag("gallery.album_count", (r as any).gallery?.albums?.length ?? 0);
      }
      return r;
    },
  );
  if (!result) {
    return res.status(404).json({ error: "Gallery not found" });
  }

  return res.status(200).json(result);
};

export const updateGalleryController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const galleryId = req.params.id;
  const updatedFields = Object.keys(req.body || {});
  const result = await withDetailedSpan(
    "gallery.update",
    {
      "usr.id": userId,
      "gallery.id": galleryId,
      "gallery.updated_fields": updatedFields.join(","),
      "gallery.is_publishing": req.body?.isPublished !== undefined,
    },
    async () => DashboardService.updateGallery(userId, galleryId, req.body),
  );
  if (!result) {
    return res.status(404).json({ error: "Gallery not found" });
  }

  incrementMetric("gallery.update", 1, [`user:${userId}`]);
  return res.status(200).json(result);
};

export const deleteGalleryController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const galleryId = req.params.id;
  const deleted = await withDetailedSpan(
    "gallery.delete",
    { "usr.id": userId, "gallery.id": galleryId },
    async () => DashboardService.deleteGallery(userId, galleryId),
  );
  if (!deleted) {
    return res.status(404).json({ error: "Gallery not found" });
  }

  incrementMetric("gallery.delete", 1, [`user:${userId}`]);
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
  const result = await withDetailedSpan(
    "photo.presign_upload",
    {
      "usr.id": userId,
      "gallery.id": req.params.id,
      "photo.filename": req.body?.fileName,
      "photo.content_type": req.body?.contentType,
      "photo.size_bytes": req.body?.fileSize,
    },
    async () => DashboardService.presignPhotoUpload(userId, req.params.id, req.body),
  );
  if ("error" in result) {
    incrementMetric("photo.upload.error", 1, [`user:${userId}`]);
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
  const result = await withDetailedSpan(
    "photo.confirm_upload",
    {
      "usr.id": userId,
      "gallery.id": req.params.id,
      "photo.id": req.body?.photoId ?? req.body?.uploadId,
    },
    async (span) => {
      const r = await DashboardService.confirmPhotoUpload(
        userId,
        req.params.id,
        req.body?.photoId ?? req.body?.uploadId,
      );
      if ("photo" in r) {
        span.setTag("photo.confirmed_id", r.photo?.id);
      }
      return r;
    },
  );
  if ("error" in result) {
    incrementMetric("photo.confirm.error", 1, [`user:${userId}`]);
    return res
      .status(asStatusCode(result.status, 400))
      .json({ error: result.error });
  }

  incrementMetric("photo.upload.success", 1, [`user:${userId}`]);
  return res
    .status(asStatusCode(result.status, 201))
    .json({ photo: result.photo });
};

export const createAlbumController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const galleryId = req.params.id;
  const result = await withDetailedSpan(
    "album.create",
    {
      "usr.id": userId,
      "gallery.id": galleryId,
      "album.title": req.body?.title,
      "album.photo_count": Array.isArray(req.body?.photoIds) ? req.body.photoIds.length : 0,
    },
    async (span) => {
      const r = await DashboardService.createAlbum(userId, galleryId, req.body);
      if ("album" in r) {
        span.setTag("album.id", r.album?.id);
      }
      return r;
    },
  );
  if ("error" in result) {
    incrementMetric("album.create.error", 1, [`user:${userId}`]);
    return res
      .status(asStatusCode(result.status, 400))
      .json({ error: result.error });
  }

  incrementMetric("album.create.success", 1, [`user:${userId}`]);
  return res
    .status(asStatusCode(result.status, 201))
    .json({ album: result.album });
};

export const updateAlbumController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const result = await withDetailedSpan(
    "album.update",
    {
      "usr.id": userId,
      "gallery.id": req.params.id,
      "album.id": req.params.albumId,
      "album.updated_fields": Object.keys(req.body || {}).join(","),
    },
    async () => DashboardService.updateAlbum(userId, req.params.id, req.params.albumId, req.body),
  );
  if (!result) {
    return res.status(404).json({ error: "Album not found" });
  }

  incrementMetric("album.update", 1, [`user:${userId}`]);
  return res.status(200).json(result);
};

export const deleteAlbumController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const deleted = await withDetailedSpan(
    "album.delete",
    {
      "usr.id": userId,
      "gallery.id": req.params.id,
      "album.id": req.params.albumId,
    },
    async () => DashboardService.deleteAlbum(userId, req.params.id, req.params.albumId),
  );
  if (!deleted) {
    return res.status(404).json({ error: "Album not found" });
  }

  incrementMetric("album.delete", 1, [`user:${userId}`]);
  return res.status(200).json({ success: true });
};

export const listClientsController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const result = await DashboardService.listClients(userId);
  return res.status(200).json(result);
};

export const updateClientController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const result = await DashboardService.updateClient(
    userId,
    req.params.id,
    req.body,
  );
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
  const photoId = req.params.id;
  const deleted = await withDetailedSpan(
    "photo.delete",
    { "usr.id": userId, "photo.id": photoId },
    async () => DashboardService.deletePhoto(userId, photoId),
  );
  if (!deleted) {
    return res.status(404).json({ error: "Photo not found" });
  }

  incrementMetric("photo.delete", 1, [`user:${userId}`]);
  return res.status(200).json({ success: true });
};

export const getGalleryAiStatusController = async (
  req: Request,
  res: Response,
) => {
  const userId = getUserId(req);
  const result = await DashboardService.getGalleryAiStatus(
    userId,
    req.params.id,
  );
  if ("error" in result) {
    return res
      .status(asStatusCode(result.status, 400))
      .json({ error: result.error });
  }

  return res.status(200).json(result);
};

export const suggestAlbumController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const result = await DashboardService.suggestAlbum(
    userId,
    req.params.id,
    req.body?.prompt,
  );
  if ("error" in result) {
    return res
      .status(asStatusCode(result.status, 400))
      .json({ error: result.error });
  }

  return res.status(200).json(result);
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

export const gdriveFoldersController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const parentId = req.query.parentId ? String(req.query.parentId) : undefined;
  const result = await DashboardService.gdriveFolders(userId, parentId);
  if ("error" in result) {
    return res
      .status(asStatusCode(result.status, 400))
      .json({ error: result.error });
  }
  return res.status(200).json(result);
};

export const gdrivePhotoFoldersController = async (
  req: Request,
  res: Response,
) => {
  const userId = getUserId(req);
  const result = await DashboardService.gdrivePhotoFolders(userId);
  if ("error" in result) {
    return res
      .status(asStatusCode(result.status, 400))
      .json({ error: result.error });
  }
  return res.status(200).json(result);
};

export const gdriveFolderPreviewController = async (
  req: Request,
  res: Response,
) => {
  const userId = getUserId(req);
  const folderId = req.params.folderId;
  const result = await DashboardService.gdriveFolderPreview(userId, folderId);
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
  const result = await withDetailedSpan(
    "gallery.list_favorites",
    { "usr.id": userId, "gallery.id": req.params.id },
    async (span) => {
      const r = await DashboardService.listGalleryFavorites(userId, req.params.id);
      if (r) {
        span.setTag("gallery.favorites_total", (r as any).total ?? 0);
      }
      return r;
    },
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
  const result = await withDetailedSpan(
    "gallery.download_activity",
    {
      "usr.id": userId,
      "gallery.id": req.params.id,
      "pagination.limit": limit,
      "pagination.offset": offset,
    },
    async (span) => {
      const r = await DashboardService.getDownloadActivity(userId, req.params.id, limit, offset);
      if (r && Array.isArray(r.events)) {
        span.setTag("download.event_count", r.events.length);
      }
      return r;
    },
  );
  if (!result) {
    return res.status(404).json({ error: "Gallery not found" });
  }
  return res.status(200).json(result);
};
