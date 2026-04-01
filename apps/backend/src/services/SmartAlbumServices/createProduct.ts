import { db } from "./_shared";

export const createProduct = async (userId: string, body: any) => {
  try {
    // Get user's config first
    const config = await db.smartAlbumConfig.findUnique({
      where: { userId },
    });

    if (!config) {
      return {
        error: "Album config not found. Please enable Smart Albums first.",
        status: 404 as const,
      };
    }

    // Validate required fields
    const { name, size, coverType, paperType, maxPages, priceCents } = body;

    if (!name || !size || !coverType || !paperType) {
      return {
        error: "name, size, coverType, and paperType are required",
        status: 400 as const,
      };
    }

    if (
      maxPages === undefined ||
      maxPages === null ||
      typeof maxPages !== "number" ||
      maxPages < 2
    ) {
      return { error: "maxPages must be at least 2", status: 400 as const };
    }

    if (
      priceCents === undefined ||
      priceCents === null ||
      typeof priceCents !== "number" ||
      priceCents < 0
    ) {
      return { error: "priceCents must be a non-negative number", status: 400 as const };
    }

    // Check for duplicate (unique constraint)
    const existing = await db.smartAlbumProduct.findFirst({
      where: {
        configId: config.id,
        size,
        coverType,
        paperType,
      },
    });

    if (existing) {
      return {
        error: `Product with size "${size}", cover "${coverType}", and paper "${paperType}" already exists`,
        status: 409 as const,
      };
    }

    const product = await db.smartAlbumProduct.create({
      data: {
        configId: config.id,
        name: String(name).trim(),
        size: String(size).trim(),
        coverType: String(coverType).trim(),
        paperType: String(paperType).trim(),
        maxPages,
        priceCents,
        currency: body.currency || "USD",
        isActive: true,
      },
    });

    return { data: product };
  } catch (err: any) {
    return { error: err.message, status: 500 as const };
  }
};
