import { db } from "./_shared";

export const resolveOwnerUserId = async (): Promise<string> => {
  const firstUser = await db.user.findFirst({
    select: { id: true },
    orderBy: { createdAt: "asc" },
  });

  if (firstUser?.id) {
    return firstUser.id;
  }

  const fallbackEmail = `local-photographer-${Date.now()}@fotno.local`;
  const created = await db.user.create({
    data: {
      name: "Local Photographer",
      email: fallbackEmail,
      emailVerified: true,
    },
    select: { id: true },
  });
  return created.id;
};
