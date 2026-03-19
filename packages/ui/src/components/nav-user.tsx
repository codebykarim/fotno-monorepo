"use client";

import { useState, useEffect } from "react";
import {
  CreditCard,
  LogOut,
  PlusIcon,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";

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

import {
  useSession,
  ExtendedSession,
  signOut,
} from "@workspace/lib/auth/auth-client";
import { Button } from "@workspace/ui/components/button";

type StorageSummary = {
  used: string;
  limit: string;
  percentage: number;
};

const formatGb = (bytes: string): string => {
  const parsed = Number(bytes);
  if (!Number.isFinite(parsed)) return "0 GB";
  return `${(parsed / 1024 ** 3).toFixed(1)} GB`;
};

export function NavUser() {
  const session = useSession().data as ExtendedSession;
  const router = useRouter();
  const [storage, setStorage] = useState<StorageSummary | null>(null);

  useEffect(() => {
    if (session?.user.subscribed) {
      fetch("/api/storage/summary")
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data) setStorage(data);
        })
        .catch(() => {});
    }
  }, [session?.user.subscribed]);

  const logout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href =
            process.env.NEXT_PUBLIC_LANDING_URL || "http://localhost:3000";
        },
        onError: (error: unknown) => {
          console.error("Logout error:", error);
        },
      },
    });
  };

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
          <DropdownMenuItem
            className={session?.user.subscribed ? "focus:bg-transparent bg-background" : "cursor-pointer"}
            onClick={() => {
              if (!session?.user.subscribed) router.push("/billing");
            }}
          >
            {session?.user.subscribed ? (
              <div className="flex items-center justify-between w-full">
                <div>
                  <p className="text-xs font-semibold text-primary">Storage</p>
                  <p className="text-sm font-medium text-foreground">
                    {storage
                      ? `${formatGb(storage.used)} of ${formatGb(storage.limit)} used`
                      : "Loading..."}
                  </p>
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push("/billing");
                  }}
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
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/billing")}>
            <CreditCard />
            Billing
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => void logout()}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
