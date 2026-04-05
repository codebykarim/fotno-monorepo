import React from "react";
import { NavUser } from "@workspace/ui/components/nav-user";
import { NotificationBell } from "@workspace/ui/components/notification-bell";
import { Icons } from "@workspace/ui/components/icons";
import { ThemeToggle } from "@workspace/ui/components/theme-toggle";
import { DashboardNavLinks } from "@workspace/ui/components/dashboard-nav-links";
import { DashboardMobileNav } from "@workspace/ui/components/dashboard-mobile-nav";
import Link from "next/link";

type Main = "GALLERY" | "MANAGER" | "WEBSITE" | "DASHBOARD";

type Props = {
  main: Main;
};

const dashboardNavItems = [
  { title: "Overview", href: "/" },
  { title: "Galleries", href: "/galleries" },
  { title: "Billing", href: "/billing" },
  { title: "Settings", href: "/settings" },
];

const Header = async ({ main }: Props) => {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-14 px-5 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="flex items-center gap-3 md:gap-5">
        {main === "DASHBOARD" && (
          <DashboardMobileNav items={dashboardNavItems} />
        )}

        <Link
          href={`${process.env.NEXT_PUBLIC_LANDING_URL ?? "/"}`}
          aria-label="Home"
          className="flex items-center gap-2 shrink-0"
        >
          <Icons.logo className="h-6 w-6 text-primary" />
          <span className="text-base font-bold tracking-tight bg-gradient-to-r from-primary to-foreground bg-clip-text text-transparent">
            FOTNO
          </span>
        </Link>

        {main === "DASHBOARD" && (
          <DashboardNavLinks items={dashboardNavItems} />
        )}
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <NotificationBell />
        <NavUser />
      </div>
    </header>
  );
};

export default Header;
