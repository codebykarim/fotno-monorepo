import { db } from "./_shared";
import { TRIAL_STORAGE_LIMIT } from "../../constants/storage";

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
      plan: "TRIAL",
      storageLimit: TRIAL_STORAGE_LIMIT,
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      emailVerified: true,
    },
    select: { id: true },
  });
  return created.id;
};
