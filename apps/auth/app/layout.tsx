import "@workspace/ui/globals.css";
import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import type React from "react"; // Import React
import { cn } from "@workspace/ui/lib/utils";
import { Toaster } from "@workspace/ui/components/sonner";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FOTNO - Authentication",
  description:
    "Prepare to experience photography like never before. Our new website is on its way, bringing you breathtaking visuals and unforgettable moments.",
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
      <body className={cn(spaceGrotesk.className, "bg-background")}>
        {children} <Toaster position="top-center" />
      </body>
    </html>
  );
}
