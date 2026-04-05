import { db, slugify, toDateOnly, toIsoOrNull } from "./_shared";
import { getFreeTierLimits } from "../../constants/plans";
import { resolveUserAccess } from "../SubscriptionServices/resolveUserAccess";

export const createGallery = async (userId: string, body: any) => {
  // Check gallery limit
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { plan: true, galleryLimit: true },
  });
  // For FREE users, always read gallery limit from the PricingTier table
  const effectiveGalleryLimit = user?.plan === "FREE"
    ? (await getFreeTierLimits()).galleryLimit
    : user?.galleryLimit ?? null;
  if (effectiveGalleryLimit != null) {
    const galleryCount = await db.gallery.count({ where: { userId } });
    if (galleryCount >= effectiveGalleryLimit) {
      return {
        error: `Gallery limit reached (${effectiveGalleryLimit}). Upgrade your plan to create more galleries.`,
        status: 403 as const,
      };
    }
  }

  const title = String(body?.title ?? "").trim();
  if (!title) {
    return { error: "title is required", status: 400 as const };
  }

  const customSlug = String(body?.slug ?? "").trim();
  let slug: string;

  if (customSlug) {
    // User provided a custom slug — check feature access
    const access = await resolveUserAccess(userId);
    if (!access.features.includes("CUSTOM_SLUGS")) {
      return {
        error: "Custom slugs require a higher plan. Please upgrade.",
        status: 403 as const,
      };
    }
    // Verify uniqueness
    const existing = await db.gallery.findUnique({ where: { slug: customSlug } });
    if (existing) {
      return {
        error: "This slug is already taken. Please choose a different one.",
        status: 409 as const,
      };
    }
    slug = customSlug;
  } else {
    // Auto-generate slug from title with random suffix
    const slugBase = slugify(title);
    slug = `${slugBase}-${Math.floor(Math.random() * 1000)}`;
  }

  const now = new Date();
  const defaultDeadline = new Date(now);
  defaultDeadline.setMonth(defaultDeadline.getMonth() + 1);
  const defaultExpiry = new Date(now);
  defaultExpiry.setMonth(defaultExpiry.getMonth() + 2);

  const gallery = await db.gallery.create({
    data: {
      userId,
      title,
      slug,
      eventDate: toIsoOrNull(body?.eventDate) ?? now.toISOString(),
      deadline: toIsoOrNull(body?.deadline) ?? defaultDeadline.toISOString(),
      expiresAt: toIsoOrNull(body?.expiresAt) ?? defaultExpiry.toISOString(),
      isPublished: false,
    },
  });

  return {
    gallery: {
      id: gallery.id,
      title: gallery.title,
      slug: gallery.slug,
      eventDate: toDateOnly(
        gallery.eventDate ? gallery.eventDate.toISOString() : null,
      ),
      deadline: toDateOnly(
        gallery.deadline ? gallery.deadline.toISOString() : null,
      ),
      expiresAt: toDateOnly(
        gallery.expiresAt ? gallery.expiresAt.toISOString() : null,
      ),
      passwordEnabled: Boolean(gallery.passwordHash),
      password: gallery.passwordHash ?? null,
      isPublished: gallery.isPublished,
      createdAt: gallery.createdAt.toISOString(),
      updatedAt: gallery.updatedAt.toISOString(),
      coverPhotoId: gallery.coverPhotoId ?? null,
    },
    status: 201 as const,
  };
};
