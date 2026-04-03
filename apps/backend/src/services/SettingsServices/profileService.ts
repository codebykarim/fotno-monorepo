import { prisma } from "@workspace/db";
import AppError from "../../errors/AppError";

export const getProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      accounts: {
        select: { providerId: true },
      },
    },
  });

  if (!user) throw new AppError("User not found", 404);

  const providers = user.accounts.map((a) => a.providerId);
  const hasOAuthOnly =
    providers.length > 0 &&
    providers.every((p) => p !== "credential");

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    createdAt: user.createdAt,
    providers,
    canChangeEmail: !hasOAuthOnly,
  };
};

export const updateProfile = async (
  userId: string,
  data: { name?: string; email?: string },
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      accounts: { select: { providerId: true } },
    },
  });

  if (!user) throw new AppError("User not found", 404);

  const providers = user.accounts.map((a) => a.providerId);
  const hasOAuthOnly =
    providers.length > 0 &&
    providers.every((p) => p !== "credential");

  // If user signed in with OAuth only, they can't change email
  if (data.email && hasOAuthOnly) {
    throw new AppError(
      "Cannot change email for accounts signed in with a social provider",
      400,
    );
  }

  // If changing email, check uniqueness
  if (data.email) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true },
    });
    if (existing && existing.id !== userId) {
      throw new AppError("Email is already in use", 409);
    }
  }

  const updateData: Record<string, string> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.email !== undefined) updateData.email = data.email;

  const updated = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  });

  return updated;
};
