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
    if (body.maxPages !== undefined) {
      if (typeof body.maxPages !== "number" || body.maxPages < 2) {
        return { error: "maxPages must be at least 2", status: 400 as const };
      }
      updateData.maxPages = body.maxPages;
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

    const updated = await db.smartAlbumProduct.update({
      where: { id: productId },
      data: updateData,
    });

    return { data: updated };
  } catch (err: any) {
    return { error: err.message, status: 500 as const };
  }
};
