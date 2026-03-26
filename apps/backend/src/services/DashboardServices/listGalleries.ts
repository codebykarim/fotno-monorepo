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
          thumbnailKey: true,
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

  const PREVIEW_GRID_LIMIT = 12;

  return Promise.all(
    filtered.map(async (gallery: any) => {
      const orderedPhotos = [...gallery.photos].sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
      const firstPhoto = orderedPhotos[0] ?? null;
      const coverPhoto = gallery.coverPhotoId
        ? orderedPhotos.find((photo: any) => photo.id === gallery.coverPhotoId) ?? firstPhoto
        : firstPhoto;
      const coverPhotoId = coverPhoto?.id ?? null;
      const coverPhotoObjectKey = coverPhoto
        ? coverPhoto.thumbnailKey ?? coverPhoto.previewKey ?? coverPhoto.s3Key
        : null;

      const previewPhotos = orderedPhotos.slice(0, PREVIEW_GRID_LIMIT);
      const previewPhotoUrls = await Promise.all(
        previewPhotos.map((photo: any) => {
          const key = photo.thumbnailKey ?? photo.previewKey ?? photo.s3Key;
          return key ? getPresignedDownloadUrl(key, 3600) : null;
        }),
      ).then((urls) => urls.filter((url): url is string => url !== null));

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
        coverPhotoUrl: coverPhotoObjectKey
          ? await getPresignedDownloadUrl(coverPhotoObjectKey, 3600)
          : null,
        previewPhotoUrls,
      };
    }),
  );
};
