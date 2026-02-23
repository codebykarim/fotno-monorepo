import type { Request, Response } from "express";
import {
  getStorageSummary,
  listStorageEvents,
} from "../services/StorageServices";
import { resolveOwnerUserId } from "../services/DashboardServices";

export const getStorageSummaryController = async (req: Request, res: Response) => {
  const userId = req.user?.id ?? (await resolveOwnerUserId());

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
  const userId = req.user?.id ?? (await resolveOwnerUserId());

  const parsedLimit = Number(req.query.limit ?? 20);
  const parsedOffset = Number(req.query.offset ?? 0);
  const limit = Number.isFinite(parsedLimit)
    ? Math.min(100, Math.max(1, parsedLimit))
    : 20;
  const offset = Number.isFinite(parsedOffset) ? Math.max(0, parsedOffset) : 0;

  const result = await listStorageEvents(userId, limit, offset);

  return res.status(200).json(result);
};
