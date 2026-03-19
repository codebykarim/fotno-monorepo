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
      className={cn("h-6 w-6 flex-none fill-current stroke-current", className)}
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
};

const FALLBACK_TIERS: PlanTier[] = [
  { gb: 50, priceCents: 500, label: "50 GB" },
  { gb: 100, priceCents: 900, label: "100 GB" },
  { gb: 250, priceCents: 1900, label: "250 GB" },
  { gb: 500, priceCents: 3500, label: "500 GB" },
  { gb: 1000, priceCents: 5900, label: "1 TB" },
  { gb: 2000, priceCents: 9900, label: "2 TB" },
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

const formatPrice = (cents: number) => `$${(cents / 100).toFixed(0)}`;

async function fetchPlans(): Promise<PlanTier[]> {
  const backendUrl =
    process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL;
  if (!backendUrl) return FALLBACK_TIERS;

  try {
    const res = await fetch(`${backendUrl}/api/billing/plans`, {
      next: { revalidate: 300 }, // ISR: revalidate every 5 minutes
    });
    if (!res.ok) return FALLBACK_TIERS;
    const data = await res.json();
    // The backend wraps in a `data` field via controllerReturn
    const plans: PlanTier[] = Array.isArray(data) ? data : data?.data;
    if (!Array.isArray(plans) || plans.length === 0) return FALLBACK_TIERS;
    return plans;
  } catch {
    return FALLBACK_TIERS;
  }
}

const signupUrl = process.env.NEXT_PUBLIC_AUTH_URL;

export async function Pricing() {
  const plans = await fetchPlans();

  return (
    <section
      id="pricing"
      aria-label="Pricing"
      className="bg-foreground py-20 sm:py-32"
    >
      <Container>
        <div className="md:text-center">
          <h2 className="text-3xl tracking-tight text-background sm:text-4xl font-semibold">
            One plan. Pick your storage.
          </h2>
          <p className="mt-4 text-lg text-background/50">
            Every feature is included at every tier — only storage differs.
            Pick the plan that fits your workflow.
          </p>
        </div>

        {/* Storage tier grid */}
        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {plans.map((tier) => {
            const isPopular = tier.gb === 250;
            return (
              <a
                key={tier.gb}
                href={`${signupUrl}/account`}
                className={cn(
                  "relative flex flex-col items-center rounded-2xl px-4 py-6 text-center transition-all duration-300 hover:-translate-y-1",
                  isPopular
                    ? "bg-primary shadow-xl shadow-primary/20 scale-[1.04]"
                    : "bg-foreground border border-background/10 hover:border-background/20",
                )}
              >
                {isPopular && (
                  <span className="absolute -top-3 rounded-full bg-background px-3 py-0.5 text-xs font-semibold text-foreground">
                    Popular
                  </span>
                )}
                <span
                  className={cn(
                    "text-3xl font-light tracking-tight",
                    isPopular
                      ? "text-primary-foreground"
                      : "text-background",
                  )}
                >
                  {formatPrice(tier.priceCents)}
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
                    "mt-3 text-base font-semibold",
                    isPopular
                      ? "text-primary-foreground"
                      : "text-background",
                  )}
                >
                  {tier.label}
                </span>
              </a>
            );
          })}
        </div>

        {/* Features list */}
        <div className="mx-auto mt-16 max-w-3xl">
          <h3 className="text-center text-lg font-semibold text-background">
            Everything included with Fotno Pro
          </h3>
          <ul
            role="list"
            className="mt-8 grid grid-cols-1 gap-x-12 gap-y-3 text-sm text-background/70 sm:grid-cols-2"
          >
            {FEATURES.map((feature) => (
              <li key={feature} className="flex">
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
          >
            Get started
          </Button>
        </div>
      </Container>
    </section>
  );
}
