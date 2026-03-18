import { Request, Response, NextFunction } from "express";
import AppError from "../errors/AppError";
import { resolveUserAccess } from "../services/SubscriptionServices/resolveUserAccess";

const isActiveSubscriber = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }

  const access = await resolveUserAccess(userId);

  if (!access.canUpload) {
    throw new AppError("SUBSCRIPTION_REQUIRED", 403);
  }
};

export default isActiveSubscriber;
