import "@workspace/ui/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react"; // Import React
import { cn } from "@workspace/ui/lib/utils";
import { Toaster } from "@workspace/ui/components/sonner";

import { ExtendedSession, getSession } from "@workspace/lib/auth/auth-client";
import { headers } from "next/headers";
import Header from "@workspace/ui/components/header";
import SideBar from "@workspace/ui/components/sidebar";
import { logout } from "@workspace/lib/actions/logout";
import { collections } from "@workspace/lib/data/dummy_collections";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FOTNO - Gallery",
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
      <body className={cn(inter.className, "bg-background mx-20")}>
        <Toaster />
        <Header main="GALLERY" logout={logout} />
        <div className="flex space-x-10">
          <SideBar
            items={[
              {
                title: "Collections",
                icon: "Folders",
                href: "/collections",
                number: collections.length,
              },
              {
                title: "Starred",
                icon: "FolderHeart",
                href: "/starred",
                number: 3,
              },
              {
                title: "My Page",
                icon: "BookOpen",
                href: "/mypage",
                // number: 3,
              },
              {
                title: "Settings",
                icon: "Settings",
                href: "/settings",
                // number: 3,
              },
            ]}
          />
          <div className="flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
