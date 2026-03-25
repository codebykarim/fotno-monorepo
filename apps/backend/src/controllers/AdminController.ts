import { type Request, type Response } from "express";
import * as AdminService from "../services/AdminServices";
import { prisma } from "@workspace/db";
import AppError from "../errors/AppError";
import { invalidatePricingCaches } from "../services/SubscriptionServices/listPlans";
import { storageTierToBytes } from "../constants/storage";

export const getOverviewController = async (_req: Request, res: Response) => {
  const overview = await AdminService.getAdminOverview();
  return res.status(200).json(overview);
};

export const listUsersController = async (req: Request, res: Response) => {
  const search = String(req.query.q ?? "");
  const plan = String(req.query.plan ?? "all");
  const page = Math.max(1, Number(req.query.page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize) || 50));

  const result = await AdminService.listUsers(search, plan, page, pageSize);
  return res.status(200).json(result);
};

export const getUserController = async (req: Request, res: Response) => {
  const result = await AdminService.getUser(req.params.id);
  if (!result) {
    return res.status(404).json({ error: "User not found" });
  }
  return res.status(200).json(result);
};

export const banUserController = async (req: Request, res: Response) => {
  const result = await AdminService.banUser(req.params.id, req.body?.reason);
  return res.status(200).json(result);
};

export const unbanUserController = async (req: Request, res: Response) => {
  const result = await AdminService.unbanUser(req.params.id);
  return res.status(200).json(result);
};

export const setRoleController = async (req: Request, res: Response) => {
  const role = req.body?.role;
  if (!role || !["admin", "user"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }
  const result = await AdminService.setRole(req.params.id, role);
  return res.status(200).json(result);
};

export const impersonateUserController = async (req: Request, res: Response) => {
  const result = await AdminService.impersonateUser(req.params.id, req);
  return res.status(200).json(result);
};

export const listGalleriesController = async (req: Request, res: Response) => {
  const search = String(req.query.q ?? "");
  const status = String(req.query.status ?? "all");
  const page = Math.max(1, Number(req.query.page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize) || 50));

  const result = await AdminService.listAllGalleries(search, status, page, pageSize);
  return res.status(200).json(result);
};

export const listClientsController = async (req: Request, res: Response) => {
  const search = String(req.query.q ?? "");
  const page = Math.max(1, Number(req.query.page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize) || 50));

  const result = await AdminService.listAllClients(search, page, pageSize);
  return res.status(200).json(result);
};

export const getStorageOverviewController = async (_req: Request, res: Response) => {
  const result = await AdminService.getStorageOverview();
  return res.status(200).json(result);
};

export const getUserStorageController = async (req: Request, res: Response) => {
  const result = await AdminService.getUserStorage(req.params.id);
  if (!result) {
    return res.status(404).json({ error: "User not found" });
  }
  return res.status(200).json(result);
};

export const getUserSubscriptionsController = async (req: Request, res: Response) => {
  const result = await AdminService.getUserSubscriptions(req.params.id);
  return res.status(200).json(result);
};

export const getServiceHealthController = async (_req: Request, res: Response) => {
  const result = await AdminService.getServiceHealth();
  return res.status(200).json(result);
};

export const getAnalyticsController = async (req: Request, res: Response) => {
  const period = String(req.query.period ?? "30d");
  const result = await AdminService.getAnalytics(period);
  return res.status(200).json(result);
};

export const getPaymentsOverviewController = async (req: Request, res: Response) => {
  const status = String(req.query.status ?? "all");
  const source = String(req.query.source ?? "all");
  const page = Math.max(1, Number(req.query.page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize) || 50));

  const result = await AdminService.getPaymentsOverview(status, source, page, pageSize);
  return res.status(200).json(result);
};

// ── Pricing Management ─────────────────────────────────────────

export const getPricingConfigController = async (_req: Request, res: Response) => {
  const [tiers, regions] = await Promise.all([
    (prisma as any).pricingTier.findMany({
      orderBy: { sortOrder: "asc" },
    }),
    (prisma as any).regionalPricing.findMany({
      include: { tierOverrides: true },
      orderBy: { countryCode: "asc" },
    }),
  ]);

  return res.status(200).json({ tiers, regions });
};

export const createPricingTierController = async (req: Request, res: Response) => {
  const { gb, label, priceCents, lsVariantId, sortOrder, active, galleryLimit } = req.body;

  if (gb === undefined || !label || priceCents === undefined) {
    throw new AppError("gb, label, and priceCents are required", 400);
  }

  const tier = await (prisma as any).pricingTier.create({
    data: {
      gb: Number(gb),
      label,
      priceCents: Number(priceCents),
      lsVariantId: lsVariantId ?? null,
      galleryLimit: galleryLimit !== undefined && galleryLimit !== null && galleryLimit !== "" ? Number(galleryLimit) : null,
      sortOrder: sortOrder !== undefined ? Number(sortOrder) : 0,
      active: active !== undefined ? Boolean(active) : true,
    },
  });

  invalidatePricingCaches();
  return res.status(201).json(tier);
};

