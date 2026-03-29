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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_AUTH_URL ?? "https://auth.fotno.com"),
  title: {
    default: "Sign In — FOTNO Photo Gallery Platform",
    template: "%s | FOTNO",
  },
  description:
    "Sign in or create your FOTNO account. Start delivering stunning photo galleries to your clients in minutes. Free plan available.",
  keywords: [
    "fotno login", "fotno sign up", "photno login", "photnoo sign up",
    "photographer sign up", "photo gallery sign up",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    siteName: "FOTNO",
    title: "Sign In — FOTNO Photo Gallery Platform",
    description: "Sign in or create your FOTNO account. Start delivering stunning photo galleries to your clients.",
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
      className={cn("scroll-smooth antialiased focus:scroll-auto")}
    >
      <body className={cn(inter.className, "auth-shell bg-background text-foreground")}>
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
