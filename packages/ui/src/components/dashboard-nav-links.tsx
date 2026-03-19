"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@workspace/ui/lib/utils";

type NavItem = {
  title: string;
  href: string;
};

export function DashboardNavLinks({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-1">
      {items.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href + "/"));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
              isActive
                ? "text-primary bg-primary/8"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/60",
            )}
          >
            {item.title}
            {isActive && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-primary" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
