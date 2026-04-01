import { publishedGalleryWhere, db } from "./_shared";
import { signProductImageUrls } from "../SmartAlbumServices/productImages";

/**
 * Get active SmartAlbum products for a gallery's photographer
 * Returns empty array if photographer doesn't have albums enabled or no active products
 */
export const getSmartAlbumProducts = async (shareToken: string) => {
  const gallery = await db.gallery.findFirst({
    where: publishedGalleryWhere(shareToken),
    select: {
      id: true,
      userId: true,
    },
  });

  if (!gallery) {
    return { error: "Gallery not found", status: 404 };
  }

  // Get photographer's SmartAlbumConfig
  const config = await db.smartAlbumConfig.findUnique({
    where: { userId: gallery.userId },
    select: {
      enabled: true,
    },
  });

  if (!config || !config.enabled) {
    return { products: [] };
  }

  // Get active products
  const products = await db.smartAlbumProduct.findMany({
    where: {
      config: {
        userId: gallery.userId,
      },
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      widthCm: true,
      heightCm: true,
      coverType: true,
      paperType: true,
      maxSpreads: true,
      minSpreads: true,
      allowFewerSpreads: true,
      hasCover: true,
      hasFirstPage: true,
      hasLastPage: true,
      images: true,
      priceCents: true,
      currency: true,
    },
    orderBy: [{ createdAt: "asc" }],
  });

  // Sign image URLs
  const productsWithSignedImages = await Promise.all(
    products.map(async (p: any) => ({
      ...p,
      imageUrls: await signProductImageUrls((p.images as string[]) || []),
    })),
  );

  return { products: productsWithSignedImages };
};
