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

function Plan({
  name,
  price,
  description,
  href,
  features,
  featured = false,
}: {
  name: string;
  price: string;
  description: string;
  href: string;
  features: Array<string>;
  featured?: boolean;
}) {
  return (
    <section
      className={cn(
        "flex flex-col rounded-3xl px-6 sm:px-8 transition-all duration-300",
        featured
          ? "order-first bg-primary py-8 lg:order-none shadow-xl shadow-primary/20 scale-[1.02]"
          : "bg-foreground lg:py-8 hover:-translate-y-1"
      )}
    >
      <h3 className="mt-5 text-lg font-semibold text-background">{name}</h3>
      <p
        className={cn(
          "mt-2 text-base",
          featured ? "text-primary-foreground/80" : "text-background/50"
        )}
      >
        {description}
      </p>
      <p className="order-first text-5xl font-light tracking-tight text-background">
        {price}
      </p>
      <ul
        role="list"
        className={cn(
          "order-last mt-10 flex flex-col gap-y-3 text-sm",
          featured ? "text-primary-foreground" : "text-background/70"
        )}
      >
        {features.map((feature) => (
          <li key={feature} className="flex">
            <CheckIcon className={featured ? "text-primary-foreground" : "text-background/50"} />
            <span className="ml-4">{feature}</span>
          </li>
        ))}
      </ul>
      <Button
        href={href}
        variant={featured ? "solid" : "outline"}
        color="white"
        className="mt-8"
        aria-label={`Get started with the ${name} plan for ${price}`}
      >
        Get started
      </Button>
    </section>
  );
}

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
            Simple pricing, for every photographer.
          </h2>
          <p className="mt-4 text-lg text-background/50">
            No hidden fees or surprise charges. Pick the plan that matches your
            workload and scale when you're ready.
          </p>
        </div>
        <div className="-mx-4 mt-16 grid max-w-2xl grid-cols-1 gap-y-10 sm:mx-auto lg:-mx-8 lg:max-w-none lg:grid-cols-3 xl:mx-0 xl:gap-x-8">
          <Plan
            name="Beginner"
            price="EGP 500"
            description="For solo shooters just getting started with client delivery."
            href={`${process.env.NEXT_PUBLIC_AUTH_URL}/account?plan=beginner`}
            features={[
              "Up to 5 galleries",
              "10 GB storage",
              "Password-protected galleries",
              "Client favorites",
              "Custom gallery slugs",
            ]}
          />
          <Plan
            featured
            name="Professional"
            price="EGP 1,100"
            description="For working photographers who deliver regularly."
            href={`${process.env.NEXT_PUBLIC_AUTH_URL}/account?plan=pro`}
            features={[
              "Unlimited galleries",
              "30 GB storage",
              "Everything in Beginner",
              "Bulk upload with auto-retry",
              "Priority processing",
              "Client management dashboard",
              "Download tracking",
            ]}
          />
          <Plan
            name="Studio"
            price="EGP 1,500"
            description="For studios and high-volume professionals."
            href={`${process.env.NEXT_PUBLIC_AUTH_URL}/account?plan=studio`}
            features={[
              "Unlimited galleries",
              "100 GB storage",
              "Everything in Professional",
              "Team member access",
              "Custom branding",
              "API access",
              "Priority support",
            ]}
          />
        </div>
      </Container>
    </section>
  );
}
