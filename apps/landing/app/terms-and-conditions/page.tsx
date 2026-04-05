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
    "The terms and conditions for using FOTNO, including subscriptions, acceptable use, content liability, and refund policy.",
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
                  Last updated: April 5, 2026
                </p>
                <p className="text-base leading-relaxed text-muted-foreground">
                  These Terms and Conditions ("Terms") govern your use of FOTNO
                  ("we", "us", or "our") website and services. By creating an
                  account, accessing, or using the service, you confirm that you
                  have read, understood, and agree to be bound by these Terms,
                  our{" "}
                  <Link
                    href="/privacy-policy"
                    className="text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
                  >
                    Privacy Policy
                  </Link>
                  , and our{" "}
                  <Link
                    href="/refund-policy"
                    className="text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
                  >
                    Refund Policy
                  </Link>
                  . If you do not agree to these Terms, you must not use the
                  service.
                </p>
              </div>

              <LegalSection title="1. Our service">
                <p>
                  FOTNO is a photo gallery delivery platform. The service allows
                  you to upload photos, create password-protected client
                  galleries, enable client favorites and comments, deliver
                  photos to clients, use AI-powered captioning and search
                  features, import photos from Google Drive or Google Photos,
                  and track download events for your galleries.
                </p>
                <p>
                  FOTNO acts solely as a neutral hosting and delivery tool. We
                  provide the infrastructure for you to store, organize, and
                  share your photos. We do not create, curate, edit, review, or
                  endorse any content uploaded to the platform.
                </p>
              </LegalSection>

              <LegalSection title="2. Account eligibility and security">
                <p>
                  You must be at least 16 years of age to create an account.
                  You are responsible for maintaining the confidentiality of any
                  credentials you use to access the service. You are responsible
                  for all activity that occurs under your account, whether or
                  not you authorized it.
                </p>
                <p>
                  If you use OAuth providers (such as Google), you authorize us
                  to use the access you grant to perform the requested imports
                  and authentication.
                </p>
                <p>
                  You must provide accurate and complete information when
                  creating your account and keep it up to date.
                </p>
              </LegalSection>

              <LegalSection title="3. User content, ownership, and responsibility">
                <p>
                  <span className="font-medium text-foreground">
                    You retain full ownership of your content.
                  </span>{" "}
                  FOTNO does not claim any ownership over the photos, images,
                  text, or other materials you upload to the service.
                </p>
                <p>
                  <span className="font-medium text-foreground">
                    License to FOTNO.
                  </span>{" "}
                  By uploading or importing content, you grant FOTNO a limited,
                  non-exclusive, royalty-free license to host, store, process,
                  and deliver that content through the service (including
                  generating previews, thumbnails, and enabling access for your
                  clients). This license exists solely to operate the service
                  and terminates when you delete the content or your account.
                </p>
                <p>
                  <span className="font-medium text-foreground">
                    Your representations and warranties.
                  </span>{" "}
                  You represent and warrant that: (a) you own or have obtained
                  all necessary rights, licenses, consents, and permissions to
                  upload and share all content you provide through the service;
                  (b) your content does not infringe, misappropriate, or violate
                  any third party's intellectual property rights, privacy rights,
                  publicity rights, or any other legal rights; (c) you have
                  obtained any required model releases, property releases, or
                  other consents for all identifiable individuals and properties
                  depicted in your content; and (d) your use of the service
                  complies with all applicable laws and regulations.
                </p>
                <p>
                  <span className="font-medium text-foreground">
                    FOTNO is a neutral platform.
                  </span>{" "}
                  FOTNO does not review, screen, verify, approve, or monitor
                  user content. We have no obligation to do so. We are not
                  responsible for the accuracy, legality, quality, or
                  appropriateness of any content uploaded by users. The
                  uploading user bears sole and exclusive responsibility for
                  all content they submit to the service and any consequences
                  arising from that content.
                </p>
                <p>
                  <span className="font-medium text-foreground">
                    Content removal.
                  </span>{" "}
                  FOTNO reserves the right, but has no obligation, to remove,
                  disable access to, or modify any content that we believe, in
                  our sole discretion, violates these Terms, applicable law, or
                  third-party rights. We may do so without prior notice.
                </p>
              </LegalSection>

              <LegalSection title="4. Content liability and takedown process">
                <p>
                  FOTNO is not liable for any claims, damages, or losses arising
                  from user-uploaded content, including but not limited to claims
                  of copyright infringement, trademark infringement, defamation,
                  invasion of privacy, or violation of publicity rights.
                </p>
                <p>
                  <span className="font-medium text-foreground">
                    If you believe your rights are being infringed.
                  </span>{" "}
                  If you believe that content hosted on FOTNO infringes your
                  intellectual property rights or other legal rights, you may
                  submit a takedown notice to{" "}
                  <Link
                    href="mailto:support@fotno.com"
                    className="text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
                  >
                    support@fotno.com
                  </Link>{" "}
                  including: (a) identification of the copyrighted work or right
                  claimed to be infringed; (b) identification of the infringing
                  material and its location on the service; (c) your contact
                  information; (d) a statement that you have a good-faith belief
                  the use is not authorized; and (e) a statement, under penalty
                  of perjury, that the information in your notice is accurate
                  and that you are the rights holder or authorized to act on
                  their behalf.
                </p>
                <p>
                  Upon receipt of a valid takedown notice, FOTNO will
                  expeditiously remove or disable access to the identified
                  content and notify the uploading user. Repeat infringers may
                  have their accounts terminated.
                </p>
              </LegalSection>

              <LegalSection title="5. Acceptable use">
                <p>
                  You agree not to misuse the service or access it in a way that
                  violates applicable law or these Terms. Without limitation,
                  you agree not to:
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    Upload content you do not have the right to share, including
                    copyrighted material, licensed images, or content subject to
                    third-party restrictions
                  </li>
                  <li>
                    Upload illegal, harmful, threatening, abusive, defamatory,
                    obscene, or otherwise objectionable content
                  </li>
                  <li>
                    Attempt to bypass access controls, authentication mechanisms,
                    or security features
                  </li>
                  <li>
                    Interfere with or disrupt the operation of the service or
                    its infrastructure
                  </li>
                  <li>
                    Use the service to distribute malware, spam, or unsolicited
                    communications
                  </li>
                  <li>
                    Scrape, crawl, or use automated tools to extract data from
                    the service without our written permission
                  </li>
                  <li>
                    Resell, sublicense, or commercially exploit the service
                    without our authorization
                  </li>
                </ul>
              </LegalSection>

              <LegalSection title="6. AI features and disclaimers">
                <p>
                  FOTNO may generate AI captions and tags, and may use AI to
                  help filter or select photos based on a gallery description
                  and your search query. These features may call internal
                  services or external AI APIs.
                </p>
                <p>
                  AI outputs are provided for convenience and may be inaccurate,
                  incomplete, or inappropriate. You remain solely responsible
                  for reviewing and using AI-generated captions, tags, and
                  selections. FOTNO makes no warranty regarding the accuracy or
                  fitness of AI outputs.
                </p>
              </LegalSection>

              <LegalSection title="7. Subscriptions and payments">
                <p>
                  FOTNO offers subscription plans. Payment processing is handled
                  by Stripe. By subscribing to a paid plan, you authorize Stripe
                  to charge your payment method on a recurring basis.
                </p>
                <p>
                  <span className="font-medium text-foreground">
                    All payments are final and non-refundable.
                  </span>{" "}
                  Please see our{" "}
                  <Link
                    href="/refund-policy"
                    className="text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
                  >
                    Refund Policy
                  </Link>{" "}
                  for complete details.
                </p>
                <p>
                  You may cancel your subscription at any time from your
                  dashboard. Cancellation takes effect at the end of your
                  current billing period. You will retain access to paid
                  features until the end of the period you have already paid
                  for. No prorated refunds are given for unused time.
                </p>
                <p>
                  If you downgrade your plan, the new rate applies at the start
                  of your next billing cycle. No refund is provided for the
                  current period.
                </p>
                <p>
                  We reserve the right to change pricing at any time. If we
                  change the price of your current plan, we will notify you in
                  advance. Your continued use after the price change constitutes
                  acceptance of the new price.
                </p>
              </LegalSection>

              <LegalSection title="8. Smart Albums and Stripe Connect">
                <p>
                  FOTNO offers a Smart Album feature that allows photographers
                  to sell print-on-demand photo books to their clients. Payments
                  for Smart Albums are processed through Stripe Connect.
                </p>
                <p>
                  FOTNO acts solely as a technology facilitator for Smart Album
                  transactions. The commercial relationship for Smart Album
                  purchases is between the photographer and their client. FOTNO
                  is not a party to that transaction and bears no liability for
                  disputes between photographers and their clients regarding
                  Smart Album orders, quality, delivery, or satisfaction.
                </p>
                <p>
                  Smart Album payments are non-refundable through FOTNO. Any
                  refund disputes must be resolved directly between the
                  photographer and their client.
                </p>
              </LegalSection>

              <LegalSection title="9. Downloading and sharing">
                <p>
                  Shared galleries may include download controls and limits. To
                  administer these controls, we record download events. Download
                  event records may include a viewer IP address and viewer
                  identifiers/names when provided.
                </p>
                <p>
                  Client favorites can be shared using share tokens and
                  associated share links. You are responsible for managing access
                  to your galleries and share links.
                </p>
              </LegalSection>

              <LegalSection title="10. Indemnification">
                <p>
                  You agree to indemnify, defend, and hold harmless FOTNO, its
                  owners, officers, directors, employees, agents, and affiliates
                  from and against any and all claims, demands, damages, losses,
                  liabilities, costs, and expenses (including reasonable
                  attorneys' fees) arising out of or relating to: (a) your use
                  of the service; (b) content you upload, store, or share
                  through the service; (c) your violation of these Terms; (d)
                  your violation of any third party's rights, including
                  intellectual property rights, privacy rights, or publicity
                  rights; or (e) any dispute between you and your clients or any
                  third party.
                </p>
                <p>
                  This indemnification obligation survives termination of your
                  account and these Terms.
                </p>
              </LegalSection>

              <LegalSection title="11. Termination">
                <p>
                  We may suspend or terminate your access to the service
                  immediately and without prior notice if you violate these
                  Terms, if required by law, or for security considerations.
                  You remain responsible for any amounts due up to the time of
                  termination.
                </p>
                <p>
                  Upon termination, your right to use the service ceases
                  immediately. We may delete your account data, photos, and
                  galleries after a reasonable retention period. Termination does
                  not entitle you to any refund.
                </p>
              </LegalSection>

              <LegalSection title="12. Disclaimers">
                <p>
                  THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE." TO THE
                  MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES,
                  EXPRESS OR IMPLIED, INCLUDING IMPLIED WARRANTIES OF
                  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
                  NON-INFRINGEMENT.
                </p>
                <p>
                  WITHOUT LIMITING THE FOREGOING, FOTNO DOES NOT WARRANT THAT:
                  (A) THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE;
                  (B) ANY CONTENT UPLOADED BY USERS IS ACCURATE, LEGAL, OR
                  NON-INFRINGING; (C) AI-GENERATED OUTPUTS WILL BE ACCURATE OR
                  SUITABLE FOR ANY PURPOSE; OR (D) THE SERVICE WILL MEET YOUR
                  SPECIFIC REQUIREMENTS.
                </p>
                <p>
                  FOTNO DOES NOT ENDORSE, VERIFY, OR GUARANTEE ANY USER CONTENT
                  AND ACTS SOLELY AS A NEUTRAL HOSTING AND DELIVERY TOOL. YOU
                  USE THE SERVICE AND RELY ON ANY CONTENT AT YOUR OWN RISK.
                </p>
              </LegalSection>

              <LegalSection title="13. Limitation of liability">
                <p>
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT WILL FOTNO
                  OR ITS OWNERS, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, OR
                  AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
                  CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS,
                  REVENUE, DATA, OR GOODWILL, ARISING OUT OF OR RELATING TO YOUR
                  USE OF THE SERVICE, REGARDLESS OF THE THEORY OF LIABILITY.
                </p>
                <p>
                  OUR TOTAL AGGREGATE LIABILITY FOR ALL CLAIMS ARISING OUT OF OR
                  RELATING TO THESE TERMS OR THE SERVICE SHALL NOT EXCEED THE
                  AMOUNT YOU PAID TO FOTNO IN THE TWELVE (12) MONTHS PRECEDING
                  THE CLAIM.
                </p>
              </LegalSection>

              <LegalSection title="14. Governing law and disputes">
                <p>
                  These Terms are governed by the laws of the jurisdiction in
                  which FOTNO operates, without regard to conflict of law
                  principles. Any disputes arising under or in connection with
                  these Terms shall be resolved exclusively in the courts of
                  that jurisdiction.
                </p>
                <p>
                  You agree to attempt to resolve any dispute informally by
                  contacting{" "}
                  <Link
                    href="mailto:support@fotno.com"
                    className="text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
                  >
                    support@fotno.com
                  </Link>{" "}
                  before initiating any formal proceedings.
                </p>
              </LegalSection>

              <LegalSection title="15. Changes to these Terms">
                <p>
                  We may update these Terms from time to time. If we make
                  material changes, we will notify you by email or by posting a
                  notice on the service. Your continued use of FOTNO after any
                  changes constitutes your acceptance of the updated Terms.
                </p>
              </LegalSection>

              <LegalSection title="16. Contact us">
                <p>
                  For questions about these Terms, contact{" "}
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
