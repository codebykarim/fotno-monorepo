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

import { logout } from "@/actions/logout";
import { useSession, ExtendedSession } from "@workspace/lib/auth/auth-client";
import { Button } from "@workspace/ui/components/button";

export function NavUser({
  user,
}: {
  user: {
    name?: string;
    email?: string;
    avatar?: string | null;
  };
}) {
  const session = useSession().data as ExtendedSession;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage
              src={user.avatar ?? "/avatars/shadcn.jpg"}
              alt={user.name ?? "User"}
            />
            <AvatarFallback className="rounded-lg">
              {user.name?.substring(0, 2).toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{user.name}</span>
            <span className="truncate text-xs">{user.email}</span>
          </div>
          <ChevronsUpDown className="ml-auto size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side={"right"}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage
                src={user.avatar ?? "/avatars/shadcn.jpg"}
                alt={user.name}
              />
              <AvatarFallback className="rounded-lg">
                {" "}
                {user.name?.substring(0, 2).toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="focus:bg-transparent bg-background">
            {session?.user.subscribed ? (
              <div className="flex items-center justify-between w-full">
                <div className="rounded-full border-[3px] border-secondary p-1.5">
                  <DatabaseIcon className="h-4 w-4 text-secondary" />
                </div>
                <div>
                  <p className="text-xs font-medium">Storage</p>
                  <p className="text-xs text-secondary">0 GB of 30 GB used</p>
                </div>
                <div
                  onClick={() => {}}
                  className="rounded-full border border-secondary p-0.5 cursor-pointer"
                >
                  <PlusIcon className="h-4 w-4 text-secondary" />
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
        <DropdownMenuGroup>
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
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
