import { prisma } from "@workspace/db";
import AppError from "../../errors/AppError";
import dns from "dns/promises";

export const getCustomDomain = async (userId: string) => {
  const domain = await (prisma as any).customDomain.findUnique({
    where: { userId },
  });

  if (!domain) return null;

  return {
    id: domain.id,
    domain: domain.domain,
    status: domain.status,
    verificationToken: domain.verificationToken,
    verifiedAt: domain.verifiedAt,
    createdAt: domain.createdAt,
  };
};

export const setCustomDomain = async (userId: string, domainName: string) => {
  if (!domainName) throw new AppError("Domain is required", 400);

  // Basic domain validation
  const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
  if (!domainRegex.test(domainName)) {
    throw new AppError("Invalid domain format", 400);
  }

  // Prevent using fotno.com subdomains
  if (domainName.endsWith(".fotno.com") || domainName === "fotno.com") {
    throw new AppError("Cannot use fotno.com domains", 400);
  }

  // Check if domain is already taken by another user
  const existing = await (prisma as any).customDomain.findUnique({
    where: { domain: domainName },
  });
  if (existing && existing.userId !== userId) {
    throw new AppError("Domain is already in use by another account", 409);
  }

  const domain = await (prisma as any).customDomain.upsert({
    where: { userId },
    create: {
      userId,
      domain: domainName,
      status: "PENDING",
    },
    update: {
      domain: domainName,
      status: "PENDING",
      verifiedAt: null,
    },
  });

  return {
    id: domain.id,
    domain: domain.domain,
    status: domain.status,
    verificationToken: domain.verificationToken,
    createdAt: domain.createdAt,
  };
};

export const verifyCustomDomain = async (userId: string) => {
  const domain = await (prisma as any).customDomain.findUnique({
    where: { userId },
  });

  if (!domain) throw new AppError("No custom domain configured", 404);

  // Check DNS CNAME record points to gallery.fotno.com
  let cnameValid = false;
  try {
    const records = await dns.resolveCname(domain.domain);
    cnameValid = records.some(
      (r: string) =>
        r === "gallery.fotno.com" || r === "gallery.fotno.com.",
    );
  } catch {
    // DNS resolution failed
  }

  // Also check TXT record for verification token
  let txtValid = false;
  try {
    const txtRecords = await dns.resolveTxt(
      `_fotno-verify.${domain.domain}`,
    );
    txtValid = txtRecords.some((r: string[]) =>
      r.some((v) => v === domain.verificationToken),
    );
  } catch {
    // TXT resolution failed
  }

  if (!cnameValid) {
    await (prisma as any).customDomain.update({
      where: { userId },
      data: { status: "FAILED" },
    });
    throw new AppError(
      `CNAME record for ${domain.domain} must point to gallery.fotno.com`,
      400,
    );
  }

  if (!txtValid) {
    await (prisma as any).customDomain.update({
      where: { userId },
      data: { status: "FAILED" },
    });
    throw new AppError(
      `TXT record _fotno-verify.${domain.domain} must contain ${domain.verificationToken}`,
      400,
    );
  }

  const updated = await (prisma as any).customDomain.update({
    where: { userId },
    data: { status: "VERIFIED", verifiedAt: new Date() },
  });

  return {
    id: updated.id,
    domain: updated.domain,
    status: updated.status,
    verifiedAt: updated.verifiedAt,
  };
};

export const removeCustomDomain = async (userId: string) => {
  const domain = await (prisma as any).customDomain.findUnique({
    where: { userId },
  });

  if (!domain) throw new AppError("No custom domain configured", 404);

  await (prisma as any).customDomain.delete({ where: { userId } });

  return { removed: true };
};
