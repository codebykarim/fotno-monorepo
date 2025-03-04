"use client";

import * as React from "react";
import {
  AudioWaveform,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  ImageIcon,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

// import { NavMain } from "@/components/home/nav-menu";
// import { NavProjects } from "@/components/home/nav-projects";
import { NavUser } from "@/components/home/nav-user";
// import { TeamSwitcher } from "@/components/home/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@workspace/ui/components/sidebar";
import { Icons } from "@workspace/ui/lib/icons";
import { authClient } from "@/lib/auth-client";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = authClient.useSession();
  // This is sample data.
  const data = {
    user: {
      name: session?.user.name,
      email: session?.user.email,
      avatar: session?.user.image,
    },
    teams: [
      {
        name: "Acme Inc",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
      },
      {
        name: "Acme Corp.",
        logo: AudioWaveform,
        plan: "Startup",
      },
      {
        name: "Evil Corp.",
        logo: Command,
        plan: "Free",
      },
    ],
    navMain: [
      {
        title: "Gallery",
        url: `${process.env.NEXT_PUBLIC_GALLERY_URL}`,
        icon: ImageIcon,
        isActive: true,
        items: [
          {
            title: "Collections",
            url: `${process.env.NEXT_PUBLIC_GALLERY_URL}/collections`,
          },
          {
            title: "Starred",
            url: `${process.env.NEXT_PUBLIC_GALLERY_URL}/starred`,
          },
          {
            title: "Settings",
            url: `${process.env.NEXT_PUBLIC_GALLERY_URL}/settings`,
          },
        ],
      },
      {
        title: "Models",
        url: "#",
        icon: Bot,
        items: [
          {
            title: "Genesis",
            url: "#",
          },
          {
            title: "Explorer",
            url: "#",
          },
          {
            title: "Quantum",
            url: "#",
          },
        ],
      },
      {
        title: "Settings",
        url: "#",
        icon: Settings2,
        items: [
          {
            title: "General",
            url: "#",
          },
          {
            title: "Team",
            url: "#",
          },
          {
            title: "Billing",
            url: "#",
          },
          {
            title: "Limits",
            url: "#",
          },
        ],
      },
    ],
    recents: [
      {
        name: "Design Engineering",
        url: "#",
        icon: Frame,
      },
      {
        name: "Sales & Marketing",
        url: "#",
        icon: PieChart,
      },
      {
        name: "Travel",
        url: "#",
        icon: Map,
      },
    ],
  };
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {state === "collapsed" ? (
          <Icons.logo className="h-8 w-auto text-primary" />
        ) : (
          <div className="flex items-center justify-center gap-2">
            <Icons.logo className="h-8 w-auto text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-foreground bg-clip-text text-transparent">
              FOTNO
            </h1>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        {/* <NavMain items={data.navMain} />
        <NavProjects recents={data.recents} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
