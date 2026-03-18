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

const TIERS = [
  { storage: "50 GB", price: "$5", popular: false },
  { storage: "100 GB", price: "$9", popular: false },
  { storage: "250 GB", price: "$19", popular: true },
  { storage: "500 GB", price: "$35", popular: false },
  { storage: "1 TB", price: "$59", popular: false },
  { storage: "2 TB", price: "$99", popular: false },
] as const;

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

const signupUrl = process.env.NEXT_PUBLIC_AUTH_URL;

export function Pricing() {
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
            Start with a 14-day free trial, no card required.
          </p>
        </div>

        {/* Storage tier grid */}
        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {TIERS.map((tier) => (
            <a
              key={tier.storage}
              href={`${signupUrl}/account`}
              className={cn(
                "relative flex flex-col items-center rounded-2xl px-4 py-6 text-center transition-all duration-300 hover:-translate-y-1",
                tier.popular
                  ? "bg-primary shadow-xl shadow-primary/20 scale-[1.04]"
                  : "bg-foreground border border-background/10 hover:border-background/20"
              )}
            >
              {tier.popular && (
                <span className="absolute -top-3 rounded-full bg-background px-3 py-0.5 text-xs font-semibold text-foreground">
                  Popular
                </span>
              )}
              <span
                className={cn(
                  "text-3xl font-light tracking-tight",
                  tier.popular ? "text-primary-foreground" : "text-background"
                )}
              >
                {tier.price}
              </span>
              <span
                className={cn(
                  "mt-1 text-sm",
                  tier.popular ? "text-primary-foreground/70" : "text-background/50"
                )}
              >
                /month
              </span>
              <span
                className={cn(
                  "mt-3 text-base font-semibold",
                  tier.popular ? "text-primary-foreground" : "text-background"
                )}
              >
                {tier.storage}
              </span>
            </a>
          ))}
        </div>

        {/* Trial badge */}
        <div className="mt-10 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-background/10 bg-foreground px-5 py-2 text-sm text-background/70">
            <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            14-day free trial — 5 GB storage, all features included
          </span>
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
            aria-label="Start your free trial"
          >
            Start free trial
          </Button>
        </div>
      </Container>
    </section>
  );
}
