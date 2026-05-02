import { type Request, type Response } from "express";
import * as AdminService from "../services/AdminServices";
import { prisma } from "@workspace/db";
import AppError from "../errors/AppError";
import { invalidatePricingCaches } from "../services/SubscriptionServices/listPlans";
import { storageTierToBytes } from "../constants/storage";
import { stripe } from "../services/SubscriptionServices/stripe";

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
  const [rawTiers, regions] = await Promise.all([
    prisma.pricingTier.findMany({
      orderBy: { sortOrder: "asc" },
      include: { features: { select: { featureKey: true } } },
    }),
    prisma.regionalPricing.findMany({
      include: { tierOverrides: true },
      orderBy: { countryCode: "asc" },
    }),
  ]);

  const tiers = rawTiers.map((tier: any) => ({
    ...tier,
    features: tier.features.map((f: { featureKey: string }) => f.featureKey),
  }));

  return res.status(200).json({ tiers, regions });
};

export const createPricingTierController = async (req: Request, res: Response) => {
  const {
    gb,
    label,
    priceCents,
    priceCentsAnnual,
    stripePriceId,
    stripePriceIdAnnual,
    sortOrder,
    active,
    galleryLimit,
    features,
  } = req.body;

  if (gb === undefined || !label || priceCents === undefined) {
    throw new AppError("gb, label, and priceCents are required", 400);
  }

  const tier = await prisma.$transaction(async (tx: any) => {
    const created = await tx.pricingTier.create({
      data: {
        gb: Number(gb),
        label,
        priceCents: Number(priceCents),
        priceCentsAnnual:
          priceCentsAnnual !== undefined && priceCentsAnnual !== null && priceCentsAnnual !== ""
            ? Number(priceCentsAnnual)
            : null,
        stripePriceId: stripePriceId ?? null,
        stripePriceIdAnnual: stripePriceIdAnnual ?? null,
        galleryLimit: galleryLimit !== undefined && galleryLimit !== null && galleryLimit !== "" ? Number(galleryLimit) : null,
        sortOrder: sortOrder !== undefined ? Number(sortOrder) : 0,
        active: active !== undefined ? Boolean(active) : true,
      },
    });

    if (Array.isArray(features) && features.length > 0) {
      await tx.tierFeature.createMany({
        data: features.map((featureKey: string) => ({
          tierId: created.id,
          featureKey,
        })),
      });
    }

    return tx.pricingTier.findUnique({
      where: { id: created.id },
      include: { features: { select: { featureKey: true } } },
    });
  });

  invalidatePricingCaches();
  return res.status(201).json({
    ...tier,
    features: tier.features.map((f: { featureKey: string }) => f.featureKey),
  });
};

