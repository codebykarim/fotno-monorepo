import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import { publishedGalleryWhere, db } from "./_shared";

export const unlockPublicGallery = async (
  shareToken: string,
  password: string,
) => {
  const gallery = await db.gallery.findFirst({
    where: publishedGalleryWhere(shareToken),
    select: {
      shareToken: true,
      passwordHash: true,
    },
  });

  if (!gallery) {
    return { error: "Gallery not found", status: 404 as const };
  }

  if (gallery.passwordHash && gallery.passwordHash !== password) {
    return { error: "Invalid password", status: 401 as const };
  }

  const jwtSecret = process.env.JWT_SECRET;
  const token = jwtSecret
    ? jwt.sign({ shareToken: gallery.shareToken, kind: "gallery-access" }, jwtSecret, {
        expiresIn: "1h",
      })
    : randomUUID();

  return {
    token,
    jwt: token,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    status: 200 as const,
  };
};
