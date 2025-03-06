import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  ChevronDownIcon,
  ImageIcon,
  UsersIcon,
  LayoutDashboardIcon,
  ChartNoAxesGanttIcon,
} from "lucide-react";
import { Separator } from "@workspace/ui/components/separator";

type Props = {
  main: "GALLERY" | "MANAGER" | "WEBSITE" | "DASHBOARD";
};

const allApps = [
  {
    title: "GALLERY",
    icon: ImageIcon,
    description: "Start creating your collections",
    href: `${process.env.NEXT_PUBLIC_GALLERY_URL}/`,
  },
  {
    title: "WEBSITE",
    icon: LayoutDashboardIcon,
    description: "Create your own specialty website",
    href: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/`,
  },
  {
    title: "MANAGER",
    icon: UsersIcon,
    description: "Manage your clients and projects",
    href: `${process.env.NEXT_PUBLIC_STUDIO_URL}/`,
  },
  {
    title: "DASHBOARD",
    icon: ChartNoAxesGanttIcon,
    description: "Overview of your work",
    href: `${process.env.NEXT_PUBLIC_DASHBOARD_URL}/`,
  },
];

export const AppsDropdown = ({ main }: Props) => {
  // Filter out the current main app from the dropdown
  const sub = allApps.filter((app) => app.title !== main);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center justify-center gap-2 cursor-pointer">
          <h1 className="text-lg font-semibold bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">
            {main}
          </h1>
          <ChevronDownIcon className="h-4 w-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-68">
        {sub.map((item) => (
          <div key={item.title}>
            <DropdownMenuItem className="my-2">
              <div
                className="bg-background flex size-8 items-center justify-center rounded-md border"
                aria-hidden="true"
              >
                <item.icon size={16} className="" />
              </div>
              <div>
                <div className="text-sm font-medium">{item.title}</div>
                <div className="text-muted-foreground text-xs">
                  {item.description}
                </div>
              </div>
            </DropdownMenuItem>
            {item.title !== "DASHBOARD" && <Separator />}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
