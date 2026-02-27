import { publishedGalleryWhere, db } from "./_shared";

export const getPublicGallery = async (shareToken: string) => {
  const gallery = await db.gallery.findFirst({
    where: publishedGalleryWhere(shareToken),
    select: {
      id: true,
      slug: true,
      shareToken: true,
      title: true,
      passwordHash: true,
      coverPhotoId: true,
      userId: true,
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      photos: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          originalFilename: true,
          aiCaption: true,
          width: true,
          height: true,
          order: true,
        },
      },
      albums: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          title: true,
          photos: {
            select: {
              photoId: true,
            },
          },
        },
      },
    },
  });

  if (!gallery) {
    return null;
  }

  return {
    id: gallery.id,
    userId: gallery.userId,
    // Gallery frontend uses this value in URL segments; keep it slug-compatible.
    shareToken: gallery.slug,
    title: gallery.title,
    passwordHash: gallery.passwordHash,
    coverPhotoId: gallery.coverPhotoId,
    photographer: {
      name: gallery.user?.name ?? "FOTNO",
      logoUrl: gallery.user?.image ?? null,
    },
    photos: gallery.photos,
    albums: gallery.albums.map((album: any) => ({
      id: album.id,
      title: album.title,
      photoIds: album.photos.map((item: any) => item.photoId),
    })),
  };
};