export const updatePricingTierController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { gb, label, priceCents, lsVariantId, sortOrder, active, galleryLimit } = req.body;

  const existing = await (prisma as any).pricingTier.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError("Pricing tier not found", 404);
  }

  const tier = await (prisma as any).pricingTier.update({
    where: { id },
    data: {
      ...(gb !== undefined && { gb: Number(gb) }),
      ...(label !== undefined && { label }),
      ...(priceCents !== undefined && { priceCents: Number(priceCents) }),
      ...(lsVariantId !== undefined && { lsVariantId }),
      ...(galleryLimit !== undefined && { galleryLimit: galleryLimit !== null && galleryLimit !== "" ? Number(galleryLimit) : null }),
      ...(sortOrder !== undefined && { sortOrder: Number(sortOrder) }),
      ...(active !== undefined && { active: Boolean(active) }),
    },
  });

  invalidatePricingCaches();

  // Cascade: if this is the free tier, update all FREE users' limits
  if (tier.priceCents === 0) {
    const newStorageLimit = storageTierToBytes(tier.gb);
    const newGalleryLimit = tier.galleryLimit;
    await (prisma as any).user.updateMany({
      where: { plan: "FREE" },
      data: {
        storageLimit: newStorageLimit,
        galleryLimit: newGalleryLimit,
      },
    });
    console.log(`[Admin] Cascaded free tier update to all FREE users: ${tier.gb} GB, galleryLimit=${newGalleryLimit}`);
  }

  return res.status(200).json(tier);
};

export const deletePricingTierController = async (req: Request, res: Response) => {
  const { id } = req.params;

  const existing = await (prisma as any).pricingTier.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError("Pricing tier not found", 404);
  }

  const tier = await (prisma as any).pricingTier.update({
    where: { id },
    data: { active: false },
  });

  invalidatePricingCaches();
  return res.status(200).json(tier);
};

export const createRegionalPricingController = async (req: Request, res: Response) => {
  const { countryCode, currency, symbol, locale, pppMultiplier, active, tierOverrides } = req.body;

  if (!countryCode || !currency || !symbol || !locale || pppMultiplier === undefined) {
    throw new AppError("countryCode, currency, symbol, locale, and pppMultiplier are required", 400);
  }

  const region = await (prisma as any).regionalPricing.create({
    data: {
      countryCode: countryCode.toUpperCase(),
      currency,
      symbol,
      locale,
      pppMultiplier: Number(pppMultiplier),
      active: active !== undefined ? Boolean(active) : true,
      ...(tierOverrides?.length && {
        tierOverrides: {
          create: tierOverrides.map((o: any) => ({
            tierGb: Number(o.tierGb),
            localPriceCents: Number(o.localPriceCents),
            checkoutCents: o.checkoutCents != null ? Number(o.checkoutCents) : null,
            storageOverrideGb: o.storageOverrideGb != null ? Number(o.storageOverrideGb) : null,
          })),
        },
      }),
    },
    include: { tierOverrides: true },
  });

  invalidatePricingCaches();
  return res.status(201).json(region);
};

export const updateRegionalPricingController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { countryCode, currency, symbol, locale, pppMultiplier, active, tierOverrides } = req.body;

  const existing = await (prisma as any).regionalPricing.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError("Regional pricing config not found", 404);
  }

  const region = await (prisma as any).$transaction(async (tx: any) => {
    // Update the regional pricing record
    const updated = await tx.regionalPricing.update({
      where: { id },
      data: {
        ...(countryCode !== undefined && { countryCode: countryCode.toUpperCase() }),
        ...(currency !== undefined && { currency }),
        ...(symbol !== undefined && { symbol }),
        ...(locale !== undefined && { locale }),
        ...(pppMultiplier !== undefined && { pppMultiplier: Number(pppMultiplier) }),
        ...(active !== undefined && { active: Boolean(active) }),
      },
    });

    // Replace tier overrides if provided
    if (tierOverrides !== undefined) {
      await tx.regionalTierOverride.deleteMany({
        where: { regionalPricingId: id },
      });

      if (tierOverrides.length > 0) {
        await tx.regionalTierOverride.createMany({
          data: tierOverrides.map((o: any) => ({
            regionalPricingId: id,
            tierGb: Number(o.tierGb),
            localPriceCents: Number(o.localPriceCents),
            checkoutCents: o.checkoutCents != null ? Number(o.checkoutCents) : null,
            storageOverrideGb: o.storageOverrideGb != null ? Number(o.storageOverrideGb) : null,
          })),
        });
      }
    }

    return tx.regionalPricing.findUnique({
      where: { id },
      include: { tierOverrides: true },
    });
  });

  invalidatePricingCaches();
  return res.status(200).json(region);
};

export const deleteRegionalPricingController = async (req: Request, res: Response) => {
  const { id } = req.params;

  const existing = await (prisma as any).regionalPricing.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError("Regional pricing config not found", 404);
  }

  const region = await (prisma as any).regionalPricing.update({
    where: { id },
    data: { active: false },
    include: { tierOverrides: true },
  });

  invalidatePricingCaches();
  return res.status(200).json(region);
};
