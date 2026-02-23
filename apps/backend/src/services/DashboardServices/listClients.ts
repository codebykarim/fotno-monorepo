import { db, toDateOnly } from "./_shared";

export const listClients = async (userId: string) => {
  const [clients, galleries] = await Promise.all([
    db.client.findMany({
      where: { userId },
      include: {
        galleries: {
          include: {
            gallery: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    db.gallery.findMany({
      where: { userId },
      select: { id: true, title: true, eventDate: true, deadline: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    clients: clients.map((client: any) => ({
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone ?? null,
      galleryIds: client.galleries.map((row: any) => row.galleryId),
      galleries: client.galleries.map((row: any) => ({
        id: row.gallery.id,
        title: row.gallery.title,
        eventDate: toDateOnly(
          row.gallery.eventDate ? row.gallery.eventDate.toISOString() : null,
        ),
        deadline: toDateOnly(
          row.gallery.deadline ? row.gallery.deadline.toISOString() : null,
        ),
      })),
    })),
    galleries: galleries.map((gallery: any) => ({
      id: gallery.id,
      title: gallery.title,
      eventDate: toDateOnly(
        gallery.eventDate ? gallery.eventDate.toISOString() : null,
      ),
      deadline: toDateOnly(
        gallery.deadline ? gallery.deadline.toISOString() : null,
      ),
    })),
  };
};
