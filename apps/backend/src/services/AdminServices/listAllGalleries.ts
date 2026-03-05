import { db, bigIntToString } from "./_shared";

export const listAllGalleries = async (
  search: string,
  status: string,
  page: number,
  pageSize: number
) => {
  const where: any = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { user: { name: { contains: search, mode: "insensitive" } } },
      { user: { email: { contains: search, mode: "insensitive" } } },
    ];
  }

  if (status === "published") {
    where.isPublished = true;
  } else if (status === "draft") {
    where.isPublished = false;
  }

  const [galleries, total] = await Promise.all([
    db.gallery.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        isPublished: true,
        createdAt: true,
        user: { select: { id: true, name: true, email: true } },
        _count: { select: { photos: true, albums: true } },
        photos: { select: { totalSize: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.gallery.count({ where }),
  ]);

  return {
    data: galleries.map((g: any) => {
      const storageUsed = g.photos.reduce(
        (sum: bigint, p: any) => sum + (p.totalSize ?? BigInt(0)),
        BigInt(0)
      );
      return {
        id: g.id,
        title: g.title,
        slug: g.slug,
        isPublished: g.isPublished,
        photoCount: g._count.photos,
        albumCount: g._count.albums,
        storageUsed: bigIntToString(storageUsed),
        createdAt: g.createdAt.toISOString(),
        owner: g.user,
      };
    }),
    total,
    page,
    pageSize,
  };
};
