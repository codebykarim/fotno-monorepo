import { Request, Response } from "express";
import * as PublicGalleryServices from "../services/PublicGalleryServices";

const asStatusCode = (value: unknown, fallback: number): number =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

export const getPublicGalleryController = async (req: Request, res: Response) => {
  const gallery = await PublicGalleryServices.getPublicGallery(req.params.shareToken);
  if (!gallery) {
    return res.status(404).json({ error: "Gallery not found" });
  }
  if ("expired" in gallery) {
    return res.status(410).json({ error: "Gallery has expired" });
  }

  return res.status(200).json(gallery);
};

export const unlockPublicGalleryController = async (req: Request, res: Response) => {
  const password =
    typeof req.body?.password === "string" ? req.body.password : "";
  const result = await PublicGalleryServices.unlockPublicGallery(
    req.params.shareToken,
    password,
  );

  if ("error" in result) {
    return res.status(asStatusCode(result.status, 400)).json({ error: result.error });
  }

  return res.status(200).json({
    token: result.token,
    jwt: result.jwt,
    expiresAt: result.expiresAt,
  });
};

export const listGalleryCommentsController = async (req: Request, res: Response) => {
  const result = await PublicGalleryServices.listGalleryComments(
    req.params.shareToken,
  );
  return res.status(200).json(result);
};

export const createGalleryCommentController = async (req: Request, res: Response) => {
  const message =
    typeof req.body?.message === "string" ? req.body.message.trim() : "";

  if (!message) {
    return res.status(400).json({ error: "message is required" });
  }

  const result = await PublicGalleryServices.createGalleryComment({
    shareToken: req.params.shareToken,
    authorName: req.body?.authorName,
    authorRole: req.body?.authorRole,
    message,
    photoId: req.body?.photoId ?? null,
    parentId: req.body?.parentId ?? null,
    viewerId: req.body?.viewerId ?? null,
  });

  if ("error" in result) {
    return res.status(asStatusCode(result.status, 400)).json({ error: result.error });
  }

  return res.status(201).json(result);
};

export const editGalleryCommentController = async (req: Request, res: Response) => {
  const message =
    typeof req.body?.message === "string" ? req.body.message.trim() : "";
  const viewerId =
    typeof req.body?.viewerId === "string" ? req.body.viewerId : "";

  if (!message) {
    return res.status(400).json({ error: "message is required" });
  }
  if (!viewerId) {
    return res.status(400).json({ error: "viewerId is required" });
  }

  const result = await PublicGalleryServices.editGalleryComment({
    commentId: req.params.commentId,
    shareToken: req.params.shareToken,
    viewerId,
    message,
  });

  if ("error" in result) {
    return res.status(asStatusCode(result.status, 400)).json({ error: result.error });
  }

  return res.status(200).json(result);
};

export const deleteGalleryCommentController = async (req: Request, res: Response) => {
  const viewerId =
    typeof req.body?.viewerId === "string" ? req.body.viewerId : "";
  const isGalleryOwner = req.body?.isGalleryOwner === true;

  if (!viewerId) {
    return res.status(400).json({ error: "viewerId is required" });
  }

  const result = await PublicGalleryServices.deleteGalleryComment({
    commentId: req.params.commentId,
    shareToken: req.params.shareToken,
    viewerId,
    isGalleryOwner,
  });

  if ("error" in result) {
    return res.status(asStatusCode(result.status, 400)).json({ error: result.error });
  }

  return res.status(200).json(result);
};

export const toggleCommentLikeController = async (req: Request, res: Response) => {
  const viewerId =
    typeof req.body?.viewerId === "string" ? req.body.viewerId : "";

  if (!viewerId) {
    return res.status(400).json({ error: "viewerId is required" });
  }

  const result = await PublicGalleryServices.toggleCommentLike({
    commentId: req.params.commentId,
    shareToken: req.params.shareToken,
    viewerId,
  });

  if ("error" in result) {
    return res.status(asStatusCode(result.status, 400)).json({ error: result.error });
  }

  return res.status(200).json(result);
};

