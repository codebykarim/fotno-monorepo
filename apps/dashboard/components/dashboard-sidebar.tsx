"use client";

import {
  BarChart3,
  Images,
  Users,
  LogOut,
  Camera,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@workspace/ui/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { StorageWidget } from "./storage-widget";

type SidebarItem = {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
};

type Props = {
  onLogout: () => Promise<void>;
};

const DashboardSidebar = ({ onLogout }: Props) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const sidebarItems: SidebarItem[] = [
    {
      title: "Overview",
      icon: BarChart3,
      href: "/",
    },
    {
      title: "Galleries",
      icon: Images,
      href: "/galleries",
    },
    {
      title: "Clients",
      icon: Users,
      href: "/clients",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/settings",
    },
  ];

  const externalApps = [
    {
      title: "Gallery App",
      icon: Camera,
      href: `${process.env.NEXT_PUBLIC_GALLERY_URL || "http://localhost:3004"}`,
    },
  ];

  return (
    <div
      className={cn(
        "relative flex h-full flex-col border-r border-border/80 bg-card/90 shadow-[8px_0_30px_-26px_rgba(15,23,42,0.7)] backdrop-blur transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="border-b border-border/70 p-4">
        <h2
          className={cn(
            "text-lg font-semibold tracking-tight transition-opacity duration-300 text-center",
            isCollapsed ? "text-2xl font-bold" : "text-lg",
          )}
        >
          {isCollapsed ? "F" : "FOTNO"}
        </h2>
      </div>

      <nav className="flex-1 px-2 pb-4">
        <div className="space-y-4">
          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href === "/galleries" &&
                  pathname.startsWith("/galleries/") &&
                  pathname !== "/galleries/new");

              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      "flex items-center rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-accent/70 hover:text-accent-foreground",
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && <span className="ml-3">{item.title}</span>}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* {!isCollapsed && (
            <div>
              <h3 className="px-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Other Apps
              </h3>
              <div className="mt-2 space-y-1">
                {externalApps.map((app) => {
                  const Icon = app.icon;

                  return (
                    <a
                      key={app.title}
                      href={app.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="flex items-center rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-accent/70 hover:text-accent-foreground">
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <span className="ml-3">{app.title}</span>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          )} */}
        </div>
      </nav>

      <div className="p-2">
        <StorageWidget compact={isCollapsed} />
        <Button
          variant="ghost"
          className="w-full justify-start rounded-xl px-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          onClick={onLogout}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span className="ml-3">Logout</span>}
        </Button>
      </div>

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-border/70 bg-card hover:bg-accent transition-colors duration-200"
      >
        <div
          className={cn(
            "w-2 h-2 border-r-2 border-b-2 border-foreground transform transition-transform duration-200",
            isCollapsed ? "-rotate-45" : "rotate-135",
          )}
        />
      </button>
    </div>
  );
};

export default DashboardSidebar;
