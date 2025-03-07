import "@workspace/ui/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react"; // Import React
import { cn } from "@workspace/ui/lib/utils";
import { Toaster } from "@workspace/ui/components/sonner";

import { getSession, ExtendedSession } from "@workspace/lib/auth/auth-client";
import { headers } from "next/headers";
import Header from "@workspace/ui/components/header";
import { logout } from "@workspace/lib/actions/logout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FOTNO - Dashboard",
  description:
    "Prepare to experience photography like never before. Our new website is on its way, bringing you breathtaking visuals and unforgettable moments.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = (
    await getSession({
      fetchOptions: {
        headers: await headers(),
      },
    })
  ).data as ExtendedSession;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("scroll-smooth antialiased focus:scroll-auto")}
    >
      <body className={cn(inter.className, "bg-background")}>
        <Header main="DASHBOARD" logout={logout} />
        {children} <Toaster />
      </body>
    </html>
  );
}
