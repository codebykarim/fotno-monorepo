"use client";

import "@/app/globals.css";
import type React from "react";
import { Inter } from "next/font/google";
import { cn } from "@workspace/ui/lib/utils";
import { Toaster } from "@workspace/ui/components/sonner";
import { ThemeProvider } from "@workspace/ui/components/theme-provider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Image,
  HardDrive,
  CreditCard,
  Activity,
  BarChart3,
  Tags,
  Inbox,
} from "lucide-react";
import { NavUser } from "@workspace/ui/components/nav-user";

const inter = Inter({ subsets: ["latin"] });

const navItems = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/users", label: "Users", icon: Users },
  { href: "/galleries", label: "Galleries", icon: Image },
  { href: "/storage", label: "Storage", icon: HardDrive },
  { href: "/payments", label: "Subscriptions", icon: CreditCard },
  { href: "/pricing", label: "Pricing", icon: Tags },
  { href: "/inbox", label: "Inbox", icon: Inbox },
  { href: "/services", label: "Services", icon: Activity },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("scroll-smooth antialiased focus:scroll-auto")}
    >
      <head>
        <title>FOTNO Admin</title>
      </head>
      <body className={cn(inter.className, "bg-background text-foreground")}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {isLoginPage ? (
            children
          ) : (
            <div className="flex min-h-screen">
              {/* Sidebar */}
              <aside className="fixed inset-y-0 left-0 z-30 w-56 border-r border-border bg-card">
                <div className="flex h-14 items-center border-b border-border px-4">
                  <span className="text-sm font-semibold tracking-tight">
                    FOTNO{" "}
                    <span className="text-muted-foreground font-normal">
                      Admin
                    </span>
                  </span>
                </div>
                <nav className="flex flex-col gap-1 p-2">
                  {navItems.map((item) => {
                    const isActive =
                      item.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                          isActive
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </aside>

              {/* Main content */}
              <main className="flex-1 pl-56">
                <div className="p-6 lg:p-8">{children}</div>
              </main>
              <div className="fixed top-4 right-4">
                <NavUser
                  whenSwitchRedirectTo={
                    process.env.NEXT_PUBLIC_AUTH_URL || "https://auth.fotno.com"
                  }
                />
              </div>
            </div>
          )}
          <Toaster richColors position="bottom-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
