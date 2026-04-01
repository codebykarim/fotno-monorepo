import { db } from "./_shared";

const PLATFORM_FEE_PERCENT = parseFloat(
  process.env.SMART_ALBUM_PLATFORM_FEE_PERCENT || "10",
);

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

    return { data: { ...config, platformFeePercent: PLATFORM_FEE_PERCENT } };
  } catch (err: any) {
    return { error: err.message, status: 500 as const };
  }
};
