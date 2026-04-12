import { PrismaClient } from "../prisma/prisma/generated";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "better-auth/crypto";
import { config as loadEnv } from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

// Load .env
for (const p of [
  resolve(process.cwd(), ".env"),
  resolve(process.cwd(), "../../.env"),
]) {
  if (existsSync(p)) loadEnv({ path: p });
}

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!connectionString)
  throw new Error("DIRECT_URL or DATABASE_URL is required");

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...\n");

  // ── Admin User ──────────────────────────────────────────────
  const adminEmail = "karim@fotno.com";
  const existingAdmin = await prisma.user.findFirst({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await hashPassword("Karim@123");

    const admin = await prisma.user.create({
      data: {
        name: "Karim",
        email: adminEmail,
        emailVerified: true,
        role: "admin",
        plan: "FREE",
        finishOnboarding: true,
      },
    });

    await prisma.account.create({
      data: {
        userId: admin.id,
        accountId: admin.id,
        providerId: "credential",
        password: hashedPassword,
      },
    });

    console.log(`✔ Admin user created: ${adminEmail}`);
  } else {
    console.log(`⏭ Admin user already exists: ${adminEmail}`);
  }

  // ── Pricing Tiers ──────────────────────────────────────────
  const tiers = [
    {
      gb: 5,
      label: "Free",
      priceCents: 0,
      stripePriceId: null,
      galleryLimit: 2,
      sortOrder: -1,
    },
    {
      gb: 20,
      label: "Solo",
      priceCents: 900,
      stripePriceId: "price_1TGNnaEuz1yMNGtKXH58iYdp",
      galleryLimit: null,
      sortOrder: 0,
    },
    {
      gb: 100,
      label: "Studio",
      priceCents: 1900,
      stripePriceId: "price_1TGNnaEuz1yMNGtK2IL5v0uV",
      galleryLimit: null,
      sortOrder: 1,
    },
    {
      gb: -1,
      label: "Unlimited",
      priceCents: 4900,
      stripePriceId: "price_1TGNnaEuz1yMNGtK3ZAQs9w2",
      galleryLimit: null,
      sortOrder: 2,
    },
  ];

  for (const tier of tiers) {
    await prisma.pricingTier.upsert({
      where: { gb: tier.gb },
      update: {
        label: tier.label,
        priceCents: tier.priceCents,
        stripePriceId: tier.stripePriceId,
        galleryLimit: tier.galleryLimit,
        sortOrder: tier.sortOrder,
      },
      create: tier,
    });
  }
  console.log(`✔ Pricing tiers seeded (${tiers.length} tiers)`);

  // ── Regional Pricing (Egypt) ───────────────────────────────
  const egRegional = await prisma.regionalPricing.upsert({
    where: { countryCode: "EG" },
    update: { pppMultiplier: 0.33 },
    create: {
      id: "eg-regional",
      countryCode: "EG",
      currency: "EGP",
      symbol: "EGP",
      locale: "en-EG",
      pppMultiplier: 0.33,
    },
  });
  console.log(`✔ Regional pricing seeded (EG)`);

  // ── Regional Tier Overrides ────────────────────────────────
  const overrides = [
    { tierGb: 20, localPriceCents: 15000, checkoutCents: 300 },
    { tierGb: 100, localPriceCents: 30000, checkoutCents: 627 },
  ];

  for (const override of overrides) {
    await prisma.regionalTierOverride.upsert({
      where: {
        regionalPricingId_tierGb: {
          regionalPricingId: egRegional.id,
          tierGb: override.tierGb,
        },
      },
      update: {
        localPriceCents: override.localPriceCents,
        checkoutCents: override.checkoutCents,
      },
      create: {
        regionalPricingId: egRegional.id,
        ...override,
      },
    });
  }
  console.log(
    `✔ Regional tier overrides seeded (${overrides.length} overrides)`,
  );

  // ── Tier Features ─────────────────────────────────────────────
  const tierFeatureMap: Record<string, string[]> = {
    Free: [],
    Solo: [
      "UNLIMITED_GALLERIES",
      "CLIENT_FAVORITES",
      "COMMENTS",
      "PASSWORD_PROTECTION",
      "CUSTOM_SLUGS",
      "SLIDESHOW_SHARING",
      "DOWNLOAD",
      "ANALYTICS",
    ],
    Studio: [
      "UNLIMITED_GALLERIES",
      "CLIENT_FAVORITES",
      "COMMENTS",
      "PASSWORD_PROTECTION",
      "CUSTOM_SLUGS",
      "SLIDESHOW_SHARING",
      "DOWNLOAD",
      "GOOGLE_IMPORT",
      "SMART_ALBUMS",
      "CUSTOM_DOMAINS",
      "ANALYTICS",
    ],
    Unlimited: [
      "UNLIMITED_GALLERIES",
      "CLIENT_FAVORITES",
      "COMMENTS",
      "PASSWORD_PROTECTION",
      "CUSTOM_SLUGS",
      "SLIDESHOW_SHARING",
      "DOWNLOAD",
      "GOOGLE_IMPORT",
      "SMART_ALBUMS",
      "CUSTOM_DOMAINS",
      "WEBSITE_BUILDER",
      "ANALYTICS",
    ],
  };

  let totalFeatures = 0;
  for (const [tierLabel, featureKeys] of Object.entries(tierFeatureMap)) {
    const tier = await prisma.pricingTier.findFirst({
      where: { label: tierLabel },
    });
    if (!tier) continue;

    for (const featureKey of featureKeys) {
      await prisma.tierFeature.upsert({
        where: {
          tierId_featureKey: { tierId: tier.id, featureKey },
        },
        update: {},
        create: { tierId: tier.id, featureKey },
      });
      totalFeatures++;
    }
  }
  console.log(`✔ Tier features seeded (${totalFeatures} feature assignments)`);

  console.log("\n✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
