import "@workspace/ui/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import { cn } from "@workspace/ui/lib/utils";
import { Toaster } from "@workspace/ui/components/sonner";

import { getSession } from "@workspace/lib/auth/auth-client";
import { headers } from "next/headers";
import Header from "@workspace/ui/components/header";
import { logout } from "@workspace/lib/actions/logout";
import DashboardSidebar from "../components/dashboard-sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FOTNO Photographer Dashboard",
  description: "Photographer command center for galleries, clients, and sharing workflows.",
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
      <body className={cn(inter.className, "bg-background")}>
        <div className="flex h-screen">
          <div className="hidden lg:block">
            <DashboardSidebar onLogout={logout} />
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            <Header main="DASHBOARD" logout={logout} />
            <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
