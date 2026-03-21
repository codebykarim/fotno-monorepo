import { CallToAction } from "@/components/CallToAction";
import { Faqs } from "@/components/Faqs";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Pricing } from "@/components/Pricing";
import { PrimaryFeatures } from "@/components/PrimaryFeatures";
import { Testimonials } from "@/components/Testimonials";
import Script from "next/script";

const SITE_URL = process.env.NEXT_PUBLIC_LANDING_URL ?? "https://fotno.com";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "FOTNO",
      alternateName: ["Photno", "Photnoo", "Fotno Gallery", "FOTNO Photo Gallery"],
      description:
        "The modern photo gallery delivery platform for professional photographers. Create stunning password-protected client galleries with online proofing and AI-powered captions.",
      publisher: { "@id": `${SITE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "FOTNO",
      alternateName: ["Photno", "Photnoo"],
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
      contactPoint: {
        "@type": "ContactPoint",
        email: "support@fotno.com",
        contactType: "customer support",
      },
      sameAs: [
        "https://photno.com",
        "https://photnoo.com",
      ],
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#app`,
      name: "FOTNO",
      alternateName: ["Photno", "Photnoo"],
      applicationCategory: "PhotographyApplication",
      operatingSystem: "Web",
      url: SITE_URL,
      description:
        "Professional photo gallery delivery platform. Upload, organize, and deliver stunning password-protected galleries to clients. Features include online proofing, client favorites, bulk uploads, AI-powered captions, Google Drive import, and custom delivery links.",
      offers: {
        "@type": "AggregateOffer",
        lowPrice: "9",
        highPrice: "49",
        priceCurrency: "USD",
        offerCount: "4",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        ratingCount: "150",
        bestRating: "5",
      },
      featureList: [
        "Password-protected photo galleries",
        "Client favorites and online proofing",
        "Bulk drag-and-drop upload",
        "AI-powered photo captions",
        "Google Drive & Google Photos import",
        "Custom gallery slug URLs",
        "Dark mode support",
        "Real-time client selections",
        "Download tracking and analytics",
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "How does gallery delivery work?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Upload your photos to a gallery, set a password, and share the link with your client. They view the photos in a beautiful lightbox, tap hearts on their favorites, and you see the picks on your dashboard.",
          },
        },
        {
          "@type": "Question",
          name: "Can my clients download photos?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. You control whether downloads are enabled per gallery. Clients can download individual photos or the full gallery depending on your settings.",
          },
        },
        {
          "@type": "Question",
          name: "Is there a limit on photo uploads?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Each plan includes a storage quota. Within that quota you can upload as many photos as you want. Our chunked upload pipeline handles even large RAW exports reliably.",
          },
        },
        {
          "@type": "Question",
          name: "How does the favorites feature work?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "When viewing a gallery, clients can tap a heart icon on any photo. You see their selections in real-time on your dashboard, making final edits and album curation a breeze.",
          },
        },
        {
          "@type": "Question",
          name: "Can I use my own domain?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Custom domains are on our roadmap. For now, every gallery gets a clean slug URL on your Fotno subdomain (e.g. gallery.fotno.com/your-shoot).",
          },
        },
        {
          "@type": "Question",
          name: "What happens if I exceed my storage?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We don't cut you off. Overage is billed at a fair per-GB rate, clearly shown in your dashboard so there are no surprises.",
          },
        },
        {
          "@type": "Question",
          name: "Is my data secure?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "All photos are stored on enterprise-grade cloud infrastructure with encryption at rest. Gallery passwords are hashed, and all traffic is served over HTTPS.",
          },
        },
        {
          "@type": "Question",
          name: "How do I get started?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sign up for a free account, choose the storage plan that fits your needs, and start uploading photos right away. It takes less than 2 minutes.",
          },
        },
      ],
    },
  ],
};

export default function Home() {
  return (
    <>
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        strategy="afterInteractive"
      />
      <Header />
      <main>
        <Hero />
        <PrimaryFeatures />
        <CallToAction />
        <Testimonials />
        <Pricing />
        <Faqs />
      </main>
      <Footer />
    </>
  );
}
