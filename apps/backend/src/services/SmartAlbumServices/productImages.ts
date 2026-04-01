import { randomUUID } from "crypto";
import { db } from "./_shared";
import {
  getPresignedUploadUrl,
  getPresignedDownloadUrl,
  deleteS3Object,
} from "../../utils/s3";

/**
 * Generate a presigned URL for uploading a product example image.
 */
export const presignProductImage = async (
  userId: string,
  productId: string,
  body: { fileName: string; contentType: string },
) => {
  const config = await db.smartAlbumConfig.findUnique({
    where: { userId },
  });
  if (!config) {
    return { error: "Album config not found", status: 404 as const };
  }

  const product = await db.smartAlbumProduct.findUnique({
    where: { id: productId },
  });
  if (!product || product.configId !== config.id) {
    return { error: "Product not found", status: 404 as const };
  }

  const { fileName, contentType } = body;
  if (!fileName || !contentType) {
    return { error: "fileName and contentType are required", status: 400 as const };
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(contentType)) {
    return { error: "Only JPEG, PNG, and WebP images are allowed", status: 400 as const };
  }

  const ext = fileName.split(".").pop() || "jpg";
  const key = `product-images/${productId}/${randomUUID()}.${ext}`;
  const uploadUrl = await getPresignedUploadUrl(key, contentType);

  return { data: { key, uploadUrl } };
};

/**
 * Confirm a product image upload (add the S3 key to the product's images array).
 */
export const confirmProductImage = async (
  userId: string,
  productId: string,
  body: { key: string },
) => {
  const config = await db.smartAlbumConfig.findUnique({
    where: { userId },
  });
  if (!config) {
    return { error: "Album config not found", status: 404 as const };
  }

  const product = await db.smartAlbumProduct.findUnique({
    where: { id: productId },
  });
  if (!product || product.configId !== config.id) {
    return { error: "Product not found", status: 404 as const };
  }

  const { key } = body;
  if (!key || !key.startsWith(`product-images/${productId}/`)) {
    return { error: "Invalid image key", status: 400 as const };
  }

  const currentImages = (product.images as string[]) || [];
  if (currentImages.includes(key)) {
    return { data: { images: currentImages } };
  }

  const newImages = [...currentImages, key];
  await db.smartAlbumProduct.update({
    where: { id: productId },
    data: { images: newImages },
  });

  return { data: { images: newImages } };
};

/**
 * Remove a product image (delete from S3 and remove from the images array).
 */
export const removeProductImage = async (
  userId: string,
  productId: string,
  body: { key: string },
) => {
  const config = await db.smartAlbumConfig.findUnique({
    where: { userId },
  });
  if (!config) {
    return { error: "Album config not found", status: 404 as const };
  }

  const product = await db.smartAlbumProduct.findUnique({
    where: { id: productId },
  });
  if (!product || product.configId !== config.id) {
    return { error: "Product not found", status: 404 as const };
  }

  const { key } = body;
  const currentImages = (product.images as string[]) || [];
  const newImages = currentImages.filter((k) => k !== key);

  await db.smartAlbumProduct.update({
    where: { id: productId },
    data: { images: newImages },
  });

  // Best-effort delete from S3
  try {
    await deleteS3Object(key);
  } catch {
    // Ignore S3 deletion errors
  }

  return { data: { images: newImages } };
};

/**
 * Sign product image keys into download URLs.
 */
export const signProductImageUrls = async (
  images: string[],
): Promise<string[]> => {
  if (!images || images.length === 0) return [];
  return Promise.all(
    images.map((key) => getPresignedDownloadUrl(key, 3600)),
  );
};
