import { publishedGalleryWhere, db } from "./_shared";

export const updateSmartAlbumDesign = async (
  shareToken: string,
  designId: string,
  body: {
    designData?: Record<string, any>;
    title?: string;
    productId?: string;
  },
) => {
  // Verify gallery exists and is published
  const gallery = await db.gallery.findFirst({
    where: publishedGalleryWhere(shareToken),
    select: { id: true, userId: true },
  });

  if (!gallery) {
    return { error: "Gallery not found", status: 404 };
  }

  // Get current design
  const design = await db.smartAlbumDesign.findFirst({
    where: {
      id: designId,
      galleryId: gallery.id,
    },
    select: {
      id: true,
      status: true,
      productId: true,
      product: {
        select: { maxPages: true },
      },
    },
  });

  if (!design) {
    return { error: "Design not found", status: 404 };
  }

  // Can only update designs in DRAFT or CHANGES_REQUESTED status
  if (design.status !== "DRAFT" && design.status !== "CHANGES_REQUESTED") {
    return {
      error: `Cannot edit design with status ${design.status}. Only DRAFT or CHANGES_REQUESTED designs can be edited.`,
      status: 400,
    };
  }

  // Determine maxPages for validation — use new product if changing, otherwise current
  let effectiveMaxPages = design.product.maxPages;

  if (body.productId && body.productId !== design.productId) {
    const newProduct = await db.smartAlbumProduct.findFirst({
      where: {
        id: body.productId,
        isActive: true,
        config: {
          userId: gallery.userId,
        },
      },
      select: { maxPages: true },
    });

    if (!newProduct) {
      return { error: "Product not found or not available for this gallery", status: 404 };
    }

    effectiveMaxPages = newProduct.maxPages;
  }

  // Validate maxPages constraint if designData is being updated
  if (body.designData) {
    const spreadCount = (body.designData.spreads as any[] | undefined)?.length || 0;
    if (spreadCount > effectiveMaxPages) {
      return {
        error: `Design has ${spreadCount} spreads, but product only allows ${effectiveMaxPages} spreads`,
        status: 400,
      };
    }
  }

  // Update the design
  const updated = await db.smartAlbumDesign.update({
    where: { id: designId },
    data: {
      ...(body.designData !== undefined && { designData: body.designData }),
      ...(body.title !== undefined && { title: body.title }),
      ...(body.productId !== undefined && { productId: body.productId }),
    },
    select: {
      id: true,
      title: true,
      status: true,
      designData: true,
      product: {
        select: {
          id: true,
          name: true,
          maxPages: true,
        },
      },
      updatedAt: true,
    },
  });

  return { design: updated };
};
