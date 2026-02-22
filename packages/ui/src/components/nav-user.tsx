"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  DatabaseIcon,
  LogOut,
  PlusIcon,
  Sparkles,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";

import { useSession, ExtendedSession } from "@workspace/lib/auth/auth-client";
import { Button } from "@workspace/ui/components/button";

type Props = {
  logout: () => Promise<void>;
};

export function NavUser({ logout }: Props) {
  const session = useSession().data as ExtendedSession;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant={"ghost"} className="rounded-full">
          <Avatar className="rounded-full">
            <AvatarImage
              src={session?.user?.image ?? "/avatars/shadcn.jpg"}
              alt={session?.user.name ?? "User"}
            />
            <AvatarFallback className="rounded-lg text-white">
              {session?.user.name?.substring(0, 2).toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side={"bottom"}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage
                src={session?.user?.image ?? "/avatars/shadcn.jpg"}
              />
              <AvatarFallback className="rounded-lg text-white">
                {" "}
                {session?.user.name?.substring(0, 2).toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">
                {session?.user.name}
              </span>
              <span className="truncate text-xs">{session?.user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="focus:bg-transparent bg-background">
            {session?.user.subscribed ? (
              <div className="flex items-center justify-between w-full">
                <div>
                  <p className="text-xs font-semibold text-primary">Storage</p>
                  <p className="text-sm font-medium text-foreground">
                    0 GB of 30 GB used
                  </p>
                </div>
                <div
                  onClick={() => {}}
                  className="rounded-full border-2 border-secondary p-0.5 cursor-pointer"
                >
                  <PlusIcon className="h-4 w-4 text-foreground" />
                </div>
              </div>
            ) : (
              <>
                <Sparkles />
                Upgrade to Pro
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {/* <DropdownMenuGroup>
          <DropdownMenuItem>
            <BadgeCheck />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
