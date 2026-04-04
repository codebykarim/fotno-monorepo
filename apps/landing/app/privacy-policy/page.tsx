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
                  Last updated: April 4, 2026
                </p>
                <p className="text-base leading-relaxed text-muted-foreground">
                  This Privacy Policy explains how FOTNO (“we”, “us”, or “our”)
                  collects, uses, and shares information when you use our website,
                  services, and related features. This page is for general
                  information and is not legal advice.
                </p>
              </div>

              <LegalSection title="What information we collect">
                <p>
                  <span className="font-medium text-foreground">
                    Account and authentication data.
                  </span>{" "}
                  If you create an account, we process information such as your
                  email and password (and, if you choose, login via OAuth
                  providers like Google or GitHub).
                </p>

                <p>
                  <span className="font-medium text-foreground">
                    Photos, galleries, and related content you provide.
                  </span>{" "}
                  Photos you upload, together with gallery settings (for example,
                  passwords and download options) and your interactions such as
                  favorites and comments are stored and processed to operate your
                  galleries.
                </p>

                <p>
                  <span className="font-medium text-foreground">
                    AI captioning and search inputs/outputs.
                  </span>{" "}
                  When you enable AI features, we may send photo data (for example,
                  images retrieved from storage) to our captioning service to
                  generate captions and tags. We may also use an LLM to filter
                  photos based on a gallery description and your search query.
                </p>

                <p>
                  <span className="font-medium text-foreground">
                    Google Drive / Google Photos imports.
                  </span>{" "}
                  If you connect your Google account to import photos, we access
                  the selected photos/folders based on authorized scopes and
                  use stored tokens to refresh access when needed.
                </p>

                <p>
                  <span className="font-medium text-foreground">
                    Download and viewer activity.
                  </span>{" "}
                  For publicly shared galleries, we record download events so you
                  can understand engagement. Depending on the request, we may store
                  details such as the viewer IP address, viewer identifier, and viewer
                  name, along with the download type and associated photo/gallery.
                </p>

                <p>
                  <span className="font-medium text-foreground">
                    Cookies and device/location signals.
                  </span>{" "}
                  We set a cookie used for regional pricing (named{" "}
                  <span className="font-medium text-foreground">user_country</span>)
                  based on IP geolocation headers provided by your network/CDN.
                  Our authentication system also uses secure, HTTP-only cookies to
                  support sign-in across domains.
                </p>
              </LegalSection>

              <LegalSection title="How we use information">
                <p>
                  We use collected information to provide and improve the service,
                  including uploading and delivering photo galleries, enabling
                  password protection, allowing client favorites/comments, supporting
                  downloads, and maintaining your account.
                </p>
                <p>
                  We also use information to operate AI features (captions/tags and
                  AI-powered filtering), to prevent fraud and abuse, to manage billing
                  and subscriptions, and to track download activity for analytics.
                </p>
              </LegalSection>

              <LegalSection title="How we share information">
                <p>
                  <span className="font-medium text-foreground">
                    Storage and delivery infrastructure.
                  </span>{" "}
                  Photos and gallery assets are stored in cloud object storage and may
                  be served via signed URLs (for example, CloudFront signed URLs when
                  configured, or S3 presigned URLs otherwise).
                </p>
                <p>
                  <span className="font-medium text-foreground">
                    Payment processing.
                  </span>{" "}
                  Subscription billing is handled by Lemon Squeezy. We share necessary
                  billing and checkout details with Lemon Squeezy and process webhook
                  events to manage subscriptions.
                </p>
                <p>
                  <span className="font-medium text-foreground">
                    OAuth and import providers.
                  </span>{" "}
                  If you use Google Drive/Photos import, we share your authorized
                  access to Google and store access/refresh tokens as needed to perform
                  imports under the scopes you grant.
                </p>
                <p>
                  <span className="font-medium text-foreground">
                    AI services.
                  </span>{" "}
                  AI captioning and (where enabled) AI filtering rely on internal services
                  and may call external AI APIs depending on configuration.
                </p>
              </LegalSection>

              <LegalSection title="Cookies and tracking">
                <p>
                  We use the <span className="font-medium text-foreground">user_country</span>{" "}
                  cookie for regional pricing. For authentication, we use secure,
                  HTTP-only cookies with cross-subdomain settings to support signed-in
                  sessions.
                </p>
                <p>
                  If your browser supports it, you may control cookies through your
                  browser settings. However, disabling certain cookies may affect
                  sign-in or service functionality.
                </p>
              </LegalSection>

              <LegalSection title="Data protection">
                <p>
                  We implement technical and organizational measures to protect your
                  data, including data accessed through third-party integrations such
                  as Google Drive and Google Photos.
                </p>
                <p>
                  <span className="font-medium text-foreground">
                    Encryption in transit and at rest.
                  </span>{" "}
                  All data transfers, including imports from Google services, are
                  conducted over encrypted connections (TLS). Imported images are
                  stored encrypted at rest in our cloud storage infrastructure
                  (AWS S3 with server-side encryption).
                </p>
                <p>
                  <span className="font-medium text-foreground">
                    Token storage and handling.
                  </span>{" "}
                  Google OAuth access and refresh tokens are stored securely in our
                  database and are never exposed to the browser or shared with third
                  parties. Tokens are used only to perform the import operations you
                  explicitly initiate.
                </p>
                <p>
                  <span className="font-medium text-foreground">
                    Minimal data retention from imports.
                  </span>{" "}
                  When you import from Google Drive or Google Photos, only the image
                  files you explicitly select are copied to your gallery. We do not
                  retain Google API session data, media item IDs, folder structures,
                  or any metadata beyond the imported image files after the import
                  process completes.
                </p>
                <p>
                  <span className="font-medium text-foreground">
                    User control and disconnection.
                  </span>{" "}
                  You can disconnect Google services at any time from your dashboard.
                  Disconnecting revokes our access and removes stored tokens. You
                  may also revoke access through your{" "}
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

              <LegalSection title="Data retention and deletion">
                <p>
                  We retain information only for as long as necessary to provide the
                  service, comply with legal obligations, resolve disputes, and enforce
                  agreements.
                </p>
                <p>
                  When you delete photos or galleries, the underlying objects are removed
                  from storage as part of our cleanup processes. Download analytics and
                  other operational records may remain for administrative and safety
                  purposes to the extent permitted by applicable law.
                </p>
              </LegalSection>

              <LegalSection title="Your choices and rights">
                <p>
                  Depending on your location, you may have rights related to your personal
                  data (for example, access, correction, deletion, and objection).
                </p>
                <p>
                  To make a request, contact{" "}
                  <Link
                    href="mailto:support@fotno.com"
                    className="text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
                  >
                    support@fotno.com
                  </Link>
                  .
                </p>
              </LegalSection>

              <LegalSection title="International data transfers">
                <p>
                  If you access our service from outside the country where we operate,
                  your information may be transferred and processed in other jurisdictions.
                  Where required, we use appropriate safeguards.
                </p>
              </LegalSection>

              <LegalSection title="Contact us">
                <p>
                  Questions about this Privacy Policy can be sent to{" "}
                  <Link
                    href="mailto:support@fotno.com"
                    className="text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
                  >
                    support@fotno.com
                  </Link>
                  .
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  For jurisdiction-specific legal requirements (for example, the identity
                  of a controller, your supervisory authority, and applicable governing law),
                  replace placeholders with your final legal information.
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

