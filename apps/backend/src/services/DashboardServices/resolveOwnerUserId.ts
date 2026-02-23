import { db } from "./_shared";
import { PLAN_STORAGE_LIMITS } from "../../constants/storage";

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
      plan: "FREE",
      storageLimit: PLAN_STORAGE_LIMITS.FREE,
      emailVerified: true,
    },
    select: { id: true },
  });
  return created.id;
};
