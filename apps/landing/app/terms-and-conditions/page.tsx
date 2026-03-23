import type { Metadata } from "next";
import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Container } from "@/components/Container";

const SITE_URL = process.env.NEXT_PUBLIC_LANDING_URL ?? "https://fotno.com";

const TermsTitle = "Terms and Conditions";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${TermsTitle} | FOTNO`,
  description:
    "The terms and conditions for using FOTNO, including subscriptions, acceptable use, and AI features.",
  alternates: { canonical: `${SITE_URL}/terms-and-conditions` },
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

export default function TermsAndConditionsPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-background py-20 sm:py-24">
          <Container>
            <article className="mx-auto max-w-3xl">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {TermsTitle}
                </h1>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Last updated: March 23, 2026
                </p>
                <p className="text-base leading-relaxed text-muted-foreground">
                  These Terms and Conditions (“Terms”) govern your use of FOTNO
                  (“we”, “us”, or “our”) website and services. By accessing or
                  using the service, you agree to these Terms. This page is for
                  general information and is not legal advice.
                </p>
              </div>

              <LegalSection title="1. Our service">
                <p>
                  FOTNO is a photo gallery delivery platform. Using the service,
                  you may upload photos, create password-protected client
                  galleries, enable client favorites and comments, deliver
                  photos to clients, and use AI-powered captioning and search
                  features.
                </p>
                <p>
                  Some features may include importing photos from Google Drive or
                  Google Photos, as well as tracking download events for your
                  galleries.
                </p>
              </LegalSection>

              <LegalSection title="2. Account eligibility and security">
                <p>
                  You are responsible for maintaining the confidentiality of any
                  credentials you use to access the service. If you use OAuth
                  providers (for example, Google or GitHub), you authorize us to
                  use the access you grant to perform the requested imports.
                </p>
                <p>
                  You must provide accurate and complete information when
                  required.
                </p>
              </LegalSection>

              <LegalSection title="3. User content and licenses">
                <p>
                  You retain ownership of your photos and other content you submit
                  to the service. By uploading or importing content, you grant us
                  the rights needed to host, process, and deliver that content
                  through the service (including generating previews/thumbnails
                  and enabling access for your clients).
                </p>
              </LegalSection>

              <LegalSection title="4. Acceptable use">
                <p>
                  You agree not to misuse the service or access it in a way that
                  violates applicable law or these Terms. For example, you
                  should not attempt to bypass access controls or interfere with
                  the operation of the service.
                </p>
                <p>
                  You also agree that the content you upload (and any captions or
                  descriptions you provide) is appropriate for sharing with your
                  clients.
                </p>
              </LegalSection>

              <LegalSection title="5. AI features and disclaimers">
                <p>
                  FOTNO may generate AI captions and tags, and may also use AI to
                  help filter or select photos based on a gallery description
                  and your search query. These features may call internal caption
                  services and may optionally use an LLM depending on your use
                  case and configuration.
                </p>
                <p>
                  AI outputs are provided for convenience and may be inaccurate
                  or incomplete. You remain responsible for reviewing and using
                  AI-generated captions, tags, and selections.
                </p>
              </LegalSection>

              <LegalSection title="6. Subscriptions and payments">
                <p>
                  FOTNO offers subscription plans. Checkout and subscription
                  management are handled by Lemon Squeezy.
                </p>
                <p>
                  By purchasing a subscription, you authorize us to process
                  necessary subscription information and to handle webhook events
                  required to maintain or cancel subscriptions.
                </p>
                <p>
                  Refunds, cancellations, and renewal terms are determined by the
                  policies of the payment provider and the applicable plan
                  terms.
                </p>
              </LegalSection>

              <LegalSection title="7. Downloading and sharing">
                <p>
                  Publicly shared galleries may include download controls and
                  may be associated with download limit settings. To administer
                  these controls, we may record download events. Depending on
                  the request, download event records may include a viewer IP
                  address and viewer identifiers/names when provided.
                </p>
                <p>
                  Client favorites can be shared using share tokens and
                  associated share links for viewing favorites.
                </p>
              </LegalSection>

              <LegalSection title="8. Termination">
                <p>
                  We may suspend or terminate access to the service if you violate
                  these Terms or if required by law or security considerations.
                  You remain responsible for any amounts due up to the time of
                  termination.
                </p>
              </LegalSection>

              <LegalSection title="9. Disclaimers">
                <p>
                  THE SERVICE IS PROVIDED “AS IS” AND “AS AVAILABLE.” TO THE
                  MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES,
                  EXPRESS OR IMPLIED, INCLUDING IMPLIED WARRANTIES OF
                  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                </p>
              </LegalSection>

              <LegalSection title="10. Limitation of liability">
                <p>
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT WILL FOTNO
                  OR OUR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
                  CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS,
                  REVENUE, DATA, OR GOODWILL, ARISING OUT OF OR RELATING TO YOUR USE
                  OF THE SERVICE.
                </p>
              </LegalSection>

              <LegalSection title="11. Contact and governing law">
                <p>
                  These Terms are governed by the laws of a jurisdiction selected by
                  the company. Replace this placeholder with your final governing law
                  clause and controller/contact details where required.
                </p>
                <p>
                  For questions, contact{" "}
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

