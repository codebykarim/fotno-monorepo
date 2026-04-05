import type { Metadata } from "next";
import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Container } from "@/components/Container";

const SITE_URL = process.env.NEXT_PUBLIC_LANDING_URL ?? "https://fotno.com";

const PrivacyPolicyTitle = "Privacy Policy";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${PrivacyPolicyTitle} | FOTNO`,
  description:
    "How FOTNO collects, uses, and shares information when you use our photo gallery delivery platform.",
  alternates: { canonical: `${SITE_URL}/privacy-policy` },
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

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-background py-20 sm:py-24">
          <Container>
            <article className="mx-auto max-w-3xl">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {PrivacyPolicyTitle}
                </h1>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Last updated: April 5, 2026
                </p>
                <p className="text-base leading-relaxed text-muted-foreground">
                  This Privacy Policy explains how FOTNO ("we", "us", or "our")
                  collects, uses, and shares information when you use our website,
                  services, and related features. By using FOTNO, you also agree
                  to our{" "}
                  <Link
                    href="/terms-and-conditions"
                    className="text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
                  >
                    Terms and Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/refund-policy"
                    className="text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
                  >
                    Refund Policy
                  </Link>
                  .
                </p>
              </div>

              <LegalSection title="1. What information we collect">
                <p>
                  <span className="font-medium text-foreground">
                    Account and authentication data.
                  </span>{" "}
                  When you create an account, we collect your name, email address,
                  and password. If you sign in via an OAuth provider (such as
                  Google), we receive your profile information from that provider.
                  We also store session data including your IP address and user
                  agent string.
                </p>

                <p>
                  <span className="font-medium text-foreground">
                    Photos, galleries, and related content.
                  </span>{" "}
                  Photos you upload, together with gallery settings (titles,
                  passwords, download options, expiration dates), and interactions
                  such as client favorites and comments are stored and processed
                  to operate your galleries. We store metadata including original
                  filenames, file sizes, dimensions, MIME types, and checksums.
                </p>

                <p>
                  <span className="font-medium text-foreground">
                    AI captioning and search inputs/outputs.
                  </span>{" "}
                  When you enable AI features, we may send photo data to our
                  captioning service to generate captions and tags. We may also
                  use an LLM to filter photos based on a gallery description and
                  your search query.
                </p>

                <p>
                  <span className="font-medium text-foreground">
                    Google Drive / Google Photos imports.
                  </span>{" "}
                  If you connect your Google account to import photos, we access
                  the selected photos/folders based on authorized scopes and
                  use stored access and refresh tokens to complete imports.
                </p>

                <p>
                  <span className="font-medium text-foreground">
                    Download and viewer activity.
                  </span>{" "}
                  For shared galleries, we record download events including
                  viewer IP address, viewer name or identifier, download type,
                  and associated photo/gallery information so you can understand
                  engagement with your galleries.
                </p>

                <p>
                  <span className="font-medium text-foreground">
                    Push notification tokens.
                  </span>{" "}
                  If you enable browser push notifications, we store Firebase
                  Cloud Messaging (FCM) device tokens to deliver notifications
                  about gallery activity, storage warnings, and billing events.
                </p>

                <p>
                  <span className="font-medium text-foreground">
                    Payment and billing data.
                  </span>{" "}
                  When you subscribe to a paid plan, we store your Stripe customer
                  ID, subscription status, and billing period information. We do
                  not store your full credit card number; payment details are
                  handled directly by Stripe.
                </p>

                <p>
                  <span className="font-medium text-foreground">
                    Onboarding and profile data.
                  </span>{" "}
                  During onboarding, we may collect your business type (solo or
                  company), company name, photography type, experience level, and
                  preferred contact method.
                </p>

                <p>
                  <span className="font-medium text-foreground">
                    Cookies and device/location signals.
                  </span>{" "}
                  We set a cookie named{" "}
                  <span className="font-medium text-foreground">user_country</span>{" "}
                  based on IP geolocation for regional pricing. Our authentication
                  system uses secure, HTTP-only cookies to support sign-in across
                  FOTNO subdomains.
                </p>
              </LegalSection>

              <LegalSection title="2. How we use information">
                <p>We use collected information to:</p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    Provide and operate the service, including uploading,
                    processing, and delivering photo galleries
                  </li>
                  <li>
                    Enable gallery features such as password protection, client
                    favorites, comments, and download controls
                  </li>
                  <li>
                    Generate AI captions, tags, and AI-powered photo filtering
                  </li>
                  <li>
                    Process payments and manage subscriptions through Stripe
                  </li>
                  <li>
                    Send transactional emails (storage warnings, billing
                    notifications, gallery activity alerts)
                  </li>
                  <li>
                    Deliver push notifications when enabled by you
                  </li>
                  <li>
                    Monitor and fix errors in the service using error tracking
                    tools
                  </li>
                  <li>
                    Understand usage patterns through anonymized analytics to
                    improve the service
                  </li>
                  <li>
                    Prevent fraud, abuse, and unauthorized access
                  </li>
                </ul>
              </LegalSection>

              <LegalSection title="3. How we share information">
                <p>
                  We share information only with the third-party services
                  necessary to operate FOTNO. We list each category below.
                </p>

                <p>
                  <span className="font-medium text-foreground">
                    Payment processing (Stripe).
                  </span>{" "}
                  Subscription billing and Smart Album transactions are handled
                  by Stripe. We share necessary billing details with Stripe to
                  process payments and manage subscriptions.
                </p>

                <p>
                  <span className="font-medium text-foreground">
                    Cloud storage (AWS S3).
                  </span>{" "}
                  Photos and gallery assets are stored in Amazon S3 with
                  server-side encryption at rest.
                </p>

                <p>
                  <span className="font-medium text-foreground">
                    Content delivery (Amazon CloudFront).
                  </span>{" "}
                  Photos are served to clients via CloudFront using signed URLs
                  for secure, fast delivery.
                </p>

                <p>
                  <span className="font-medium text-foreground">
                    Authentication and imports (Google).
                  </span>{" "}
                  If you use Google sign-in or Google Drive/Photos import, we
                  exchange data with Google APIs under the scopes you authorize.
                  Access and refresh tokens are stored securely and never exposed
                  to the browser.
                </p>

                <p>
                  <span className="font-medium text-foreground">
                    Email delivery (Plunk).
                  </span>{" "}
                  Transactional emails (password resets, storage warnings, billing
                  notifications) are sent through our self-hosted Plunk instance.
                  Your email address is shared with this service to deliver
                  messages.
                </p>

                <p>
                  <span className="font-medium text-foreground">
                    Push notifications (Firebase Cloud Messaging).
                  </span>{" "}
                  If you enable push notifications, device tokens are processed
                  by Google Firebase to deliver notifications.
                </p>

                <p>
                  <span className="font-medium text-foreground">
                    Error tracking (Sentry).
                  </span>{" "}
                  We use Sentry to detect and diagnose errors. Sentry may receive
                  technical data such as request URLs, browser information, and
                  stack traces. It does not receive your photos or personal
                  content.
                </p>

                <p>
                  <span className="font-medium text-foreground">
                    Analytics (Rybbit).
                  </span>{" "}
                  We use Rybbit for privacy-friendly, anonymized usage analytics
                  to understand how the service is used and to improve it.
                </p>

                <p>
                  <span className="font-medium text-foreground">
                    Custom domains (Cloudflare).
                  </span>{" "}
                  If you set up a custom domain for your galleries, domain
                  verification and routing is handled through Cloudflare.
                </p>

                <p>
                  <span className="font-medium text-foreground">
                    AI services.
                  </span>{" "}
                  AI captioning and filtering may use internal services or
                  external AI APIs depending on configuration. Photo data sent
                  to these services is used solely to generate captions and tags.
                </p>
              </LegalSection>

              <LegalSection title="4. We do not sell your data">
                <p>
                  <span className="font-medium text-foreground">
                    FOTNO does not sell, rent, lease, or trade your personal
                    information or your photos to any third party for any purpose.
                  </span>{" "}
                  We do not share your data with advertisers, data brokers, or
                  any other third parties for their marketing or commercial
                  purposes.
                </p>
                <p>
                  Your data is shared only with the service providers listed
                  above, solely to the extent necessary to operate and deliver
                  the FOTNO platform to you.
                </p>
              </LegalSection>

              <LegalSection title="5. Cookies and tracking">
                <p>
                  We use the{" "}
                  <span className="font-medium text-foreground">user_country</span>{" "}
                  cookie for regional pricing. For authentication, we use secure,
                  HTTP-only cookies with cross-subdomain settings to support
                  signed-in sessions across FOTNO services.
                </p>
                <p>
                  We do not use third-party advertising cookies or cross-site
                  tracking pixels. If your browser supports it, you may control
                  cookies through your browser settings. However, disabling
                  certain cookies may affect sign-in or service functionality.
                </p>
              </LegalSection>

              <LegalSection title="6. Data protection">
                <p>
                  We implement technical and organizational measures to protect
                  your data, including data accessed through third-party
                  integrations such as Google Drive and Google Photos.
                </p>
                <p>
                  <span className="font-medium text-foreground">
                    Encryption in transit and at rest.
                  </span>{" "}
                  All data transfers are conducted over encrypted connections
                  (TLS). Photos are stored encrypted at rest in AWS S3 with
                  server-side encryption. Database connections are encrypted.
                </p>
                <p>
                  <span className="font-medium text-foreground">
                    Token storage and handling.
                  </span>{" "}
                  Google OAuth access and refresh tokens are stored securely in
                  our database and are never exposed to the browser or shared
                  with third parties. Tokens are used only to perform the import
                  operations you explicitly initiate.
                </p>
                <p>
                  <span className="font-medium text-foreground">
                    Minimal data retention from imports.
                  </span>{" "}
                  When you import from Google Drive or Google Photos, only the
                  image files you explicitly select are copied to your gallery.
                  We do not retain Google API session data, media item IDs,
                  folder structures, or any metadata beyond the imported image
                  files after the import process completes.
                </p>
                <p>
                  <span className="font-medium text-foreground">
                    User control and disconnection.
                  </span>{" "}
                  You can disconnect Google services at any time from your
                  dashboard. Disconnecting revokes our access and removes stored
                  tokens. You may also revoke access through your{" "}
                  <a
                    href="https://myaccount.google.com/permissions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
                  >
                    Google Account permissions
                  </a>
                  .
                </p>
              </LegalSection>

              <LegalSection title="7. Data retention and deletion">
                <p>
                  We retain information only for as long as necessary to provide
                  the service, comply with legal obligations, resolve disputes,
                  and enforce agreements.
                </p>
                <p>
                  When you delete photos or galleries, the underlying objects are
                  removed from storage as part of our cleanup processes. When you
                  delete your account, we remove your personal data, photos, and
                  galleries. Download analytics and other operational records may
                  be retained for administrative and safety purposes to the extent
                  permitted by applicable law.
                </p>
              </LegalSection>

              <LegalSection title="8. Your choices and rights">
                <p>
                  Depending on your location, you may have rights related to your
                  personal data, including the right to access, correct, delete,
                  or object to the processing of your information.
                </p>
                <p>
                  You may exercise these rights at any time by contacting{" "}
                  <Link
                    href="mailto:support@fotno.com"
                    className="text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
                  >
                    support@fotno.com
                  </Link>
                  . We will respond to your request within a reasonable timeframe
                  and in accordance with applicable law.
                </p>
              </LegalSection>

              <LegalSection title="9. Children's privacy">
                <p>
                  FOTNO is not directed at children under the age of 16. We do
                  not knowingly collect personal information from children. If
                  you believe a child has provided us with personal data, please
                  contact us at{" "}
                  <Link
                    href="mailto:support@fotno.com"
                    className="text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
                  >
                    support@fotno.com
                  </Link>{" "}
                  and we will delete it.
                </p>
              </LegalSection>

              <LegalSection title="10. International data transfers">
                <p>
                  Your information may be transferred to and processed in
                  countries other than your country of residence. These countries
                  may have different data protection laws. By using FOTNO, you
                  consent to the transfer of your information to these countries.
                  Where required by applicable law, we use appropriate safeguards
                  for such transfers.
                </p>
              </LegalSection>

              <LegalSection title="11. Changes to this policy">
                <p>
                  We may update this Privacy Policy from time to time. If we make
                  material changes, we will notify you by email or by posting a
                  notice on the service. Your continued use of FOTNO after any
                  changes constitutes your acceptance of the updated policy.
                </p>
              </LegalSection>

              <LegalSection title="12. Contact us">
                <p>
                  Questions or concerns about this Privacy Policy can be sent to{" "}
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
