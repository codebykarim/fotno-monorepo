import { db, bigIntToString } from "./_shared";

export const listUsers = async (
  search: string,
  plan: string,
  page: number,
  pageSize: number
) => {
  const where: any = {};

  if (search) {
    where.AND = [
      {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      },
    ];
  }

  if (plan && plan !== "all") {
    where.plan = plan;
  }

  const [users, total] = await Promise.all([
    db.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        plan: true,
        role: true,
        banned: true,
        storageUsed: true,
        storageLimit: true,
        createdAt: true,
        _count: { select: { galleries: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.user.count({ where }),
  ]);

  return {
    data: users.map((u: any) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      image: u.image,
      plan: u.plan,
      role: u.role,
      banned: Boolean(u.banned),
      storageUsed: bigIntToString(u.storageUsed),
      storageLimit: bigIntToString(u.storageLimit),
      galleryCount: u._count.galleries,
      createdAt: u.createdAt.toISOString(),
    })),
    total,
    page,
    pageSize,
  };
};
