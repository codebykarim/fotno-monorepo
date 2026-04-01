import { db } from "./_shared";

export const getConfig = async (userId: string) => {
  try {
    let config = await db.smartAlbumConfig.findUnique({
      where: { userId },
      include: { products: true },
    });

    // Upsert on first access
    if (!config) {
      config = await db.smartAlbumConfig.create({
        data: { userId },
        include: { products: true },
      });
    }

    return { data: config };
  } catch (err: any) {
    return { error: err.message, status: 500 as const };
  }
};
