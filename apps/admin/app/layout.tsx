"use client";

import "@/app/globals.css";
import type React from "react";
import { useEffect, useState } from "react";
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
  Menu,
  X,
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer open
  useEffect(() => {
    if (mobileNavOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileNavOpen]);

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("scroll-smooth antialiased focus:scroll-auto")}
    >
      <head>
        <title>FOTNO Admin</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </head>
      <body className={cn(inter.className, "bg-background text-foreground")}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {isLoginPage ? (
            children
          ) : (
            <div className="flex min-h-screen">
              {/* Mobile top bar */}
              <div className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-card px-3 lg:hidden">
                <button
                  onClick={() => setMobileNavOpen(true)}
                  aria-label="Open menu"
                  className="rounded-lg p-2 hover:bg-muted"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <span className="text-sm font-semibold tracking-tight">
                  FOTNO{" "}
                  <span className="text-muted-foreground font-normal">
                    Admin
                  </span>
                </span>
                <div className="flex h-9 w-9 items-center justify-center">
                  <NavUser
                    whenSwitchRedirectTo={
                      process.env.NEXT_PUBLIC_AUTH_URL ||
                      "https://auth.fotno.com"
                    }
                  />
                </div>
              </div>

              {/* Backdrop (mobile) */}
              {mobileNavOpen && (
                <div
                  onClick={() => setMobileNavOpen(false)}
                  className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                  aria-hidden
                />
              )}

              {/* Sidebar */}
              <aside
                className={cn(
                  "fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card transition-transform duration-200 ease-out lg:w-56 lg:translate-x-0",
                  mobileNavOpen ? "translate-x-0" : "-translate-x-full",
                )}
              >
                <div className="flex h-14 items-center justify-between border-b border-border px-4">
                  <span className="text-sm font-semibold tracking-tight">
                    FOTNO{" "}
                    <span className="text-muted-foreground font-normal">
                      Admin
                    </span>
                  </span>
                  <button
                    onClick={() => setMobileNavOpen(false)}
                    aria-label="Close menu"
                    className="rounded-lg p-1.5 hover:bg-muted lg:hidden"
                  >
                    <X className="h-4 w-4" />
                  </button>
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
              <main className="flex-1 pt-14 lg:pt-0 lg:pl-56">
                <div className="p-4 sm:p-6 lg:p-8">{children}</div>
              </main>

              {/* Desktop top-right user */}
              <div className="fixed top-4 right-4 hidden lg:block">
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
