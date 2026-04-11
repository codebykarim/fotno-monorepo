import { cookies, headers } from "next/headers";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import TrackRybbitButton from "./TrackRybbitButton";

declare global {
  interface Window {
    rybbit?: {
      event: (eventName: string, eventData?: Record<string, any>) => void;
      pageview: () => void;
    };
  }
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cn(
        "h-5 w-5 flex-none fill-current stroke-current",
        className,
      )}
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
  features?: string[];
  localPriceCents?: number;
  currency?: string;
  symbol?: string;
  locale?: string;
};

const FALLBACK_TIERS: PlanTier[] = [
  { gb: 0, priceCents: 0, label: "Free", galleryLimit: 2, features: [] },
  {
    gb: 20,
    priceCents: 900,
    label: "Solo",
    features: [
      "UNLIMITED_GALLERIES",
      "CLIENT_FAVORITES",
      "PASSWORD_PROTECTION",
      "CUSTOM_SLUGS",
      "SLIDESHOW_SHARING",
      "COMMENTS",
      "DOWNLOAD_ANALYTICS",
    ],
  },
  {
    gb: 100,
    priceCents: 1900,
    label: "Studio",
    features: [
      "UNLIMITED_GALLERIES",
      "CLIENT_FAVORITES",
      "PASSWORD_PROTECTION",
      "CUSTOM_SLUGS",
      "SLIDESHOW_SHARING",
      "COMMENTS",
      "DOWNLOAD_ANALYTICS",
      "GOOGLE_IMPORT",
      "SMART_ALBUMS",
    ],
  },
  {
    gb: -1,
    priceCents: 4900,
    label: "Unlimited",
    features: [
      "UNLIMITED_GALLERIES",
      "CLIENT_FAVORITES",
      "PASSWORD_PROTECTION",
      "CUSTOM_SLUGS",
      "SLIDESHOW_SHARING",
      "COMMENTS",
      "DOWNLOAD_ANALYTICS",
      "GOOGLE_IMPORT",
      "SMART_ALBUMS",
    ],
  },
];

const FALLBACK_FEATURES = [
  "Unlimited galleries",
  "Client favorites & notes",
  "Download tracking & analytics",
  "Password-protected galleries",
  "Custom gallery slugs",
  "Google Drive & Google Photos import",
  "Slideshow & social sharing",
];

const FALLBACK_FREE_FEATURES = [
  "1 GB storage",
  "Up to 2 galleries",
  "Client favorites & notes",
  "Download tracking & analytics",
  "Password-protected galleries",
];

/** Map feature keys to human-readable labels */
const FEATURE_LABELS: Record<string, string> = {
  UNLIMITED_GALLERIES: "Unlimited galleries",
  PASSWORD_PROTECTION: "Password-protected galleries",
  CUSTOM_SLUGS: "Custom gallery slugs",
  SLIDESHOW_SHARING: "Slideshow & social sharing",
  DOWNLOAD_ANALYTICS: "Download tracking & analytics",
  GOOGLE_IMPORT: "Google Drive & Google Photos import",
  SMART_ALBUMS: "Smart albums",
  CUSTOM_DOMAINS: "Custom domains",
  WEBSITE_BUILDER: "Website builder",
  CLIENT_FAVORITES: "Client favorites & notes",
  COMMENTS: "Gallery comments",
};

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
  if (gb === 0) return "Free";
  if (gb >= 1000) return `${gb / 1000} TB`;
  return `${gb} GB`;
};

