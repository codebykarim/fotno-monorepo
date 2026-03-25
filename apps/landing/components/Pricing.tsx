import { cookies, headers } from "next/headers";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cn("h-5 w-5 flex-none fill-current stroke-current", className)}
      viewBox="0 0 24 24"
    >
      <path
        d="M9.307 12.248a.75.75 0 1 0-1.114 1.004l1.114-1.004ZM11 15.25l-.557.502a.75.75 0 0 0 1.15-.043L11 15.25Zm4.844-5.041a.75.75 0 0 0-1.188-.918l1.188.918Zm-7.651 3.043 2.25 2.5 1.114-1.004-2.25-2.5-1.114 1.004Zm3.4 2.457 4.25-5.5-1.187-.918-4.25 5.5 1.188.918Z"
        strokeWidth={0}
      />
      <circle
        cx={12}
        cy={12}
        r={8.25}
        fill="none"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type PlanTier = {
  gb: number;
  priceCents: number;
  label: string;
  galleryLimit?: number | null;
  localPriceCents?: number;
  currency?: string;
  symbol?: string;
  locale?: string;
};

type PlansResponse = {
  tiers: PlanTier[];
  features: string[];
  freeFeatures: string[];
};

const FALLBACK_TIERS: PlanTier[] = [
  { gb: 0, priceCents: 0, label: "Free", galleryLimit: 2 },
  { gb: 20, priceCents: 900, label: "Starter" },
  { gb: 100, priceCents: 1900, label: "Professional" },
  { gb: 500, priceCents: 3500, label: "Business" },
  { gb: -1, priceCents: 4900, label: "Unlimited" },
];

const FALLBACK_FEATURES = [
  "Unlimited galleries",
  "Unlimited clients",
  "AI-powered captions",
  "Client favorites & selections",
  "Download tracking & analytics",
  "Password-protected galleries",
  "Custom gallery slugs",
  "Bulk upload with auto-retry",
  "Google Drive & Google Photos import",
  "Slideshow & social sharing",
];

const FALLBACK_FREE_FEATURES = [
  "1 GB storage",
  "Up to 2 galleries",
  "AI-powered captions",
  "Client favorites & selections",
  "Download tracking & analytics",
  "Password-protected galleries",
];

const formatTierPrice = (tier: PlanTier) => {
  if (tier.priceCents === 0) return "Free";
  const cents = tier.localPriceCents ?? tier.priceCents;
  const currency = tier.currency ?? "USD";
  const locale = tier.locale ?? "en-US";
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(cents / 100);
  } catch {
    return `$${(tier.priceCents / 100).toFixed(0)}`;
  }
};

const formatStorage = (gb: number) => {
  if (gb === -1) return "Unlimited";
  if (gb === 0) return "1 GB";
  if (gb >= 1000) return `${gb / 1000} TB`;
  return `${gb} GB`;
};

async function fetchPlans(
  country?: string,
): Promise<{ tiers: PlanTier[]; features: string[]; freeFeatures: string[] }> {
  const backendUrl =
    process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL;
  if (!backendUrl)
    return { tiers: FALLBACK_TIERS, features: FALLBACK_FEATURES, freeFeatures: FALLBACK_FREE_FEATURES };

  try {
    const url = country
      ? `${backendUrl}/api/billing/plans?country=${encodeURIComponent(country)}`
      : `${backendUrl}/api/billing/plans`;
    const res = await fetch(url, {
      next: { revalidate: 300 },
    });
    if (!res.ok)
      return { tiers: FALLBACK_TIERS, features: FALLBACK_FEATURES, freeFeatures: FALLBACK_FREE_FEATURES };
    const data = await res.json();
    // Handle both formats: new { tiers, features } and legacy PlanTier[]
    const tiers: PlanTier[] = Array.isArray(data)
      ? data
      : Array.isArray(data?.tiers)
        ? data.tiers
        : [];
    const features: string[] = data?.features ?? FALLBACK_FEATURES;
    const freeFeatures: string[] = data?.freeFeatures ?? FALLBACK_FREE_FEATURES;
    if (tiers.length === 0)
      return { tiers: FALLBACK_TIERS, features: FALLBACK_FEATURES, freeFeatures: FALLBACK_FREE_FEATURES };
    return { tiers, features, freeFeatures };
  } catch {
    return { tiers: FALLBACK_TIERS, features: FALLBACK_FEATURES, freeFeatures: FALLBACK_FREE_FEATURES };
  }
}

const signupUrl = process.env.NEXT_PUBLIC_AUTH_URL;

