"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Bell,
  Archive,
  CheckCheck,
  MessageSquare,
  AlertTriangle,
  CreditCard,
  Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { cn } from "@workspace/ui/lib/utils";
import { Skeleton } from "./skeleton";

type Notification = {
  id: string;
  type: string;
  title: string;
  body: string;
  data: Record<string, string> | null;
  isRead: boolean;
  isArchived: boolean;
  createdAt: string;
};

const TYPE_ICONS: Record<string, typeof MessageSquare> = {
  comments: MessageSquare,
  galleryExpiry: Clock,
  storageWarning: AlertTriangle,
  billingFailed: CreditCard,
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function getNotificationLink(n: Notification): string | null {
  if (n.type === "comments" && n.data?.galleryId) {
    return `/galleries/${n.data.galleryId}/comments`;
  }
  if (n.type === "galleryExpiry" && n.data?.galleryId) {
    return `/galleries/${n.data.galleryId}/settings`;
  }
  if (n.type === "billingFailed") {
    return "/billing";
  }
  if (n.type === "storageWarning") {
    return "/billing";
  }
  return null;
}

export function NotificationBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(false);
  const prevCountRef = useRef(0);

  const fetchNotifications = useCallback(async (archived: boolean) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/settings/notifications/inbox${archived ? "?archived=true" : ""}`,
      );
      if (!res.ok) return;
      const json = await res.json();
      setNotifications(json.data ?? []);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await fetch("/api/settings/notifications/unread-count");
      if (!res.ok) return;
      const json = await res.json();
      const count = json.data?.count ?? 0;
      setUnreadCount(count);

      // If count increased and popover is open, auto-refresh the list
      if (count > prevCountRef.current && open) {
        void fetchNotifications(showArchived);
      }
      prevCountRef.current = count;
    } catch {}
  }, [open, showArchived, fetchNotifications]);

  // Poll unread count every 15s for near-real-time updates
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 15_000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  // Fetch notifications when popover opens or tab changes
  useEffect(() => {
    if (open) {
      fetchNotifications(showArchived);
    }
  }, [open, showArchived, fetchNotifications]);

  const handleNotificationClick = async (n: Notification) => {
    if (!n.isRead) {
      await fetch(`/api/settings/notifications/${n.id}/read`, {
        method: "POST",
      });
      setNotifications((prev) =>
        prev.map((item) =>
          item.id === n.id ? { ...item, isRead: true } : item,
        ),
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    }

    const link = getNotificationLink(n);
    if (link) {
      setOpen(false);
      router.push(link);
    }
  };

  const markAllRead = async () => {
    try {
      const res = await fetch("/api/settings/notifications/mark-all-read", {
        method: "POST",
      });
      if (!res.ok) return;
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {}
  };

  const archiveAll = async () => {
    try {
      const res = await fetch("/api/settings/notifications/archive-all", {
        method: "POST",
      });
      if (!res.ok) return;
      setNotifications([]);
      setUnreadCount(0);
    } catch {}
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="relative h-8 w-8 rounded-full"
        >
          <Bell className="h-[18px] w-[18px]" />
          {unreadCount > 0 && (
            <div className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-destructive" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="!w-[380px] min-w-[380px] p-0" sideOffset={8}>
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-2.5">
          <h3 className="text-sm font-semibold">Notifications</h3>
          {!showArchived && !loading && notifications.length > 0 && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
                onClick={markAllRead}
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Read all
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
                onClick={archiveAll}
              >
                <Archive className="h-3.5 w-3.5" />
                Archive all
              </Button>
            </div>
          )}
        </div>

        {/* Tab toggle */}
        <div className="flex border-b">
          <button
            className={cn(
              "flex-1 py-2 text-xs font-medium transition-colors",
              !showArchived
                ? "border-b-2 border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => setShowArchived(false)}
          >
            Inbox
            {unreadCount > 0 && !showArchived && (
              <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-destructive-foreground">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>
          <button
            className={cn(
              "flex-1 py-2 text-xs font-medium transition-colors",
              showArchived
                ? "border-b-2 border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => setShowArchived(true)}
          >
            Archived
          </button>
        </div>

        {/* Notification list */}
        <div className="max-h-[360px] overflow-y-auto">
          {loading ? (
            <div className="flex flex-col gap-2 p-4 text-sm text-muted-foreground w-full">
              <Skeleton className="h-10 rounded-full w-full" />
              <Skeleton className="h-10 rounded-full w-3/4" />
              <Skeleton className="h-10 rounded-full w-2/4" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
              <Bell className="mb-2 h-8 w-8 opacity-20" />
              <p className="text-sm">
                {showArchived
                  ? "No archived notifications"
                  : "You're all caught up!"}
              </p>
            </div>
          ) : (
            <ul>
              {notifications.map((n) => {
                const Icon = TYPE_ICONS[n.type] ?? Bell;
                const link = getNotificationLink(n);
                return (
                  <li
                    key={n.id}
                    className={cn(
                      "flex gap-3 border-b px-4 py-3 transition-colors last:border-0",
                      !n.isRead
                        ? "bg-primary/5 hover:bg-primary/10"
                        : "hover:bg-muted/50",
                      link && "cursor-pointer",
                    )}
                    onClick={() => void handleNotificationClick(n)}
                  >
                    <div
                      className={cn(
                        "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                        !n.isRead
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={cn(
                            "text-sm leading-tight",
                            !n.isRead
                              ? "font-semibold text-foreground"
                              : "font-medium text-foreground/80",
                          )}
                        >
                          {n.title}
                        </p>
                        {!n.isRead && (
                          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                        {n.body}
                      </p>
                      <p className="mt-1 text-[11px] text-muted-foreground/60">
                        {timeAgo(n.createdAt)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