export const getPublicPhotoUrlController = async (req: Request, res: Response) => {
  const shareToken =
    typeof req.query.shareToken === "string" ? req.query.shareToken : "";
  const variant =
    typeof req.query.variant === "string" ? req.query.variant : "preview";

  if (!shareToken) {
    return res.status(400).json({ error: "shareToken is required" });
  }

  if (!["thumbnail", "preview", "original"].includes(variant)) {
    return res.status(400).json({ error: "Invalid variant" });
  }

  const result = await PublicGalleryServices.getPublicPhotoUrl(
    req.params.photoId,
    shareToken,
    variant,
  );

  if ("error" in result) {
    return res.status(asStatusCode(result.status, 400)).json({ error: result.error });
  }

  return res.status(200).json({ url: result.url });
};

// ─── Favorites ──────────────────────────────────────────────────────────────

export const addFavoriteController = async (req: Request, res: Response) => {
  const { photoId, viewerId, viewerName, note } = req.body ?? {};
  if (!photoId || !viewerId) {
    return res
      .status(400)
      .json({ error: "photoId and viewerId are required" });
  }

  const result = await PublicGalleryServices.addFavorite(
    req.params.shareToken,
    { photoId, viewerId, viewerName: viewerName || "", note },
  );
  if ("error" in result) {
    return res.status(asStatusCode(result.status, 400)).json({ error: result.error });
  }
  return res.status(201).json(result);
};

export const removeFavoriteController = async (req: Request, res: Response) => {
  const viewerId =
    typeof req.query.viewerId === "string" ? req.query.viewerId : "";
  if (!viewerId) {
    return res.status(400).json({ error: "viewerId is required" });
  }

  const result = await PublicGalleryServices.removeFavorite(
    req.params.shareToken,
    req.params.photoId,
    viewerId,
  );
  if ("error" in result) {
    return res.status(asStatusCode(result.status, 400)).json({ error: result.error });
  }
  return res.status(200).json(result);
};

export const listViewerFavoritesController = async (
  req: Request,
  res: Response,
) => {
  const viewerId =
    typeof req.query.viewerId === "string" ? req.query.viewerId : "";
  if (!viewerId) {
    return res.status(400).json({ error: "viewerId is required" });
  }

  const result = await PublicGalleryServices.listViewerFavorites(
    req.params.shareToken,
    viewerId,
  );
  if ("error" in result) {
    return res.status(asStatusCode(result.status, 400)).json({ error: result.error });
  }
  return res.status(200).json(result);
};

// ─── Download ───────────────────────────────────────────────────────────────

export const verifyDownloadPinController = async (
  req: Request,
  res: Response,
) => {
  const pin = typeof req.body?.pin === "string" ? req.body.pin : "";
  const result = await PublicGalleryServices.verifyDownloadPin(
    req.params.shareToken,
    pin,
  );
  if ("error" in result) {
    return res.status(asStatusCode(result.status, 400)).json({ error: result.error });
  }
  return res.status(200).json(result);
};

// ─── Favorite Shares ────────────────────────────────────────────────────────

export const createFavoriteShareController = async (
  req: Request,
  res: Response,
) => {
  const { viewerId, viewerName } = req.body ?? {};
  if (!viewerId || !viewerName) {
    return res
      .status(400)
      .json({ error: "viewerId and viewerName are required" });
  }

  const result = await PublicGalleryServices.createFavoriteShare(
    req.params.shareToken,
    { viewerId, viewerName },
  );
  if ("error" in result) {
    return res.status(asStatusCode(result.status, 400)).json({ error: result.error });
  }
  return res.status(200).json(result);
};

export const getSharedFavoritesController = async (
  req: Request,
  res: Response,
) => {
  const result = await PublicGalleryServices.getSharedFavorites(
    req.params.favoriteShareToken,
  );
  if ("error" in result) {
    return res.status(asStatusCode(result.status, 400)).json({ error: result.error });
  }
  return res.status(200).json(result);
};

export const trackDownloadController = async (req: Request, res: Response) => {
  const result = await PublicGalleryServices.trackDownload(
    req.params.shareToken,
    {
      photoId: req.body?.photoId,
      viewerName: req.body?.viewerName,
      viewerIp: req.ip,
      type: req.body?.type || "single",
    },
  );
  if ("error" in result) {
    const body: Record<string, unknown> = { error: result.error };
    if ("limitReached" in result) body.limitReached = result.limitReached;
    return res.status(asStatusCode(result.status, 400)).json(body);
  }
  return res.status(201).json(result);
};
