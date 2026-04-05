import { Request, Response, NextFunction } from "express";
import AppError from "../errors/AppError";
import { resolveUserAccess } from "../services/SubscriptionServices/resolveUserAccess";
import { FEATURE_LABELS } from "../constants/features";
import type { FeatureKey } from "../constants/features";

/**
 * Middleware factory: checks whether the authenticated user's plan
 * includes the given feature key. Returns 403 if the feature is not available.
 */
export const requireFeature = (featureKey: FeatureKey) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const access = await resolveUserAccess(userId);
    if (!access.features.includes(featureKey)) {
      const label = FEATURE_LABELS[featureKey] ?? featureKey;
      throw new AppError(
        `${label} requires a higher plan. Please upgrade to access this feature.`,
        403,
      );
    }

    next();
  };
};