async function fetchPlans(
  country?: string,
): Promise<{ tiers: PlanTier[]; features: string[]; freeFeatures: string[] }> {
  const backendUrl =
    process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL;
  if (!backendUrl)
    return {
      tiers: FALLBACK_TIERS,
      features: FALLBACK_FEATURES,
      freeFeatures: FALLBACK_FREE_FEATURES,
    };

  try {
    const url = country
      ? `${backendUrl}/api/billing/plans?country=${encodeURIComponent(country)}`
      : `${backendUrl}/api/billing/plans`;
    const res = await fetch(url, {
      next: { revalidate: 300 },
    });
    if (!res.ok)
      return {
        tiers: FALLBACK_TIERS,
        features: FALLBACK_FEATURES,
        freeFeatures: FALLBACK_FREE_FEATURES,
      };
    const data = await res.json();
    const tiers: PlanTier[] = Array.isArray(data)
      ? data
      : Array.isArray(data?.tiers)
        ? data.tiers
        : [];
    const features: string[] = data?.features ?? FALLBACK_FEATURES;
    const freeFeatures: string[] = data?.freeFeatures ?? FALLBACK_FREE_FEATURES;
    if (tiers.length === 0)
      return {
        tiers: FALLBACK_TIERS,
        features: FALLBACK_FEATURES,
        freeFeatures: FALLBACK_FREE_FEATURES,
      };
    return { tiers, features, freeFeatures };
  } catch {
    return {
      tiers: FALLBACK_TIERS,
      features: FALLBACK_FEATURES,
      freeFeatures: FALLBACK_FREE_FEATURES,
    };
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
  const { tiers: allPlans, freeFeatures } = await fetchPlans(country);

  const freeTier = allPlans.find((t) => t.priceCents === 0);
  // Main 3 cards: Solo, Studio (popular), Unlimited
  const mainPlans = allPlans.filter((t) => t.priceCents > 0);

  /** Features this tier adds over the previous one */
  const getNewFeatures = (tier: PlanTier, prevTier?: PlanTier): string[] => {
    const prev = new Set(prevTier?.features ?? []);
    return (tier.features ?? []).filter((f) => !prev.has(f));
  };

  const featureLabel = (key: string): string => FEATURE_LABELS[key] ?? key;

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
            Pick the plan that fits your workflow. Upgrade anytime to unlock more
            features and storage.
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
                {formatStorage(freeTier.gb)} storage &middot;{" "}
                {freeTier.galleryLimit === 1
                  ? "1 gallery"
                  : `${freeTier.galleryLimit} galleries`}{" "}
                &middot; Core features included
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
                <TrackRybbitButton
                  eventName="free_tier_clicked"
                  eventData={{ plan: freeTier.label }}
                >
                  <Button
                    href={`${signupUrl}/account?plan=Free`}
                    variant="solid"
                    color="white"
                    aria-label="Get started free"
                    className="px-8 py-3 text-base"
                  >
                    Get started free
                  </Button>
                </TrackRybbitButton>
              </div>
            </div>
          </div>
        )}

        {/* ── Main 3-card grid ──────────────────────────────────── */}
        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          {mainPlans.map((tier, i) => {
            const isPopular = tier.label === "Studio" || tier.gb === 100;
            const isUnlimited = tier.gb === -1;
            const prevTier = i === 0 ? freeTier : mainPlans[i - 1];
            const newFeatures = getNewFeatures(tier, prevTier);
            const inheritedLabel =
              i === 0 ? null : `Everything in ${prevTier?.label}`;

            return (
              <div
                key={tier.gb}
                className={cn(
                  "relative flex flex-col rounded-2xl px-6 py-8 transition-all duration-300",
                  isPopular
                    ? "bg-primary shadow-xl shadow-primary/20 ring-2 ring-primary md:-my-4 md:py-12"
                    : "border border-background/10 bg-background/5",
                )}
              >
                {isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-background px-3 py-0.5 text-xs font-semibold text-foreground">
                    Most popular
                  </span>
                )}

                {/* Header */}
                <div className="text-center">
                  <h3
                    className={cn(
                      "text-lg font-semibold",
                      isPopular
                        ? "text-primary-foreground"
                        : "text-background/70",
                    )}
                  >
                    {tier.label}
                  </h3>
                  <p
                    className={cn(
                      "mt-4 text-4xl font-light tracking-tight",
                      isPopular ? "text-primary-foreground" : "text-background",
                    )}
                  >
                    {formatTierPrice(tier)}
                  </p>
                  <p
                    className={cn(
                      "mt-1 text-sm",
                      isPopular
                        ? "text-primary-foreground/70"
                        : "text-background/50",
                    )}
                  >
                    /month
                  </p>
                  <p
                    className={cn(
                      "mt-3 text-sm font-medium",
                      isPopular
                        ? "text-primary-foreground/90"
                        : "text-background/60",
                    )}
                  >
                    {isUnlimited
                      ? "Unlimited storage"
                      : `${formatStorage(tier.gb)} storage`}
                  </p>
                </div>

                {/* Divider */}
                <div
                  className={cn(
                    "my-6 h-px",
                    isPopular ? "bg-primary-foreground/20" : "bg-background/10",
                  )}
                />

                {/* Features */}
                <ul
                  className={cn(
                    "flex-1 space-y-3 text-sm",
                    isPopular
                      ? "text-primary-foreground/85"
                      : "text-background/70",
                  )}
                >
                  {inheritedLabel && (
                    <li className="flex items-start gap-2.5">
                      <CheckIcon
                        className={cn(
                          "mt-0.5 shrink-0",
                          isPopular
                            ? "text-primary-foreground"
                            : "text-primary",
                        )}
                      />
                      <span className="font-medium">
                        {newFeatures.length > 0
                          ? `${inheritedLabel}, plus:`
                          : inheritedLabel}
                      </span>
                    </li>
                  )}
                  {newFeatures.map((key) => (
                    <li key={key} className="flex items-start gap-2.5">
                      <CheckIcon
                        className={cn(
                          "mt-0.5 shrink-0",
                          isPopular
                            ? "text-primary-foreground"
                            : "text-primary",
                        )}
                      />
                      <span>{featureLabel(key)}</span>
                    </li>
                  ))}
                  {isUnlimited && (
                    <>
                      <li className="flex items-start gap-2.5 opacity-60">
                        <CheckIcon className="mt-0.5 shrink-0 text-primary" />
                        <span>
                          Custom domains{" "}
                          <span className="rounded bg-background/10 px-1.5 py-0.5 text-xs">
                            soon
                          </span>
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5 opacity-60">
                        <CheckIcon className="mt-0.5 shrink-0 text-primary" />
                        <span>
                          Website builder{" "}
                          <span className="rounded bg-background/10 px-1.5 py-0.5 text-xs">
                            soon
                          </span>
                        </span>
                      </li>
                    </>
                  )}
                </ul>

                {/* CTA */}
                <div className="mt-8">
                  <TrackRybbitButton
                    eventName="subscribe_to_plan"
                    eventData={{ plan: tier.label }}
                  >
                    <Button
                      href={`${signupUrl}/account?plan=${tier.label}`}
                      variant={isPopular ? "solid" : "outline"}
                      color="white"
                      aria-label={`Choose ${tier.label}`}
                      className={cn(
                        "w-full py-2.5 text-sm",
                        !isPopular &&
                          "border-background/20 text-background hover:bg-background/10",
                      )}
                    >
                      Choose {tier.label}
                    </Button>
                  </TrackRybbitButton>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
