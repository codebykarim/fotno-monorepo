import { Request, Response, NextFunction } from "express";
import { prisma } from "@workspace/db";
import AppError from "../errors/AppError";
import { resolveUserAccess } from "../services/SubscriptionServices/resolveUserAccess";
import type { FeatureKey } from "../constants/features";

/**
 * Middleware for public gallery routes: checks whether the *gallery owner's*
 * plan includes the given feature. Extracts shareToken from req.params.
 * Throws 403 if the feature is not available.
 */
export const requireGalleryOwnerFeature = (featureKey: FeatureKey) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const shareToken = req.params.shareToken;
    if (!shareToken) {
      throw new AppError("Missing shareToken", 400);
    }

    const gallery = await prisma.gallery.findFirst({
      where: { OR: [{ shareToken }, { slug: shareToken }] },
      select: { userId: true },
    });

    if (!gallery) {
      throw new AppError("Gallery not found", 404);
    }

    const access = await resolveUserAccess(gallery.userId);
    if (!access.features.includes(featureKey)) {
      throw new AppError("This feature is not available on the gallery owner's plan.", 403);
    }

    next();
  };
};
