import { db } from "./_shared";

export const listAllClients = async (
  search: string,
  page: number,
  pageSize: number
) => {
  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  const [clients, total] = await Promise.all([
    db.client.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        user: { select: { id: true, name: true, email: true } },
        _count: { select: { galleries: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.client.count({ where }),
  ]);

  return {
    data: clients.map((c: any) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      galleryCount: c._count.galleries,
      createdAt: c.createdAt.toISOString(),
      owner: c.user,
    })),
    total,
    page,
    pageSize,
  };
};
