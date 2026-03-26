import "@workspace/ui/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import { cn } from "@workspace/ui/lib/utils";
import { Toaster } from "@workspace/ui/components/sonner";
import { ThemeProvider } from "@workspace/ui/components/theme-provider";
import { ThemeToggle } from "@workspace/ui/components/theme-toggle";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

const GALLERY_URL =
  process.env.NEXT_PUBLIC_GALLERY_URL ?? "https://gallery.fotno.com";

export const metadata: Metadata = {
  metadataBase: new URL(GALLERY_URL),
  title: {
    default: "FOTNO Gallery — Secure Photo Galleries for Clients",
    template: "%s | FOTNO Gallery",
  },
  description:
    "View your private, password-protected photo gallery. Browse, favorite, and download your photos in a beautiful gallery experience by FOTNO (Photno / Photnoo).",
  keywords: [
    "fotno gallery",
    "photno gallery",
    "photnoo gallery",
    "client photo gallery",
    "private photo gallery",
    "password protected gallery",
    "online photo gallery",
    "photo proofing gallery",
    "photo delivery gallery",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: GALLERY_URL,
    siteName: "FOTNO Gallery",
    title: "FOTNO Gallery — Secure Photo Galleries for Clients",
    description:
      "View your private, password-protected photo gallery. Browse, favorite, and download your photos in a beautiful gallery experience.",
  },
  twitter: {
    card: "summary",
    title: "FOTNO Gallery",
    description: "Secure, beautiful photo galleries by FOTNO.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          inter.className,
          "bg-background text-foreground antialiased",
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="fixed top-4 right-4 z-50">
            <ThemeToggle />
          </div>
          {children}
          <Toaster richColors position="bottom-center" />
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
