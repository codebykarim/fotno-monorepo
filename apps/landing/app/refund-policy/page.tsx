import type { Metadata } from "next";
import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Container } from "@/components/Container";

const SITE_URL = process.env.NEXT_PUBLIC_LANDING_URL ?? "https://fotno.com";

const RefundPolicyTitle = "Refund Policy";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${RefundPolicyTitle} | FOTNO`,
  description:
    "FOTNO's refund policy for subscriptions, payments, and Smart Album transactions.",
  alternates: { canonical: `${SITE_URL}/refund-policy` },
};

function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

export default function RefundPolicyPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-background py-20 sm:py-24">
          <Container>
            <article className="mx-auto max-w-3xl">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {RefundPolicyTitle}
                </h1>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Last updated: April 5, 2026
                </p>
                <p className="text-base leading-relaxed text-muted-foreground">
                  This Refund Policy applies to all payments made through FOTNO
                  ("we", "us", or "our"), including subscriptions and Smart Album
                  transactions. By using FOTNO and making a payment, you
                  acknowledge and agree to this policy. This policy is part of
                  our{" "}
                  <Link
                    href="/terms-and-conditions"
                    className="text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
                  >
                    Terms and Conditions
                  </Link>
                  .
                </p>
              </div>

              <LegalSection title="1. All sales are final">
                <p>
                  <span className="font-medium text-foreground">
                    All payments made to FOTNO are final and non-refundable.
                  </span>{" "}
                  Once a payment has been processed, it will not be reversed,
                  credited, or refunded, regardless of whether you continue to
                  use the service, how much of the service you have used, or
                  when during the billing period you decide to cancel.
                </p>
                <p>
                  By subscribing to a paid plan or making any payment, you
                  expressly acknowledge and agree that all charges are
                  non-refundable.
                </p>
              </LegalSection>

              <LegalSection title="2. Subscription cancellation">
                <p>
                  You may cancel your subscription at any time from your FOTNO
                  dashboard. Upon cancellation:
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    Your subscription remains active until the end of your
                    current billing period
                  </li>
                  <li>
                    You will retain access to all paid features until the end of
                    that period
                  </li>
                  <li>
                    No prorated refunds are given for any unused portion of the
                    billing period
                  </li>
                  <li>
                    After the billing period ends, your account will revert to
                    the free tier
                  </li>
                </ul>
              </LegalSection>

              <LegalSection title="3. Plan downgrades">
                <p>
                  If you downgrade from a higher-tier plan to a lower-tier plan,
                  the new rate takes effect at the start of your next billing
                  cycle. No refund or credit is provided for the difference
                  between the plans during the current billing period.
                </p>
              </LegalSection>

              <LegalSection title="4. Smart Album transactions">
                <p>
                  Payments made by clients for Smart Album (print-on-demand)
                  orders are processed through Stripe Connect. These payments
                  are non-refundable through FOTNO.
                </p>
                <p>
                  FOTNO facilitates the transaction technology but is not a party
                  to the commercial agreement between photographers and their
                  clients. Any disputes regarding Smart Album orders, quality,
                  delivery, or satisfaction must be resolved directly between
                  the photographer and their client.
                </p>
              </LegalSection>

              <LegalSection title="5. Limited exceptions">
                <p>
                  FOTNO may, at its sole and absolute discretion, consider a
                  refund in cases where a verified, platform-caused technical
                  issue prevented you from using the service entirely (not
                  partially). To request an exception:
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    Contact{" "}
                    <Link
                      href="mailto:support@fotno.com"
                      className="text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
                    >
                      support@fotno.com
                    </Link>{" "}
                    within 7 days of the payment
                  </li>
                  <li>
                    Provide a clear description of the technical issue you
                    experienced
                  </li>
                  <li>
                    Include your account email and any relevant details
                  </li>
                </ul>
                <p>
                  Granting an exception in one case does not create a precedent,
                  obligation, or right to a refund in any other case. Each
                  request is evaluated independently and the decision is final.
                </p>
              </LegalSection>

              <LegalSection title="6. Chargebacks and disputes">
                <p>
                  If you dispute a valid charge with your bank or credit card
                  company (a "chargeback"), FOTNO reserves the right to
                  immediately suspend or terminate your account and pursue
                  recovery of the disputed amount. Chargebacks initiated on
                  valid charges may result in permanent account suspension.
                </p>
                <p>
                  We encourage you to contact{" "}
                  <Link
                    href="mailto:support@fotno.com"
                    className="text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
                  >
                    support@fotno.com
                  </Link>{" "}
                  before initiating a chargeback so we can attempt to resolve
                  the issue directly.
                </p>
              </LegalSection>

              <LegalSection title="7. Contact us">
                <p>
                  If you have questions about this Refund Policy, please contact{" "}
                  <Link
                    href="mailto:support@fotno.com"
                    className="text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
                  >
                    support@fotno.com
                  </Link>
                  .
                </p>
              </LegalSection>
            </article>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
