import { db, toDateOnly } from "./_shared";
import { getPresignedDownloadUrl } from "../../utils/s3";

export const listGalleries = async (
  userId: string,
  queryRaw: string,
  statusRaw: string,
  sortRaw: string,
) => {
  const query = queryRaw.trim().toLowerCase();
  const status = statusRaw || "all";
  const sort = sortRaw || "newest";

  const galleries = await db.gallery.findMany({
    where: {
      userId,
      ...(status === "published"
        ? { isPublished: true }
        : status === "draft"
          ? { isPublished: false }
          : {}),
    },
    include: {
      photos: {
        select: {
          id: true,
          order: true,
          s3Key: true,
          previewKey: true,
        },
      },
    },
  });

  const filtered = galleries.filter((gallery: any) => {
    if (!query) {
      return true;
    }
    return (
      gallery.title.toLowerCase().includes(query) ||
      gallery.slug.toLowerCase().includes(query)
    );
  });

  filtered.sort((a: any, b: any) => {
    if (sort === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sort === "title_asc") {
      return a.title.localeCompare(b.title);
    }
    if (sort === "title_desc") {
      return b.title.localeCompare(a.title);
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return Promise.all(
    filtered.map(async (gallery: any) => {
      const orderedPhotos = [...gallery.photos].sort((a, b) => a.order - b.order);
      const firstPhoto = orderedPhotos[0] ?? null;
      const coverPhoto = gallery.coverPhotoId
        ? orderedPhotos.find((photo: any) => photo.id === gallery.coverPhotoId) ?? firstPhoto
        : firstPhoto;
      const coverPhotoId = coverPhoto?.id ?? null;

      return {
        id: gallery.id,
        title: gallery.title,
        slug: gallery.slug,
        eventDate: toDateOnly(
          gallery.eventDate ? gallery.eventDate.toISOString() : null,
        ),
        deadline: toDateOnly(
          gallery.deadline ? gallery.deadline.toISOString() : null,
        ),
        isPublished: Boolean(gallery.isPublished),
        createdAt: gallery.createdAt.toISOString(),
        updatedAt: gallery.updatedAt.toISOString(),
        coverPhotoId,
        status: gallery.isPublished ? "published" : "draft",
        photoCount: orderedPhotos.length,
        coverPhotoUrl: coverPhoto
          ? await getPresignedDownloadUrl(coverPhoto.previewKey ?? coverPhoto.s3Key, 3600)
          : null,
      };
    }),
  );
};
