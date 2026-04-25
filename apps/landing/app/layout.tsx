import "@workspace/ui/globals.css";
import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import type React from "react";
import { cn } from "@workspace/ui/lib/utils";
import { ThemeProvider } from "@workspace/ui/components/theme-provider";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz"],
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const SITE_URL = process.env.NEXT_PUBLIC_LANDING_URL ?? "https://fotno.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "FOTNO — Photo Gallery Delivery Platform for Photographers | Photno | Photnoo",
    template: "%s | FOTNO",
  },
  description:
    "FOTNO (Photno / Photnoo) is the modern photo gallery delivery platform for professional photographers. Create stunning password-protected client galleries, online proofing, client favorites, bulk uploads. The best Pixieset, ShootProof & Pic-Time alternative.",
  keywords: [
    // Brand keywords
    "fotno",
    "photno",
    "photnoo",
    "fotno gallery",
    "fotno photo gallery",
    // Primary keywords
    "photo gallery",
    "client gallery",
    "photo delivery platform",
    "photography delivery",
    "online photo gallery",
    "photo gallery for photographers",
    // Feature keywords
    "password protected gallery",
    "private photo gallery",
    "client proofing",
    "online proofing",
    "photo proofing",
    "photo sharing for photographers",
    "client photo delivery",
    "photo gallery software",
    "gallery delivery",
    // Use-case keywords
    "wedding photo gallery",
    "event photo delivery",
    "portrait gallery",
    "photography portfolio",
    "photo sharing platform",
    "photographer tools",
    "photography business software",
    "photo hosting for photographers",
    // Competitor alternative keywords
    "pixieset alternative",
    "shootproof alternative",
    "pic-time alternative",
    "cloudspot alternative",
    "smugmug alternative",
    "zenfolio alternative",
    "pass gallery alternative",
    // Action keywords
    "share photos with clients",
    "deliver photos online",
    "create photo gallery",
    "upload photos for clients",
    "photo gallery with favorites",
    "ai photo captions",
    "bulk photo upload",
    "drag and drop photo gallery",
  ],
  authors: [{ name: "FOTNO", url: SITE_URL }],
  creator: "FOTNO",
  publisher: "FOTNO",
  applicationName: "FOTNO",
  category: "Photography",
  classification: "Photography Software",
  referrer: "origin-when-cross-origin",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "FOTNO",
    title: "FOTNO — Photo Gallery Delivery Platform for Photographers",
    description:
      "Create stunning password-protected photo galleries for your clients. Online proofing, favorites, bulk upload, AI captions, and more. The modern alternative to Pixieset, ShootProof, and Pic-Time.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FOTNO — The modern photo gallery delivery platform for photographers",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FOTNO — Photo Gallery Delivery Platform for Photographers",
    description:
      "Create stunning password-protected photo galleries. Online proofing, client favorites, bulk upload, AI captions. The best Pixieset & ShootProof alternative.",
    images: ["/og-image.png"],
    creator: "@fotno",
    site: "@fotno",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  verification: {
    // Add your verification codes here when you set them up
    google: "cOdP-pimb1JfNTmZs5_a_p7wpUDHzWQ4AmPuqbw_KhE",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
  other: {
    "msapplication-TileColor": "#c97a3a",
    "theme-color": "#c97a3a",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "scroll-smooth antialiased focus:scroll-auto",
        inter.variable,
        fraunces.variable,
        jetbrainsMono.variable,
      )}
    >
      <head>
        <link rel="dns-prefetch" href="//api.fotno.com" />
        <link rel="dns-prefetch" href="//auth.fotno.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18119477393"
          strategy="afterInteractive"
        />
        <Script id="google-tag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18119477393');
          `}
        </Script>
      </head>
      <body
        className={cn(
          inter.className,
          "bg-background text-foreground overflow-x-hidden",
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
        <Script
          src="/api/script.js"
          data-site-id={process.env.NEXT_PUBLIC_RYBBIT_SITE_ID}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
