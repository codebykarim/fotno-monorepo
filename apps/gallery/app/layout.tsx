import "@workspace/ui/globals.css";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import type React from "react";
import { cn } from "@workspace/ui/lib/utils";
import { Toaster } from "@workspace/ui/components/sonner";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "FOTNO Gallery",
  description: "Client-facing photo galleries by FOTNO.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_GALLERY_URL ?? "https://gallery.fotno.com"
  ),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(manrope.variable, "font-sans antialiased")}>
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