export const updatePricingTierController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    gb,
    label,
    priceCents,
    priceCentsAnnual,
    stripePriceId,
    stripePriceIdAnnual,
    sortOrder,
    active,
    galleryLimit,
    features,
  } = req.body;

  const existing = await prisma.pricingTier.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError("Pricing tier not found", 404);
  }

  // If priceCents changed on a paid tier, sync with Stripe:
  // find or create a matching Price, then save its ID alongside the DB update
  let syncedStripePriceId = stripePriceId;
  const priceChanged = priceCents !== undefined && Number(priceCents) !== existing.priceCents;
  const isPaidTier = Number(priceCents ?? existing.priceCents) > 0;
  const hasManualPriceOverride = stripePriceId && stripePriceId !== existing.stripePriceId;
  const shouldSyncStripe = priceChanged && isPaidTier && !hasManualPriceOverride && existing.stripePriceId && stripe;

  let stripeProductId: string | null = null;

  if (shouldSyncStripe) {
    const oldPrice = await stripe.prices.retrieve(existing.stripePriceId!);
    stripeProductId = oldPrice.product as string;
    const targetAmount = Number(priceCents);

    // Look for an existing Stripe Price that already matches this product + amount
    const existingPrices = await stripe.prices.list({
      product: stripeProductId,
      currency: "usd",
      limit: 100,
    });
    const matchingPrice = existingPrices.data.find(
      (p) => p.type === "recurring" && p.unit_amount === targetAmount && p.recurring?.interval === "month",
    );

    if (matchingPrice) {
      if (!matchingPrice.active) {
        await stripe.prices.update(matchingPrice.id, { active: true });
      }
      syncedStripePriceId = matchingPrice.id;
      console.log(`[Admin] Reusing Stripe Price ${matchingPrice.id} (${targetAmount}¢) for tier "${existing.label}"`);
    } else {
      const newStripePrice = await stripe.prices.create({
        currency: "usd",
        unit_amount: targetAmount,
        recurring: { interval: "month" },
        product: stripeProductId,
      });
      syncedStripePriceId = newStripePrice.id;
      console.log(`[Admin] Created new Stripe Price ${newStripePrice.id} (${targetAmount}¢) for tier "${existing.label}"`);
    }
  }

  const tier = await prisma.$transaction(async (tx: any) => {
    const updated = await tx.pricingTier.update({
      where: { id },
      data: {
        ...(gb !== undefined && { gb: Number(gb) }),
        ...(label !== undefined && { label }),
        ...(priceCents !== undefined && { priceCents: Number(priceCents) }),
        ...(priceCentsAnnual !== undefined && {
          priceCentsAnnual:
            priceCentsAnnual === null || priceCentsAnnual === ""
              ? null
              : Number(priceCentsAnnual),
        }),
        ...(syncedStripePriceId !== undefined && { stripePriceId: syncedStripePriceId }),
        ...(stripePriceIdAnnual !== undefined && {
          stripePriceIdAnnual:
            stripePriceIdAnnual === "" ? null : stripePriceIdAnnual,
        }),
        ...(galleryLimit !== undefined && { galleryLimit: galleryLimit !== null && galleryLimit !== "" ? Number(galleryLimit) : null }),
        ...(sortOrder !== undefined && { sortOrder: Number(sortOrder) }),
        ...(active !== undefined && { active: Boolean(active) }),
      },
    });

    // Replace features if provided
    if (Array.isArray(features)) {
      await tx.tierFeature.deleteMany({ where: { tierId: id } });
      if (features.length > 0) {
        await tx.tierFeature.createMany({
          data: features.map((featureKey: string) => ({
            tierId: id,
            featureKey,
          })),
        });
      }
    }

    return tx.pricingTier.findUnique({
      where: { id },
      include: { features: { select: { featureKey: true } } },
    });
  });

  invalidatePricingCaches();

  // Deactivate old Stripe Price after DB commit succeeded
  if (shouldSyncStripe && existing.stripePriceId !== syncedStripePriceId && stripeProductId) {
    // Set the new price as the product's default first, otherwise Stripe
    // won't allow archiving the old price if it's the current default
    await stripe.products.update(stripeProductId, { default_price: syncedStripePriceId });
    await stripe.prices.update(existing.stripePriceId!, { active: false });
  }

  // Cascade: if this is the free tier, update all FREE users' limits
  if (tier.priceCents === 0) {
    const newStorageLimit = storageTierToBytes(tier.gb);
    const newGalleryLimit = tier.galleryLimit;
    await prisma.user.updateMany({
      where: { plan: "FREE" },
      data: {
        storageLimit: newStorageLimit,
        galleryLimit: newGalleryLimit,
      },
    });
    console.log(`[Admin] Cascaded free tier update to all FREE users: ${tier.gb} GB, galleryLimit=${newGalleryLimit}`);
  }

  return res.status(200).json({
    ...tier,
    features: tier.features.map((f: { featureKey: string }) => f.featureKey),
  });
};

