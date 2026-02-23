import { Request, Response } from "express";
import * as PublicGalleryServices from "../services/PublicGalleryServices";

export const getPublicGalleryController = async (req: Request, res: Response) => {
  const gallery = await PublicGalleryServices.getPublicGallery(req.params.shareToken);
  if (!gallery) {
    return res.status(404).json({ error: "Gallery not found" });
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
    return res.status(result.status).json({ error: result.error });
  }

  return res.status(200).json({
    token: result.token,
    jwt: result.jwt,
    expiresAt: result.expiresAt,
  });
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
    return res.status(result.status).json({ error: result.error });
  }

  return res.status(200).json({ url: result.url });
};
