import { cookies, headers } from "next/headers";
import {
  FEATURE_KEYS,
  FEATURE_LABELS,
  FEATURE_BLURBS,
  type FeatureKey,
} from "@workspace/lib";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import TrackRybbitButton from "./TrackRybbitButton";

type PlanTier = {
  gb: number;
  priceCents: number;
  label: string;
  galleryLimit?: number | null;
  features?: string[];
};

const FALLBACK_FREE: PlanTier = {
  gb: 5,
  priceCents: 0,
  label: "Free",
  galleryLimit: 2,
  features: [
    "CLIENT_FAVORITES",
    "PASSWORD_PROTECTION",
    "DOWNLOAD",
  ],
};

const ALL_FEATURES: { key: FeatureKey; label: string; blurb: string }[] =
  FEATURE_KEYS.map((key) => ({
    key,
    label: FEATURE_LABELS[key],
    blurb: FEATURE_BLURBS[key],
  }));

function FeatureIcon({ name }: { name: string }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "UNLIMITED_GALLERIES":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="8" height="7" rx="1.2" />
          <rect x="13" y="4" width="8" height="7" rx="1.2" />
          <rect x="3" y="13" width="8" height="7" rx="1.2" />
          <rect x="13" y="13" width="8" height="7" rx="1.2" />
        </svg>
      );
    case "CLIENT_FAVORITES":
      return (
        <svg {...common}>
          <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />
        </svg>
      );
    case "COMMENTS":
      return (
        <svg {...common}>
          <path d="M4 5h16v11H9l-4 4V5z" />
        </svg>
      );
    case "PASSWORD_PROTECTION":
      return (
        <svg {...common}>
          <rect x="5" y="11" width="14" height="9" rx="1.5" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
      );
    case "CUSTOM_SLUGS":
      return (
        <svg {...common}>
          <path d="M10 14a4 4 0 0 1 0-5.6l2-2a4 4 0 1 1 5.6 5.6L16 13.5" />
          <path d="M14 10a4 4 0 0 1 0 5.6l-2 2a4 4 0 1 1-5.6-5.6L8 10.5" />
        </svg>
      );
    case "SLIDESHOW_SHARING":
      return (
        <svg {...common}>
          <circle cx="18" cy="5" r="2.5" />
          <circle cx="6" cy="12" r="2.5" />
          <circle cx="18" cy="19" r="2.5" />
          <path d="M8 10.5l8-4.2M8 13.5l8 4.2" />
        </svg>
      );
    case "DOWNLOAD":
      return (
        <svg {...common}>
          <path d="M12 4v11" />
          <path d="M7 11l5 5 5-5" />
          <path d="M4 20h16" />
        </svg>
      );
    case "GOOGLE_IMPORT":
      return (
        <svg {...common}>
          <path d="M12 4v16" />
          <path d="M4 10l8-6 8 6" />
          <path d="M6 14l6 6 6-6" />
        </svg>
      );
    case "SMART_ALBUMS":
      return (
        <svg {...common}>
          <path d="M3 6h10l2 3h6v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6z" />
          <path d="M12 13l1.2 2.4 2.6.3-1.9 1.8.5 2.6-2.4-1.3-2.4 1.3.5-2.6L8.2 15.7l2.6-.3z" />
        </svg>
      );
    case "CUSTOM_DOMAINS":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <path d="M4 12h16" />
          <path d="M12 4c2.5 2.5 4 5.5 4 8s-1.5 5.5-4 8c-2.5-2.5-4-5.5-4-8s1.5-5.5 4-8z" />
        </svg>
      );
    case "WEBSITE_BUILDER":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="16" rx="1.5" />
          <path d="M3 9h18" />
          <path d="M7 6.5h.01M10 6.5h.01" />
        </svg>
      );
    case "ANALYTICS":
      return (
        <svg {...common}>
          <path d="M4 20V10" />
          <path d="M10 20V4" />
          <path d="M16 20v-7" />
          <path d="M22 20H2" />
        </svg>
      );
    default:
      return null;
  }
}

