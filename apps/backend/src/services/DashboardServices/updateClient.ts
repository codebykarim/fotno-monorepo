import { db } from "./_shared";

export const updateClient = async (userId: string, clientId: string, body: any) => {
  const client = await db.client.findFirst({
    where: { id: clientId, userId },
    select: { id: true },
  });
  if (!client) {
    return null;
  }

  const name = String(body?.name ?? "").trim();
  const email = String(body?.email ?? "").trim().toLowerCase();
  const phoneRaw = body?.phone;
  const phone =
    phoneRaw === undefined
      ? undefined
      : phoneRaw === null
        ? null
        : String(phoneRaw).trim() || null;
  const galleryIds = Array.isArray(body?.galleryIds)
    ? body.galleryIds.map((id: unknown) => String(id))
    : [];

  const updated = await db.client.update({
    where: { id: client.id },
    data: {
      ...(name ? { name } : {}),
      ...(email ? { email } : {}),
      ...(phoneRaw !== undefined ? { phone } : {}),
    },
  });

  await db.galleryClient.deleteMany({ where: { clientId: updated.id } });
  for (const galleryId of galleryIds) {
    await db.galleryClient.upsert({
      where: { galleryId_clientId: { galleryId, clientId: updated.id } },
      update: {},
      create: { galleryId, clientId: updated.id },
    });
  }

  return { client: { id: updated.id } };
};
