import "@workspace/ui/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import type React from "react";
import { cn } from "@workspace/ui/lib/utils";
import { Toaster } from "@workspace/ui/components/sonner";
import { ThemeProvider } from "@workspace/ui/components/theme-provider";

import { getSession } from "@workspace/lib/auth/auth-client";
import { headers } from "next/headers";
import Header from "@workspace/ui/components/header";
import { TrialBanner } from "@/components/trial-banner";
import { DatadogInit } from "@/components/datadog-init";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_DASHBOARD_URL ?? "https://app.fotno.com"),
  title: {
    default: "FOTNO Dashboard — Manage Your Photo Galleries",
    template: "%s | FOTNO Dashboard",
  },
  description:
    "Your FOTNO photographer command center. Manage galleries, clients, uploads, favorites, and sharing workflows all in one place.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("scroll-smooth antialiased focus:scroll-auto")}
    >
      <body
        className={cn(
          inter.className,
          "bg-background text-foreground",
        )}
      >
        <DatadogInit />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex flex-col min-h-screen">
            <Header main="DASHBOARD" />
            <main className="relative flex-1 overflow-hidden p-4 lg:p-8">
              <div
                className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full opacity-15 blur-3xl"
                style={{ background: "oklch(0.78 0.14 65 / 0.2)" }}
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full opacity-10 blur-3xl"
                style={{ background: "oklch(0.65 0.12 50 / 0.15)" }}
                aria-hidden="true"
              />
              <div className="dashboard-glass relative mx-auto max-w-screen-xl min-h-full rounded-2xl p-6 lg:p-8">
                <TrialBanner />
                {children}
              </div>
            </main>
          </div>
          <Toaster richColors position="bottom-center" />
        </ThemeProvider>
        <Script src="https://app.lemonsqueezy.com/js/lemon.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
