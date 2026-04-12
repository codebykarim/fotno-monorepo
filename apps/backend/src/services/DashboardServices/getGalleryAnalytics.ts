import { db } from "./_shared";
import { getPresignedDownloadUrl } from "../../utils/s3";

export const getGalleryAnalytics = async (
  userId: string,
  galleryId: string,
  period: "7d" | "30d" | "90d" | "all" = "30d",
) => {
  const gallery = await db.gallery.findFirst({
    where: { id: galleryId, userId },
    select: { id: true },
  });
  if (!gallery) {
    return null;
  }

  const now = new Date();
  let since: Date | null = null;
  if (period === "7d") {
    since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (period === "30d") {
    since = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  } else if (period === "90d") {
    since = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  }

  const dateFilter = since ? { gte: since } : undefined;
  const dateClause = since ? `AND "createdAt" >= $2` : "";
  const params = since ? [galleryId, since] : [galleryId];

  const [
    totalViews,
    uniqueViews,
    totalDownloads,
    totalFavorites,
    viewsByDay,
    downloadsByDay,
    topDownloadedPhotos,
    recentActivity,
  ] = await Promise.all([
    // Total views
    db.galleryView.count({
      where: { galleryId, ...(dateFilter && { createdAt: dateFilter }) },
    }),

    // Unique views (distinct IPs per day)
    db.$queryRawUnsafe<{ count: bigint }[]>(
      `SELECT COUNT(DISTINCT "viewerIp")::bigint as count
       FROM gallery_view
       WHERE "galleryId" = $1 ${dateClause}`,
      ...params,
    ),

    // Total downloads
    db.downloadEvent.count({
      where: { galleryId, ...(dateFilter && { createdAt: dateFilter }) },
    }),

    // Total favorites
    db.galleryFavorite.count({
      where: { galleryId, ...(dateFilter && { createdAt: dateFilter }) },
    }),

    // Views by day
    db.$queryRawUnsafe<{ date: string; count: bigint; unique_count: bigint }[]>(
      `SELECT DATE("createdAt") as date,
              COUNT(*)::bigint as count,
              COUNT(DISTINCT "viewerIp")::bigint as unique_count
       FROM gallery_view
       WHERE "galleryId" = $1 ${dateClause}
       GROUP BY DATE("createdAt")
       ORDER BY date ASC`,
      ...params,
    ),

    // Downloads by day
    db.$queryRawUnsafe<{ date: string; count: bigint }[]>(
      `SELECT DATE("createdAt") as date, COUNT(*)::bigint as count
       FROM download_event
       WHERE "galleryId" = $1 ${dateClause}
       GROUP BY DATE("createdAt")
       ORDER BY date ASC`,
      ...params,
    ),

    // Top downloaded photos (top 10)
    db.$queryRawUnsafe<{ photoId: string; count: bigint }[]>(
      `SELECT "photoId", COUNT(*)::bigint as count
       FROM download_event
       WHERE "galleryId" = $1 AND "photoId" IS NOT NULL ${dateClause}
       GROUP BY "photoId"
       ORDER BY count DESC
       LIMIT 10`,
      ...params,
    ),

    // Recent activity feed (last 30 events)
    db.$queryRawUnsafe<
      {
        type: string;
        created_at: Date;
        viewer_name: string | null;
        photo_id: string | null;
        event_type: string | null;
      }[]
    >(
      `(
        SELECT 'view' as type, "createdAt" as created_at,
               NULL as viewer_name, NULL as photo_id, NULL as event_type
        FROM gallery_view
        WHERE "galleryId" = $1 ${dateClause}
        ORDER BY "createdAt" DESC
        LIMIT 30
      )
      UNION ALL
      (
        SELECT 'download' as type, "createdAt" as created_at,
               "viewerName" as viewer_name, "photoId" as photo_id, download_event.type as event_type
        FROM download_event
        WHERE "galleryId" = $1 ${dateClause}
        ORDER BY "createdAt" DESC
        LIMIT 30
      )
      ORDER BY created_at DESC
      LIMIT 30`,
      ...params,
    ),
  ]);

  // Fetch photo details for top downloaded photos
  const topPhotoIds = topDownloadedPhotos
    .map((p) => p.photoId)
    .filter(Boolean);

  let photosMap: Record<
    string,
    { id: string; thumbnailUrl: string; previewUrl: string; originalFilename: string }
  > = {};

  // Collect all photo IDs we need (top downloads + activity feed)
  const activityPhotoIds = [
    ...new Set(
      recentActivity
        .filter((e) => e.photo_id)
        .map((e) => e.photo_id as string),
    ),
  ];
  const allPhotoIds = [...new Set([...topPhotoIds, ...activityPhotoIds])];

  if (allPhotoIds.length > 0) {
    const photos = await db.photo.findMany({
      where: { id: { in: allPhotoIds } },
      select: {
        id: true,
        thumbnailKey: true,
        previewKey: true,
        s3Key: true,
        originalFilename: true,
      },
    });

    await Promise.all(
      (photos as any[]).map(async (p) => {
        const thumbKey = p.thumbnailKey ?? p.previewKey ?? p.s3Key;
        const prevKey = p.previewKey ?? p.thumbnailKey ?? p.s3Key;
        const [thumbnailUrl, previewUrl] = await Promise.all([
          getPresignedDownloadUrl(thumbKey, 3600),
          getPresignedDownloadUrl(prevKey, 3600),
        ]);
        photosMap[p.id] = {
          id: p.id,
          thumbnailUrl,
          previewUrl,
          originalFilename: p.originalFilename,
        };
      }),
    );
  }

  const uniqueViewCount = Number(uniqueViews[0]?.count ?? 0);

  // ── Engagement Score (0–100) ──────────────────────────────────
  // Weighted composite of four signals:
  //   Reach        (20%) — unique views, saturates at 50
  //   Download %   (30%) — downloads / unique views, saturates at 40%
  //   Favorite %   (25%) — favorites / unique views, saturates at 30%
  //   Return ratio (25%) — total views / unique views, saturates at 3x
  const clamp = (v: number) => Math.min(Math.max(v, 0), 1);

  const reachScore = clamp(uniqueViewCount / 50);
  const downloadRate =
    uniqueViewCount > 0 ? totalDownloads / uniqueViewCount : 0;
  const downloadScore = clamp(downloadRate / 0.4);
  const favoriteRate =
    uniqueViewCount > 0 ? totalFavorites / uniqueViewCount : 0;
  const favoriteScore = clamp(favoriteRate / 0.3);
  const returnRatio =
    uniqueViewCount > 0 ? totalViews / uniqueViewCount : 1;
  const returnScore = clamp((returnRatio - 1) / 2); // 1x → 0, 3x → 1

  const engagementScore =
    uniqueViewCount === 0
      ? 0
      : Math.round(
          (reachScore * 0.2 +
            downloadScore * 0.3 +
            favoriteScore * 0.25 +
            returnScore * 0.25) *
            100,
        );

  return {
    totalViews,
    uniqueViews: uniqueViewCount,
    totalDownloads,
    totalFavorites,
    conversionRate:
      uniqueViewCount > 0
        ? Math.round((totalDownloads / uniqueViewCount) * 1000) / 10
        : 0,
    engagementScore,
    engagementBreakdown: {
      reach: Math.round(reachScore * 100),
      downloads: Math.round(downloadScore * 100),
      favorites: Math.round(favoriteScore * 100),
      returning: Math.round(returnScore * 100),
    },
    viewsByDay: viewsByDay.map((r) => ({
      date:
        typeof r.date === "string"
          ? r.date
          : new Date(r.date).toISOString().slice(0, 10),
      count: Number(r.count),
      uniqueCount: Number(r.unique_count),
    })),
    downloadsByDay: downloadsByDay.map((r) => ({
      date:
        typeof r.date === "string"
          ? r.date
          : new Date(r.date).toISOString().slice(0, 10),
      count: Number(r.count),
    })),
    topDownloadedPhotos: topDownloadedPhotos.map((p) => ({
      photoId: p.photoId,
      count: Number(p.count),
      photo: photosMap[p.photoId] ?? null,
    })),
    recentActivity: recentActivity.map((e) => ({
      type: e.type,
      createdAt:
        e.created_at instanceof Date
          ? e.created_at.toISOString()
          : String(e.created_at),
      viewerName: e.viewer_name ?? null,
      photoId: e.photo_id ?? null,
      eventType: e.event_type ?? null,
      photo: e.photo_id ? photosMap[e.photo_id] ?? null : null,
    })),
  };
};
