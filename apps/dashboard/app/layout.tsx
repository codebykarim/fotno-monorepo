import "@workspace/ui/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import { cn } from "@workspace/ui/lib/utils";
import { Toaster } from "@workspace/ui/components/sonner";
import { ThemeProvider } from "@workspace/ui/components/theme-provider";

import { getSession } from "@workspace/lib/auth/auth-client";
import { headers } from "next/headers";
import Header from "@workspace/ui/components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FOTNO Photographer Dashboard",
  description:
    "Photographer command center for galleries, clients, and sharing workflows.",
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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex flex-col min-h-screen">
            <Header main="DASHBOARD" />
            <main className="flex-1 p-4 lg:p-8">
              <div className="dashboard-glass dashboard-enter mx-auto max-w-screen-xl min-h-full rounded-2xl p-6 lg:p-8">
                {children}
              </div>
            </main>
          </div>
          <Toaster richColors position="bottom-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
