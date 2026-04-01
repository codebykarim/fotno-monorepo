import { db } from "./_shared";

export const deleteProduct = async (userId: string, productId: string) => {
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

    // Check if product is referenced by any active designs
    const designCount = await db.smartAlbumDesign.count({
      where: {
        productId,
        status: { in: ["DRAFT", "SUBMITTED"] },
      },
    });

    if (designCount > 0) {
      return {
        error: `Cannot delete product. It is referenced by ${designCount} active design(s).`,
        status: 409 as const,
      };
    }

    // Delete the product
    await db.smartAlbumProduct.delete({
      where: { id: productId },
    });

    return { data: { success: true } };
  } catch (err: any) {
    return { error: err.message, status: 500 as const };
  }
};
