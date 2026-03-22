import { Request, Response } from "express";
import * as PublicGalleryServices from "../services/PublicGalleryServices";
import { withDetailedSpan, incrementMetric } from "../utils/datadog";

const asStatusCode = (value: unknown, fallback: number): number =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

export const getPublicGalleryController = async (req: Request, res: Response) => {
  const shareToken = req.params.shareToken;
  const gallery = await withDetailedSpan(
    "public_gallery.view",
    {
      "gallery.share_token": shareToken,
      "viewer.ip": req.ip,
      "viewer.user_agent": req.headers["user-agent"],
    },
    async (span) => {
      const r = await PublicGalleryServices.getPublicGallery(shareToken);
      if (r && !("expired" in r)) {
        span.setTag("gallery.id", (r as any).id);
        span.setTag("gallery.photo_count", (r as any).photos?.length ?? 0);
        span.setTag("gallery.is_password_protected", !!(r as any).passwordHash);
      }
      return r;
    },
  );
  if (!gallery) {
    incrementMetric("public_gallery.not_found", 1);
    return res.status(404).json({ error: "Gallery not found" });
  }
  if ("expired" in gallery) {
    incrementMetric("public_gallery.expired", 1);
    return res.status(410).json({ error: "Gallery has expired" });
  }

  incrementMetric("public_gallery.view", 1);
  return res.status(200).json(gallery);
};

export const unlockPublicGalleryController = async (req: Request, res: Response) => {
  const shareToken = req.params.shareToken;
  const password =
    typeof req.body?.password === "string" ? req.body.password : "";
  const result = await withDetailedSpan(
    "public_gallery.unlock",
    {
      "gallery.share_token": shareToken,
      "viewer.ip": req.ip,
    },
    async (span) => {
      const r = await PublicGalleryServices.unlockPublicGallery(shareToken, password);
      span.setTag("unlock.success", !("error" in r));
      return r;
    },
  );

  if ("error" in result) {
    incrementMetric("public_gallery.unlock.failed", 1);
    return res.status(asStatusCode(result.status, 400)).json({ error: result.error });
  }

  incrementMetric("public_gallery.unlock.success", 1);
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

  const result = await withDetailedSpan(
    "public_gallery.create_comment",
    {
      "gallery.share_token": req.params.shareToken,
      "comment.is_reply": !!req.body?.parentId,
      "comment.has_photo": !!req.body?.photoId,
      "viewer.id": req.body?.viewerId,
    },
    async () => PublicGalleryServices.createGalleryComment({
      shareToken: req.params.shareToken,
      authorName: req.body?.authorName,
      authorRole: req.body?.authorRole,
      message,
      photoId: req.body?.photoId ?? null,
      parentId: req.body?.parentId ?? null,
      viewerId: req.body?.viewerId ?? null,
    }),
  );

  if ("error" in result) {
    return res.status(asStatusCode(result.status, 400)).json({ error: result.error });
  }

  incrementMetric("public_gallery.comment.create", 1);
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

  const result = await withDetailedSpan(
    "public_gallery.photo_url",
    {
      "gallery.share_token": shareToken,
      "photo.id": req.params.photoId,
      "photo.variant": variant,
    },
    async () => PublicGalleryServices.getPublicPhotoUrl(req.params.photoId, shareToken, variant),
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

  const result = await withDetailedSpan(
    "public_gallery.add_favorite",
    {
      "gallery.share_token": req.params.shareToken,
      "photo.id": photoId,
      "viewer.id": viewerId,
      "viewer.name": viewerName,
    },
    async () => PublicGalleryServices.addFavorite(
      req.params.shareToken,
      { photoId, viewerId, viewerName: viewerName || "", note },
    ),
  );
  if ("error" in result) {
    return res.status(asStatusCode(result.status, 400)).json({ error: result.error });
  }
  incrementMetric("public_gallery.favorite.add", 1);
  return res.status(201).json(result);
};

export const removeFavoriteController = async (req: Request, res: Response) => {
  const viewerId =
    typeof req.query.viewerId === "string" ? req.query.viewerId : "";
  if (!viewerId) {
    return res.status(400).json({ error: "viewerId is required" });
  }

  const result = await withDetailedSpan(
    "public_gallery.remove_favorite",
    {
      "gallery.share_token": req.params.shareToken,
      "photo.id": req.params.photoId,
      "viewer.id": viewerId,
    },
    async () => PublicGalleryServices.removeFavorite(req.params.shareToken, req.params.photoId, viewerId),
  );
  if ("error" in result) {
    return res.status(asStatusCode(result.status, 400)).json({ error: result.error });
  }
  incrementMetric("public_gallery.favorite.remove", 1);
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
  const result = await withDetailedSpan(
    "public_gallery.verify_download_pin",
    {
      "gallery.share_token": req.params.shareToken,
      "viewer.ip": req.ip,
    },
    async (span) => {
      const r = await PublicGalleryServices.verifyDownloadPin(req.params.shareToken, pin);
      span.setTag("pin.valid", !("error" in r));
      return r;
    },
  );
  if ("error" in result) {
    incrementMetric("public_gallery.pin.failed", 1);
    return res.status(asStatusCode(result.status, 400)).json({ error: result.error });
  }
  incrementMetric("public_gallery.pin.success", 1);
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

  const result = await withDetailedSpan(
    "public_gallery.create_favorite_share",
    {
      "gallery.share_token": req.params.shareToken,
      "viewer.id": viewerId,
      "viewer.name": viewerName,
    },
    async (span) => {
      const r = await PublicGalleryServices.createFavoriteShare(
        req.params.shareToken,
        { viewerId, viewerName },
      );
      if (!("error" in r)) {
        span.setTag("favorite_share.token", (r as any).shareToken);
      }
      return r;
    },
  );
  if ("error" in result) {
    return res.status(asStatusCode(result.status, 400)).json({ error: result.error });
  }
  incrementMetric("public_gallery.favorite_share.create", 1);
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
  const downloadType = req.body?.type || "single";
  const result = await withDetailedSpan(
    "public_gallery.track_download",
    {
      "gallery.share_token": req.params.shareToken,
      "photo.id": req.body?.photoId,
      "viewer.id": req.body?.viewerId,
      "viewer.name": req.body?.viewerName,
      "viewer.ip": req.ip,
      "download.type": downloadType,
    },
    async (span) => {
      const r = await PublicGalleryServices.trackDownload(
        req.params.shareToken,
        {
          photoId: req.body?.photoId,
          viewerId: req.body?.viewerId,
          viewerName: req.body?.viewerName,
          viewerIp: req.ip,
          type: downloadType,
        },
      );
      if ("limitReached" in r) {
        span.setTag("download.limit_reached", true);
      }
      return r;
    },
  );
  if ("error" in result) {
    incrementMetric("public_gallery.download.error", 1, [`type:${downloadType}`]);
    const body: Record<string, unknown> = { error: result.error };
    if ("limitReached" in result) body.limitReached = result.limitReached;
    return res.status(asStatusCode(result.status, 400)).json(body);
  }
  incrementMetric("public_gallery.download", 1, [`type:${downloadType}`]);
  return res.status(201).json(result);
};