const formatStorage = (gb: number) => {
  if (gb === -1) return "Unlimited";
  if (gb <= 0) return "1 GB";
  if (gb >= 1000) return `${gb / 1000} TB`;
  return `${gb} GB`;
};

async function fetchFreeTier(country?: string): Promise<PlanTier> {
  const backendUrl =
    process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL;
  if (!backendUrl) return FALLBACK_FREE;

  try {
    const url = country
      ? `${backendUrl}/api/billing/plans?country=${encodeURIComponent(country)}`
      : `${backendUrl}/api/billing/plans`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return FALLBACK_FREE;
    const data = await res.json();
    const tiers: PlanTier[] = Array.isArray(data)
      ? data
      : Array.isArray(data?.tiers)
        ? data.tiers
        : [];
    return tiers.find((t) => t.priceCents === 0) ?? FALLBACK_FREE;
  } catch {
    return FALLBACK_FREE;
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
  const free = await fetchFreeTier(country);
  const galleryLimit = free.galleryLimit ?? 2;
  const galleriesLabel =
    galleryLimit === 1 ? "1 gallery" : `${galleryLimit} galleries`;
  const enabledKeys = new Set(free.features ?? []);
  const visibleFeatures = ALL_FEATURES.filter((f) => enabledKeys.has(f.key));
  const featureCount = visibleFeatures.length;
  const featureCountLabel =
    featureCount === 1 ? "1 feature" : `All ${featureCount} features`;

  return (
    <section
      id="pricing"
      aria-label="Pricing"
      className="bg-background py-24 sm:py-32"
    >
      <Container>
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-primary">
            Pricing
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Free. And we mean free.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Every Fotno feature available, forever, at zero cost. We&apos;ll add
            paid tiers later — but everything built today is yours.
          </p>
        </div>

        {/* Panel */}
        <div className="mx-auto mt-14 max-w-[1120px] rounded-3xl border border-foreground/10 bg-foreground/[0.03] px-6 py-10 sm:px-12 sm:py-12">
          {/* Hero: claim on left, signature $0 on right */}
          <div className="grid items-center gap-10 md:grid-cols-[1.2fr_1fr]">
            <div>
              <span className="inline-flex items-center rounded-full bg-primary/15 px-3.5 py-1 text-xs font-medium text-primary">
                Free forever
              </span>
              <h3 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.025em] text-foreground sm:text-5xl">
                Every tool.
                <br />
                Zero dollars.
              </h3>
              <p className="mt-4 text-base text-muted-foreground">
                {formatStorage(free.gb)} storage · {galleriesLabel} ·{" "}
                {featureCountLabel}
              </p>
              <div className="mt-6">
                <TrackRybbitButton
                  eventName="free_tier_clicked"
                  eventData={{ plan: free.label }}
                >
                  <Button
                    href={`${signupUrl}/account?plan=Free`}
                    variant="solid"
                    aria-label="Get started free"
                    className="rounded-full px-8 py-3.5 text-base"
                  >
                    Get started free
                  </Button>
                </TrackRybbitButton>
              </div>
              <p className="mt-3 text-xs text-muted-foreground/80">
                No credit card required
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-start justify-center">
                <span className="mt-5 text-4xl font-semibold text-foreground/70 sm:text-5xl">
                  $
                </span>
                <span className="text-[140px] font-bold leading-[0.85] tracking-[-0.05em] text-foreground sm:text-[180px]">
                  0
                </span>
              </div>
              <p className="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                per month, forever
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="my-8 h-px bg-foreground/10" />

          {/* Feature header */}
          <div className="flex items-baseline justify-between">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Everything included
            </p>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-primary">
              {featureCountLabel}
            </p>
          </div>

          {/* Feature tiles */}
          <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {visibleFeatures.map((f) => (
              <div
                key={f.key}
                className="flex min-h-[142px] flex-col gap-2.5 rounded-2xl border border-foreground/10 bg-foreground/[0.02] px-5 py-5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <FeatureIcon name={f.key} />
                </div>
                <p className="text-[15px] font-semibold leading-snug tracking-[-0.005em] text-foreground">
                  {f.label}
                </p>
                <p className="text-[13px] leading-[1.45] text-muted-foreground">
                  {f.blurb}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
