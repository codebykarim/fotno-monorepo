import { db, toDateOnly } from "./_shared";

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

  return filtered.map((gallery: any) => {
    const orderedPhotos = [...gallery.photos].sort((a, b) => a.order - b.order);
    const firstPhotoId = orderedPhotos[0]?.id;
    const coverPhotoId = gallery.coverPhotoId ?? firstPhotoId ?? null;
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
      coverPhotoUrl: coverPhotoId
        ? `https://picsum.photos/seed/${coverPhotoId}/1200/1600`
        : null,
    };
  });
};
