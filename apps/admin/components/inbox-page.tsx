"use client";

import { useState, useCallback } from "react";
import useSWR from "swr";
import { jsonFetcher, apiRequest } from "@/lib/api/client";
import { toast } from "sonner";
import { cn } from "@workspace/ui/lib/utils";
import {
  ArrowLeft,
  Mail,
  MailOpen,
  RefreshCw,
  Star,
  Trash2,
} from "lucide-react";

interface InboundEmail {
  id: string;
  resendId: string;
  from: string;
  to: string[];
  cc: string[];
  subject: string;
  text: string | null;
  html: string | null;
  isRead: boolean;
  isStarred: boolean;
  sentAt: string;
  createdAt: string;
}

interface InboxResponse {
  data: InboundEmail[];
  total: number;
  unreadCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

type Filter = "all" | "unread" | "starred";

export function InboxPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(1);
  const [selectedEmail, setSelectedEmail] = useState<InboundEmail | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const queryParams = new URLSearchParams({
    filter,
    page: String(page),
    pageSize: "50",
  }).toString();

  const { data, isLoading, mutate } = useSWR<InboxResponse>(
    `/api/inbox?${queryParams}`,
    jsonFetcher,
    { revalidateOnFocus: false },
  );

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await mutate();
    setIsRefreshing(false);
  }, [mutate]);

  const handleSelectEmail = useCallback(
    async (email: InboundEmail) => {
      setSelectedEmail(email);
      if (!email.isRead) {
        try {
          await apiRequest(`/api/inbox/${email.id}`, {
            method: "PATCH",
            body: JSON.stringify({ isRead: true }),
          });
          mutate();
        } catch {
          // non-critical
        }
      }
    },
    [mutate],
  );

  const handleToggleStar = useCallback(
    async (email: InboundEmail, e: React.MouseEvent) => {
      e.stopPropagation();
      try {
        await apiRequest(`/api/inbox/${email.id}`, {
          method: "PATCH",
          body: JSON.stringify({ isStarred: !email.isStarred }),
        });
        if (selectedEmail?.id === email.id) {
          setSelectedEmail({ ...email, isStarred: !email.isStarred });
        }
        mutate();
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Something went wrong",
        );
      }
    },
    [mutate, selectedEmail],
  );

  const handleToggleRead = useCallback(
    async (email: InboundEmail) => {
      try {
        await apiRequest(`/api/inbox/${email.id}`, {
          method: "PATCH",
          body: JSON.stringify({ isRead: !email.isRead }),
        });
        if (selectedEmail?.id === email.id) {
          setSelectedEmail({ ...email, isRead: !email.isRead });
        }
        mutate();
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Something went wrong",
        );
      }
    },
    [mutate, selectedEmail],
  );

  const handleDelete = useCallback(
    async (email: InboundEmail) => {
      if (!confirm("Delete this email?")) return;
      try {
        await apiRequest(`/api/inbox/${email.id}`, { method: "DELETE" });
        if (selectedEmail?.id === email.id) setSelectedEmail(null);
        toast.success("Email deleted");
        mutate();
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Something went wrong",
        );
      }
    },
    [mutate, selectedEmail],
  );

  const extractSenderName = (from: string) => {
    const match = from.match(/^(.+?)\s*<.+>$/);
    return match?.[1]?.trim() ?? from;
  };

  const extractSenderEmail = (from: string) => {
    const match = from.match(/<(.+?)>/);
    return match ? match[1] : from;
  };

  const formatTime = (iso: string) => {
    const date = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const isToday = date.toDateString() === now.toDateString();
    const isYesterday =
      new Date(now.getTime() - 86400000).toDateString() === date.toDateString();
    const isThisYear = date.getFullYear() === now.getFullYear();

    if (diffMs < 60000) return "now";
    if (isToday) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
    }
    if (isYesterday) return "Yesterday";
    if (isThisYear) {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const senderInitial = (from: string) => {
    const name = extractSenderName(from);
    return name.charAt(0).toUpperCase();
  };

  // ── Detail view ──
  if (selectedEmail) {
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        {/* Toolbar */}
        <div className="flex items-center gap-1 border-b border-border px-3 py-2">
          <button
            onClick={() => setSelectedEmail(null)}
            className="rounded-full p-2 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-1 ml-2">
            <button
              onClick={() => handleToggleRead(selectedEmail)}
              className="rounded-full p-2 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              title={
                selectedEmail.isRead ? "Mark as unread" : "Mark as read"
              }
            >
              {selectedEmail.isRead ? (
                <Mail className="h-4 w-4" />
              ) : (
                <MailOpen className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={() => handleDelete(selectedEmail)}
              className="rounded-full p-2 hover:bg-muted transition-colors text-muted-foreground hover:text-destructive"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Subject */}
        <div className="px-6 pt-5 pb-3">
          <h1 className="text-xl font-normal text-foreground">
            {selectedEmail.subject || "(no subject)"}
          </h1>
        </div>

        {/* Sender row */}
        <div className="px-6 pb-4 flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center text-sm font-semibold text-primary shrink-0 mt-0.5">
            {senderInitial(selectedEmail.from)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="font-medium text-sm text-foreground">
                  {extractSenderName(selectedEmail.from)}
                </span>
                <span className="text-xs text-muted-foreground">
                  &lt;{extractSenderEmail(selectedEmail.from)}&gt;
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-muted-foreground">
                  {new Date(selectedEmail.sentAt).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
                <button
                  onClick={(e) => handleToggleStar(selectedEmail, e)}
                  className={cn(
                    "p-1 transition-colors",
                    selectedEmail.isStarred
                      ? "text-amber-400"
                      : "text-muted-foreground/30 hover:text-muted-foreground",
                  )}
                >
                  <Star
                    className="h-4 w-4"
                    fill={selectedEmail.isStarred ? "currentColor" : "none"}
                  />
                </button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              to {selectedEmail.to.join(", ")}
              {selectedEmail.cc.length > 0 &&
                `, cc: ${selectedEmail.cc.join(", ")}`}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto border-t border-border">
          <div className="px-6 py-4 ml-[52px]">
            {selectedEmail.html ? (
              <iframe
                srcDoc={selectedEmail.html}
                className="w-full min-h-[500px] border-0"
                sandbox=""
                title="Email content"
              />
            ) : selectedEmail.text ? (
              <pre className="whitespace-pre-wrap text-sm text-foreground font-sans leading-relaxed">
                {selectedEmail.text}
              </pre>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No content available
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── List view ──
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <div className="flex items-center gap-1">
          {/* Filter tabs */}
          <div className="flex gap-0.5 rounded-lg bg-muted/60 p-0.5">
            {(["all", "unread", "starred"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => {
                  setFilter(f);
                  setPage(1);
                }}
                className={cn(
                  "rounded-md px-3 py-1 text-xs font-medium transition-colors capitalize",
                  filter === f
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="rounded-full p-2 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground ml-1"
            title="Refresh"
          >
            <RefreshCw
              className={cn("h-4 w-4", isRefreshing && "animate-spin")}
            />
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {data && (
            <>
              {data.unreadCount > 0 && (
                <span className="font-medium text-foreground">
                  {data.unreadCount} unread
                </span>
              )}
              <span>
                {(page - 1) * data.pageSize + 1}-
                {Math.min(page * data.pageSize, data.total)} of {data.total}
              </span>
              {data.totalPages > 1 && (
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="rounded p-1 hover:bg-muted disabled:opacity-30"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() =>
                      setPage((p) => Math.min(data.totalPages, p + 1))
                    }
                    disabled={page === data.totalPages}
                    className="rounded p-1 hover:bg-muted disabled:opacity-30"
                  >
                    <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Email rows */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center p-12 text-sm text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            Loading...
          </div>
        ) : !data?.data.length ? (
          <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
            <Mail className="h-10 w-10 mb-3 opacity-30" />
            <p className="text-sm">No emails</p>
          </div>
        ) : (
          data.data.map((email) => (
            <button
              key={email.id}
              onClick={() => handleSelectEmail(email)}
              className={cn(
                "w-full text-left flex items-center gap-3 px-3 py-2 border-b border-border/50 transition-colors hover:shadow-[inset_0_0_0_1000px_rgba(0,0,0,0.02)] dark:hover:shadow-[inset_0_0_0_1000px_rgba(255,255,255,0.02)]",
                !email.isRead && "bg-primary/[0.03]",
              )}
            >
              {/* Star */}
              <button
                onClick={(e) => handleToggleStar(email, e)}
                className={cn(
                  "shrink-0 p-0.5 transition-colors",
                  email.isStarred
                    ? "text-amber-400"
                    : "text-muted-foreground/20 hover:text-muted-foreground/60",
                )}
              >
                <Star
                  className="h-4 w-4"
                  fill={email.isStarred ? "currentColor" : "none"}
                />
              </button>

              {/* Sender */}
              <span
                className={cn(
                  "w-[180px] shrink-0 truncate text-sm",
                  !email.isRead
                    ? "font-semibold text-foreground"
                    : "text-foreground/70",
                )}
              >
                {extractSenderName(email.from)}
              </span>

              {/* Subject + snippet */}
              <div className="flex-1 min-w-0 flex items-baseline gap-1.5">
                <span
                  className={cn(
                    "truncate text-sm shrink-0 max-w-[50%]",
                    !email.isRead
                      ? "font-semibold text-foreground"
                      : "text-foreground/70",
                  )}
                >
                  {email.subject || "(no subject)"}
                </span>
                {email.text && (
                  <>
                    <span className="text-muted-foreground/40">-</span>
                    <span className="text-sm text-muted-foreground/60 truncate">
                      {email.text.slice(0, 120)}
                    </span>
                  </>
                )}
              </div>

              {/* Date */}
              <span
                className={cn(
                  "shrink-0 text-xs",
                  !email.isRead
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {formatTime(email.sentAt)}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
