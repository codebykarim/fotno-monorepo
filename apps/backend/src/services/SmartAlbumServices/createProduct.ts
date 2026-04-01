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
    const { name, widthCm, heightCm, coverType, paperType, maxSpreads, priceCents } = body;

    if (!name || !coverType || !paperType) {
      return {
        error: "name, coverType, and paperType are required",
        status: 400 as const,
      };
    }

    if (
      widthCm === undefined ||
      typeof widthCm !== "number" ||
      widthCm <= 0
    ) {
      return { error: "widthCm must be a positive number", status: 400 as const };
    }

    if (
      heightCm === undefined ||
      typeof heightCm !== "number" ||
      heightCm <= 0
    ) {
      return { error: "heightCm must be a positive number", status: 400 as const };
    }

    if (
      maxSpreads === undefined ||
      maxSpreads === null ||
      typeof maxSpreads !== "number" ||
      maxSpreads < 1
    ) {
      return { error: "maxSpreads must be at least 1", status: 400 as const };
    }

    if (
      priceCents === undefined ||
      priceCents === null ||
      typeof priceCents !== "number" ||
      priceCents < 0
    ) {
      return { error: "priceCents must be a non-negative number", status: 400 as const };
    }

    // Validate minSpreads if allowFewerSpreads is true
    const allowFewerSpreads = Boolean(body.allowFewerSpreads);
    let minSpreads: number | null = null;
    if (allowFewerSpreads) {
      if (body.minSpreads !== undefined && body.minSpreads !== null) {
        minSpreads = Number(body.minSpreads);
        if (isNaN(minSpreads) || minSpreads < 1 || minSpreads > maxSpreads) {
          return {
            error: `minSpreads must be between 1 and ${maxSpreads}`,
            status: 400 as const,
          };
        }
      } else {
        minSpreads = 1;
      }
    }

    // Check for duplicate (unique constraint)
    const existing = await db.smartAlbumProduct.findFirst({
      where: {
        configId: config.id,
        widthCm,
        heightCm,
        coverType,
        paperType,
      },
    });

    if (existing) {
      return {
        error: `Product with size "${widthCm}x${heightCm}cm", cover "${coverType}", and paper "${paperType}" already exists`,
        status: 409 as const,
      };
    }

    const product = await db.smartAlbumProduct.create({
      data: {
        configId: config.id,
        name: String(name).trim(),
        widthCm,
        heightCm,
        coverType: String(coverType).trim(),
        paperType: String(paperType).trim(),
        maxSpreads,
        minSpreads,
        allowFewerSpreads,
        hasCover: body.hasCover !== false,
        hasFirstPage: body.hasFirstPage !== false,
        hasLastPage: body.hasLastPage !== false,
        images: [],
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