export const deletePricingTierController = async (req: Request, res: Response) => {
  const { id } = req.params;

  const existing = await prisma.pricingTier.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError("Pricing tier not found", 404);
  }

  const tier = await prisma.pricingTier.update({
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

  const region = await prisma.regionalPricing.create({
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

  const existing = await prisma.regionalPricing.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError("Regional pricing config not found", 404);
  }

  const region = await prisma.$transaction(async (tx: any) => {
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

  const existing = await prisma.regionalPricing.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError("Regional pricing config not found", 404);
  }

  const region = await prisma.regionalPricing.update({
    where: { id },
    data: { active: false },
    include: { tierOverrides: true },
  });

  invalidatePricingCaches();
  return res.status(200).json(region);
};

// ── Inbox (Inbound Emails) ──────────────────────────────────────────

const VALID_INBOX_FILTERS = ["all", "unread", "starred"] as const;

// Simple UUID v4 check
const isUuid = (s: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);

export const listInboundEmailsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize) || 50));
    const rawFilter = String(req.query.filter ?? "all");
    const filter = VALID_INBOX_FILTERS.includes(rawFilter as any)
      ? rawFilter
      : "all";

    const where: Record<string, unknown> = {};
    if (filter === "unread") where.isRead = false;
    if (filter === "starred") where.isStarred = true;

    const [emails, total, unreadCount] = await Promise.all([
      prisma.inboundEmail.findMany({
        where,
        orderBy: { sentAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.inboundEmail.count({ where }),
      prisma.inboundEmail.count({ where: { isRead: false } }),
    ]);

    return res.status(200).json({
      data: emails,
      total,
      unreadCount,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("[Admin] Error listing inbound emails:", error);
    return res.status(500).json({ error: "Failed to list emails" });
  }
};

export const getInboundEmailController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;
    if (!isUuid(id)) {
      return res.status(400).json({ error: "Invalid email ID" });
    }

    // Atomically mark as read and return in one query
    const email = await prisma.inboundEmail.findUnique({
      where: { id },
    });

    if (!email) {
      return res.status(404).json({ error: "Email not found" });
    }

    if (!email.isRead) {
      await prisma.inboundEmail.update({
        where: { id },
        data: { isRead: true },
      });
      email.isRead = true;
    }

    return res.status(200).json(email);
  } catch (error) {
    console.error("[Admin] Error getting inbound email:", error);
    return res.status(500).json({ error: "Failed to get email" });
  }
};

export const updateInboundEmailController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;
    if (!isUuid(id)) {
      return res.status(400).json({ error: "Invalid email ID" });
    }

    const { isRead, isStarred } = req.body;

    const data: Record<string, boolean> = {};
    if (typeof isRead === "boolean") data.isRead = isRead;
    if (typeof isStarred === "boolean") data.isStarred = isStarred;

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    // Check existence first to return a clean 404
    const existing = await prisma.inboundEmail.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing) {
      return res.status(404).json({ error: "Email not found" });
    }

    const email = await prisma.inboundEmail.update({
      where: { id },
      data,
    });

    return res.status(200).json(email);
  } catch (error) {
    console.error("[Admin] Error updating inbound email:", error);
    return res.status(500).json({ error: "Failed to update email" });
  }
};

export const deleteInboundEmailController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;
    if (!isUuid(id)) {
      return res.status(400).json({ error: "Invalid email ID" });
    }

    const existing = await prisma.inboundEmail.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing) {
      return res.status(404).json({ error: "Email not found" });
    }

    await prisma.inboundEmail.delete({ where: { id } });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("[Admin] Error deleting inbound email:", error);
    return res.status(500).json({ error: "Failed to delete email" });
  }
};

const VALID_PRESETS = new Set([
  "checkin",
  "pricing",
  "promo",
  "feature",
  "listening",
  "correction", // TEMPORARY: remove with the LAUNCH30 follow-ups
]);

const parseEmailInput = (body: any) => {
  const preset = body?.preset;
  if (!preset || !VALID_PRESETS.has(preset)) {
    return { error: "Invalid or missing preset" as const };
  }
  const promoCode =
    typeof body?.promoCode === "string" ? body.promoCode.trim() : undefined;
  const featureName =
    typeof body?.featureName === "string" ? body.featureName.trim() : undefined;
  if (preset === "promo" && !promoCode) {
    return { error: "promoCode required for promo preset" as const };
  }
  if (preset === "feature" && !featureName) {
    return { error: "featureName required for feature preset" as const };
  }
  return { preset, promoCode, featureName };
};

export const sendUserEmailController = async (req: Request, res: Response) => {
  const parsed = parseEmailInput(req.body);
  if ("error" in parsed) {
    return res.status(400).json({ error: parsed.error });
  }
  try {
    const result = await AdminService.sendUserEmail(
      req.params.id,
      parsed,
      req.user?.id,
    );
    return res.status(200).json(result);
  } catch (error: any) {
    console.error("[Admin] Error sending user email:", error);
    return res
      .status(500)
      .json({ error: error?.message ?? "Failed to send email" });
  }
};

export const listUserEmailsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const result = await AdminService.listUserEmails(req.params.id);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error("[Admin] Error listing user emails:", error);
    return res
      .status(500)
      .json({ error: error?.message ?? "Failed to list emails" });
  }
};

export const previewUserEmailController = async (
  req: Request,
  res: Response,
) => {
  const parsed = parseEmailInput(req.body);
  if ("error" in parsed) {
    return res.status(400).json({ error: parsed.error });
  }
  try {
    const result = await AdminService.previewUserEmail(req.params.id, parsed);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error("[Admin] Error previewing user email:", error);
    return res
      .status(500)
      .json({ error: error?.message ?? "Failed to render preview" });
  }
};
