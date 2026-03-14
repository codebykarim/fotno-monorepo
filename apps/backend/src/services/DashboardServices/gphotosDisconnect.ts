import { db } from "./_shared";

export const gphotosDisconnect = async (userId: string) => {
  const account = await db.account.findFirst({
    where: { userId, providerId: "google" },
    select: { id: true, scope: true },
  });

  if (!account) {
    return { error: "No Google Photos account found", status: 404 as const };
  }

  const scopes = (account.scope ?? "")
    .split(" ")
    .filter((s: string) => !s.includes("photospicker.mediaitems.readonly"));

  await db.account.update({
    where: { id: account.id },
    data: { scope: scopes.join(" ") },
  });

  return { success: true };
};
