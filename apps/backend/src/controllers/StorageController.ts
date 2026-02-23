import type { Request, Response } from "express";
import AppError from "../errors/AppError";
import {
  getStorageSummary,
  listStorageEvents,
} from "../services/StorageServices";

const getUserId = (req: Request): string => {
  const userId = req.user?.id;
  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }
  return userId;
};

export const getStorageSummaryController = async (req: Request, res: Response) => {
  const userId = getUserId(req);

  const summary = await getStorageSummary(userId);

  return res.status(200).json({
    used: summary.used.toString(),
    limit: summary.limit.toString(),
    overageBytes: summary.overageBytes.toString(),
    percentage: summary.percentage,
    overageGB: summary.overageGB,
    overageCostCents: summary.overageCostCents,
    formatted: summary.formatted,
  });
};

export const getStorageEventsController = async (req: Request, res: Response) => {
  const userId = getUserId(req);

  const parsedLimit = Number(req.query.limit ?? 20);
  const parsedOffset = Number(req.query.offset ?? 0);
  const limit = Number.isFinite(parsedLimit)
    ? Math.min(100, Math.max(1, parsedLimit))
    : 20;
  const offset = Number.isFinite(parsedOffset) ? Math.max(0, parsedOffset) : 0;

  const result = await listStorageEvents(userId, limit, offset);

  return res.status(200).json(result);
};
