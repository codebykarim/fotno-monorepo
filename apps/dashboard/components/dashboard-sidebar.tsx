"use client";

import {
  BarChart3,
  Images,
  Users,
  PlusSquare,
  LogOut,
  Camera,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@workspace/ui/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";

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
      title: "New Gallery",
      icon: PlusSquare,
      href: "/galleries/new",
    },
    {
      title: "Clients",
      icon: Users,
      href: "/clients",
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
        "relative flex h-full transition-all duration-300 ease-in-out flex-col bg-card border-r",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4">
        <h2
          className={cn(
            "font-semibold text-lg transition-opacity duration-300",
            isCollapsed ? "opacity-0" : "opacity-100"
          )}
        >
          Photographer
        </h2>
      </div>

      <nav className="flex-1 px-2 pb-4">
        <div className="space-y-4">
          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href === "/galleries" && pathname.startsWith("/galleries/") && pathname !== "/galleries/new");

              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && <span className="ml-3">{item.title}</span>}
                  </div>
                </Link>
              );
            })}
          </div>

          {!isCollapsed && (
            <div>
              <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Other Apps
              </h3>
              <div className="mt-2 space-y-1">
                {externalApps.map((app) => {
                  const Icon = app.icon;

                  return (
                    <a key={app.title} href={app.href} target="_blank" rel="noopener noreferrer">
                      <div className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200">
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <span className="ml-3">{app.title}</span>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="p-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 px-3"
          onClick={onLogout}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span className="ml-3">Logout</span>}
        </Button>
      </div>

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 flex items-center justify-center w-6 h-6 rounded-full bg-border hover:bg-accent transition-colors duration-200"
      >
        <div
          className={cn(
            "w-2 h-2 border-r-2 border-b-2 border-foreground transform transition-transform duration-200",
            isCollapsed ? "rotate-45" : "-rotate-135"
          )}
        />
      </button>
    </div>
  );
};

export default DashboardSidebar;
