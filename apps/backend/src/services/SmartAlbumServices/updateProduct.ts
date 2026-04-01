import { db } from "./_shared";

export const updateProduct = async (userId: string, productId: string, body: any) => {
  try {
    // Get config and verify ownership
    const config = await db.smartAlbumConfig.findUnique({
      where: { userId },
    });

    if (!config) {
      return {
        error: "Album config not found",
        status: 404 as const,
      };
    }

    // Verify product belongs to this user's config
    const product = await db.smartAlbumProduct.findUnique({
      where: { id: productId },
    });

    if (!product || product.configId !== config.id) {
      return {
        error: "Product not found",
        status: 404 as const,
      };
    }

    // Prepare update data (only allow partial updates)
    const updateData: any = {};

    if (body.name !== undefined) {
      updateData.name = String(body.name).trim();
    }
    if (body.maxSpreads !== undefined) {
      if (typeof body.maxSpreads !== "number" || body.maxSpreads < 1) {
        return { error: "maxSpreads must be at least 1", status: 400 as const };
      }
      updateData.maxSpreads = body.maxSpreads;
    }
    if (body.priceCents !== undefined) {
      if (typeof body.priceCents !== "number" || body.priceCents < 0) {
        return { error: "priceCents must be a non-negative number", status: 400 as const };
      }
      updateData.priceCents = body.priceCents;
    }
    if (body.isActive !== undefined) {
      updateData.isActive = Boolean(body.isActive);
    }
    if (body.hasCover !== undefined) {
      updateData.hasCover = Boolean(body.hasCover);
    }
    if (body.hasFirstPage !== undefined) {
      updateData.hasFirstPage = Boolean(body.hasFirstPage);
    }
    if (body.hasLastPage !== undefined) {
      updateData.hasLastPage = Boolean(body.hasLastPage);
    }
    if (body.allowFewerSpreads !== undefined) {
      updateData.allowFewerSpreads = Boolean(body.allowFewerSpreads);
    }
    if (body.minSpreads !== undefined) {
      const effectiveMax = body.maxSpreads ?? product.maxSpreads;
      if (body.minSpreads !== null) {
        const min = Number(body.minSpreads);
        if (isNaN(min) || min < 1 || min > effectiveMax) {
          return {
            error: `minSpreads must be between 1 and ${effectiveMax}`,
            status: 400 as const,
          };
        }
        updateData.minSpreads = min;
      } else {
        updateData.minSpreads = null;
      }
    }
    if (body.images !== undefined) {
      if (!Array.isArray(body.images)) {
        return { error: "images must be an array", status: 400 as const };
      }
      updateData.images = body.images;
    }

    const updated = await db.smartAlbumProduct.update({
      where: { id: productId },
      data: updateData,
    });

    return { data: updated };
  } catch (err: any) {
    return { error: err.message, status: 500 as const };
  }
};
