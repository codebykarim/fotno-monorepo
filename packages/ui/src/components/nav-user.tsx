"use client";

import { useState, useEffect, useMemo } from "react";
import {
  CreditCard,
  Loader2,
  LogOut,
  LogOutIcon,
  PlusIcon,
  Sparkles,
  User,
  UserPlus,
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
  multiSession,
} from "@workspace/lib/auth/auth-client";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";

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

type DeviceSessionEntry = {
  session: { id: string; token: string };
  user: {
    id: string;
    name: string | null;
    email: string;
    image?: string | null;
  };
};

function getLogInAnotherAccountUrl(): string {
  const authBase = (
    process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:3002"
  ).replace(/\/$/, "");
  const dashboardBase = (
    process.env.NEXT_PUBLIC_DASHBOARD_URL ?? "http://localhost:3001"
  ).replace(/\/$/, "");
  const callback = encodeURIComponent(`${dashboardBase}/`);
  return `${authBase}/add-account?callbackURL=${callback}`;
}

export function NavUser({
  whenSwitchRedirectTo,
}: {
  whenSwitchRedirectTo?: string;
}) {
  const router = useRouter();
  const { data: session, refetch: refetchSession } = useSession();
  const extendedSession = session as ExtendedSession;
  const [storage, setStorage] = useState<StorageSummary | null>(null);
  const [accountSwitcherOpen, setAccountSwitcherOpen] = useState(false);
  const [deviceSessions, setDeviceSessions] = useState<DeviceSessionEntry[]>(
    [],
  );
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionsError, setSessionsError] = useState<string | null>(null);
  const [pendingToken, setPendingToken] = useState<string | null>(null);

  useEffect(() => {
    if (extendedSession?.user.subscribed) {
      fetch("/api/storage/summary")
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data) setStorage(data);
        })
        .catch(() => {});
    }
  }, [extendedSession?.user.subscribed]);

  useEffect(() => {
    if (!accountSwitcherOpen) return;

    let cancelled = false;
    setSessionsLoading(true);
    setSessionsError(null);

    void multiSession.listDeviceSessions().then((res) => {
      if (cancelled) return;
      setSessionsLoading(false);
      const err = res.error;
      if (err) {
        setSessionsError(
          typeof err === "object" && err !== null && "message" in err
            ? String((err as { message?: string }).message)
            : "Could not load accounts",
        );
        setDeviceSessions([]);
        return;
      }
      const raw = res.data;
      setDeviceSessions(
        Array.isArray(raw) ? (raw as DeviceSessionEntry[]) : [],
      );
    });

    return () => {
      cancelled = true;
    };
  }, [accountSwitcherOpen]);

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

  const activeSessionId =
    extendedSession?.session &&
    typeof extendedSession.session === "object" &&
    "id" in extendedSession.session
      ? String((extendedSession.session as { id: string }).id)
      : undefined;

  const sortedDeviceSessions = useMemo(() => {
    if (!activeSessionId) return deviceSessions;
    return [...deviceSessions].sort((a, b) => {
      const aActive = a.session.id === activeSessionId;
      const bActive = b.session.id === activeSessionId;
      if (aActive && !bActive) return -1;
      if (!aActive && bActive) return 1;
      return 0;
    });
  }, [deviceSessions, activeSessionId]);

  const switchToSession = async (sessionToken: string) => {
    setPendingToken(sessionToken);
    const { error } = await multiSession.setActive({ sessionToken });
    setPendingToken(null);
    if (error) {
      console.error("Switch account error:", error);
      return;
    }
    setAccountSwitcherOpen(false);
    router.push(whenSwitchRedirectTo || "/");
  };

  const revokeSession = async (sessionToken: string) => {
    if (
      !window.confirm(
        "Remove this account from this browser? You can sign in again later.",
      )
    ) {
      return;
    }
    setPendingToken(sessionToken);
    const { error } = await multiSession.revoke({ sessionToken });
    setPendingToken(null);
    if (error) {
      console.error("Revoke session error:", error);
      return;
    }
    const { data: nextList, error: listError } =
      await multiSession.listDeviceSessions();
    if (!listError && Array.isArray(nextList)) {
      setDeviceSessions(nextList as DeviceSessionEntry[]);
    }
    await refetchSession();
    router.refresh();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant={"ghost"} className="rounded-full">
            <Avatar className="rounded-full">
              <AvatarImage
                src={extendedSession?.user?.image ?? "/avatars/shadcn.jpg"}
                alt={extendedSession?.user.name ?? "User"}
              />
              <AvatarFallback className="rounded-lg text-white">
                {extendedSession?.user.name?.substring(0, 2).toUpperCase() ??
                  "U"}
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
                  src={extendedSession?.user?.image ?? "/avatars/shadcn.jpg"}
                />
                <AvatarFallback className="rounded-lg text-white">
                  {" "}
                  {extendedSession?.user.name?.substring(0, 2).toUpperCase() ??
                    "U"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {extendedSession?.user.name}
                </span>
                <span className="truncate text-xs">
                  {extendedSession?.user.email}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              className={
                extendedSession?.user.subscribed
                  ? "focus:bg-transparent bg-background"
                  : "cursor-pointer"
              }
              onClick={() => {
                if (!extendedSession?.user.subscribed) router.push("/billing");
              }}
            >
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
          <DropdownMenuItem onClick={() => setAccountSwitcherOpen(true)}>
            <User />
            Switch Account
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => void logout()}>
            <LogOut />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={accountSwitcherOpen} onOpenChange={setAccountSwitcherOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Switch account</DialogTitle>
            <DialogDescription>
              Choose a signed-in account on this device, remove one, or add a
              new login.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {sessionsLoading ? (
              <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm">Loading accounts…</span>
              </div>
            ) : sessionsError ? (
              <p className="text-sm text-destructive">{sessionsError}</p>
            ) : deviceSessions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No other sessions on this device yet. Use the button below to
                log in with another account (your current session stays
                available).
              </p>
            ) : (
              <ul className="max-h-[min(60vh,320px)] space-y-2 overflow-y-auto pr-1">
                {sortedDeviceSessions.map((row) => {
                  const isActive = row.session.id === activeSessionId;
                  const busy = pendingToken === row.session.token;
                  return (
                    <li
                      key={row.session.id}
                      className="flex items-center gap-3 rounded-lg border p-3"
                    >
                      <Avatar className="h-10 w-10 rounded-lg">
                        <AvatarImage
                          src={row.user.image ?? undefined}
                          alt={row.user.name ?? row.user.email}
                        />
                        <AvatarFallback className="rounded-lg text-xs">
                          {(row.user.name ?? row.user.email)
                            .substring(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-medium">
                            {row.user.name ?? row.user.email}
                          </span>
                          {isActive ? (
                            <Badge
                              variant="secondary"
                              className="shrink-0 text-[10px]"
                            >
                              Active
                            </Badge>
                          ) : null}
                        </div>
                        <p className="truncate text-xs text-muted-foreground">
                          {row.user.email}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        {!isActive ? (
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            disabled={busy}
                            onClick={() =>
                              void switchToSession(row.session.token)
                            }
                          >
                            {busy ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Switch"
                            )}
                          </Button>
                        ) : null}
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="text-muted-foreground hover:text-destructive"
                          disabled={busy}
                          aria-label="Remove account from this browser"
                          onClick={() => void revokeSession(row.session.token)}
                        >
                          {busy ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <LogOutIcon className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          {extendedSession?.user ? (
            <DialogFooter className="sm:justify-stretch">
              <Button
                type="button"
                variant="outline"
                className="w-full gap-2"
                onClick={() => {
                  window.location.href = getLogInAnotherAccountUrl();
                }}
              >
                <UserPlus className="h-4 w-4 shrink-0" />
                Log in to another account
              </Button>
            </DialogFooter>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
