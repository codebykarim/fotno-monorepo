"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Bell, Globe } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

const SECTIONS = [
  { href: "/settings/profile", label: "Profile", icon: User },
  { href: "/settings/notifications", label: "Notifications", icon: Bell },
  ...(process.env.NEXT_PUBLIC_CUSTOM_DOMAINS_ENABLED === "true"
    ? [{ href: "/settings/domain", label: "Custom Domain", icon: Globe }]
    : []),
];

export function SettingsNav() {
  const pathname = usePathname();
  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden w-48 shrink-0 md:block">
        <ul className="space-y-0.5">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            const isActive = pathname === section.href;
            return (
              <li key={section.href}>
                <Link
                  href={section.href}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {section.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mobile nav */}
      <div className="mb-4 w-full md:hidden">
        <nav className="flex gap-1 rounded-lg border border-border bg-muted/50 p-1">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            const isActive = pathname === section.href;
            return (
              <Link
                key={section.href}
                href={section.href}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                  isActive
                    ? "bg-background text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {section.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