export async function Pricing() {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const country =
    cookieStore.get("user_country")?.value ||
    headerStore.get("cf-ipcountry") ||
    headerStore.get("x-vercel-ip-country") ||
    undefined;
  const { tiers: allPlans, features, freeFeatures } = await fetchPlans(country);

  const paidPlans = allPlans.filter((t) => t.priceCents > 0);
  const freeTier = allPlans.find((t) => t.priceCents === 0);

  return (
    <section
      id="pricing"
      aria-label="Pricing"
      className="relative overflow-hidden bg-foreground py-24 sm:py-32"
    >
      {/* Decorative gradient */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-96 w-[140%] -translate-x-1/2 opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.78 0.14 65 / 0.2) 0%, transparent 70%)",
        }}
      />

      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Pricing
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-background sm:text-4xl lg:text-5xl">
            Start free. Scale when ready.
          </h2>
          <p className="mt-4 text-lg text-background/50">
            Every feature is included at every tier — only storage differs. Pick
            the plan that fits your workflow.
          </p>
        </div>

        {/* ── Free tier callout ──────────────────────────────────── */}
        {freeTier && (
          <div className="mx-auto mt-16 max-w-2xl">
            <div className="rounded-2xl border border-background/10 bg-background/5 px-8 py-8 text-center">
              <span className="inline-flex items-center rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                Free forever
              </span>
              <h3 className="mt-4 text-2xl font-bold text-background">
                Get started for free
              </h3>
              <p className="mt-2 text-background/50">
                {formatStorage(freeTier.gb)} storage &middot; {freeTier.galleryLimit ?? 2} galleries &middot; All core features
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {freeFeatures.map((feature) => (
                  <span
                    key={feature}
                    className="inline-flex items-center gap-1.5 text-sm text-background/70"
                  >
                    <CheckIcon className="text-primary" />
                    {feature}
                  </span>
                ))}
              </div>
              <div className="mt-6">
                <Button
                  href={`${signupUrl}/account`}
                  variant="solid"
                  color="white"
                  aria-label="Get started free"
                  className="px-8 py-3 text-base"
                >
                  Get started free
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ── Paid storage tier grid ────────────────────────────── */}
        <div className="mx-auto mt-12 text-center">
          <p className="text-sm font-medium text-background/40 uppercase tracking-wider">
            Need more storage?
          </p>
        </div>
        <div className="mx-auto mt-6 grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">
          {paidPlans.map((tier) => {
            const isPopular = tier.label === "Professional" || tier.gb === 100;
            return (
              <a
                key={tier.gb}
                href={`${signupUrl}/account`}
                className={cn(
                  "relative flex flex-col items-center rounded-2xl px-5 py-8 text-center transition-all duration-300 hover:-translate-y-1",
                  isPopular
                    ? "bg-primary shadow-xl shadow-primary/20 scale-[1.04]"
                    : "border border-background/10 bg-background/5 hover:border-background/20 hover:bg-background/10",
                )}
              >
                {isPopular && (
                  <span className="absolute -top-3 rounded-full bg-background px-3 py-0.5 text-xs font-semibold text-foreground">
                    Most popular
                  </span>
                )}
                <span
                  className={cn(
                    "text-base font-semibold",
                    isPopular
                      ? "text-primary-foreground"
                      : "text-background/70",
                  )}
                >
                  {tier.label}
                </span>
                <span
                  className={cn(
                    "mt-3 text-4xl font-light tracking-tight",
                    isPopular ? "text-primary-foreground" : "text-background",
                  )}
                >
                  {formatTierPrice(tier)}
                </span>
                <span
                  className={cn(
                    "mt-1 text-sm",
                    isPopular
                      ? "text-primary-foreground/70"
                      : "text-background/50",
                  )}
                >
                  /month
                </span>
                <span
                  className={cn(
                    "mt-4 text-sm font-medium",
                    isPopular
                      ? "text-primary-foreground/90"
                      : "text-background/60",
                  )}
                >
                  {formatStorage(tier.gb)} storage
                </span>
              </a>
            );
          })}
        </div>

        {/* Features list */}
        <div className="mx-auto mt-16 max-w-3xl">
          <h3 className="text-center text-lg font-semibold text-background">
            Everything included with every plan
          </h3>
          <ul
            role="list"
            className="mt-8 grid grid-cols-1 gap-x-12 gap-y-3 text-sm text-background/70 sm:grid-cols-2"
          >
            {features.map((feature) => (
              <li key={feature} className="flex items-center">
                <CheckIcon className="text-primary" />
                <span className="ml-4">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="mt-12 flex justify-center">
          <Button
            href={`${signupUrl}/account`}
            variant="solid"
            color="white"
            aria-label="Get started"
            className="px-8 py-3 text-base"
          >
            Get started
          </Button>
        </div>
      </Container>
    </section>
  );
}
