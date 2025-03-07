import React from "react";
import { Separator } from "@workspace/ui/components/separator";
import { AppsDropdown } from "@workspace/ui/components/apps_dropdown";

import { NavUser } from "@workspace/ui/components/nav-user";
import { Icons } from "@workspace/ui/components/icons";
import { NotificationPopover } from "@workspace/ui/components/notification-popover";
import Link from "next/link";
type Main = "GALLERY" | "MANAGER" | "WEBSITE" | "DASHBOARD";

type Props = {
  logout: () => Promise<void>;
  main: Main;
};

const Header = async ({ logout, main }: Props) => {
  return (
    <header className="flex items-center justify-between py-4 h-20">
      <div className="flex h-full items-center space-x-2 text-sm">
        <Link href={`${process.env.NEXT_PUBLIC_LANDING_URL}`} aria-label="Home">
          <div className="flex items-center justify-center gap-2">
            <Icons.logo className="h-8 w-auto text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-foreground bg-clip-text text-transparent">
              FOTNO
            </h1>
          </div>
        </Link>
        <Separator orientation="vertical" className="h-5" />
        <AppsDropdown main={main} />
      </div>
      <div className="flex items-center space-x-5">
        <NotificationPopover />
        <NavUser logout={logout} />
      </div>
    </header>
  );
};

export default Header;
