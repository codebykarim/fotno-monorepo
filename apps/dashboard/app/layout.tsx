import "@workspace/ui/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react"; // Import React
import { cn } from "@workspace/ui/lib/utils";
import { Toaster } from "@workspace/ui/components/sonner";
import {
  SidebarInset,
  SidebarProvider,
} from "@workspace/ui/components/sidebar";
import { AppSidebar } from "@/components/home/app-sidebar";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import type { User } from "better-auth/types";

type Session = {
  user: User;
};

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
  const { data: session } = (await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  })) as { data: Session };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("scroll-smooth antialiased focus:scroll-auto")}
    >
      <body className={cn(inter.className, "bg-foreground")}>
        <SidebarProvider>
          {session?.user?.finishOnboarding && <AppSidebar />}
          <SidebarInset>
            {children} <Toaster />
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
