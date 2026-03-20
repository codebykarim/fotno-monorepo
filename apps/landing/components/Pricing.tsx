import { cookies, headers } from "next/headers";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";

function CheckIcon({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      aria-hidden="true"
      className={cn("h-5 w-5 flex-none fill-current stroke-current", className)}
      {...props}
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
  localPriceCents?: number;
  currency?: string;
  symbol?: string;
  locale?: string;
};

const FALLBACK_TIERS: PlanTier[] = [
  { gb: 20, priceCents: 900, label: "Starter" },
  { gb: 100, priceCents: 1900, label: "Professional" },
  { gb: 500, priceCents: 3500, label: "Business" },
  { gb: -1, priceCents: 4900, label: "Unlimited" },
];

const FEATURES = [
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

const formatTierPrice = (tier: PlanTier) => {
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
  if (gb >= 1000) return `${gb / 1000} TB`;
  return `${gb} GB`;
};

async function fetchPlans(country?: string): Promise<PlanTier[]> {
  const backendUrl =
    process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL;
  if (!backendUrl) return FALLBACK_TIERS;

  try {
    const url = country
      ? `${backendUrl}/api/billing/plans?country=${encodeURIComponent(country)}`
      : `${backendUrl}/api/billing/plans`;
    const res = await fetch(url, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return FALLBACK_TIERS;
    const data = await res.json();
    const plans: PlanTier[] = Array.isArray(data) ? data : data?.data;
    if (!Array.isArray(plans) || plans.length === 0) return FALLBACK_TIERS;
    return plans;
  } catch {
    return FALLBACK_TIERS;
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
  const plans = await fetchPlans(country);

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
            One plan. Pick your storage.
          </h2>
          <p className="mt-4 text-lg text-background/50">
            Every feature is included at every tier — only storage differs. Pick
            the plan that fits your workflow.
          </p>
        </div>

        {/* Storage tier grid */}
        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-4 lg:grid-cols-4">
          {plans.map((tier) => {
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
            {FEATURES.map((feature) => (
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
