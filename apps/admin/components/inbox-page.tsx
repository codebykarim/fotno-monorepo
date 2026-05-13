"use client";

import { useState, useCallback } from "react";
import useSWR from "swr";
import { jsonFetcher, apiRequest } from "@/lib/api/client";
import { toast } from "sonner";
import { cn } from "@workspace/ui/lib/utils";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Mail,
  MailOpen,
  RefreshCw,
  Star,
  Trash2,
} from "lucide-react";

// ── Types ──

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

// ── Helpers ──

function extractSenderName(from: string) {
  const match = from.match(/^(.+?)\s*<.+>$/);
  return match?.[1]?.trim().replace(/^"|"$/g, "") ?? from;
}

function extractSenderEmail(from: string) {
  const match = from.match(/<(.+?)>/);
  return match ? match[1] : from;
}

function senderInitial(from: string) {
  return extractSenderName(from).charAt(0).toUpperCase();
}

function formatSmartDate(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const isThisYear = date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }
  if (isThisYear) {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatFullDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// ── Toolbar button ──

function ToolbarButton({
  onClick,
  title,
  disabled,
  className,
  children,
}: {
  onClick: () => void;
  title: string;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "rounded-full p-2 text-muted-foreground transition-colors",
        "hover:bg-muted hover:text-foreground",
        "disabled:opacity-30 disabled:pointer-events-none",
        className,
      )}
    >
      {children}
    </button>
  );
}

// ── Main component ──

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
    { refreshInterval: 30000, revalidateOnFocus: false },
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
          /* non-critical */
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
        if (selectedEmail?.id === email.id)
          setSelectedEmail({ ...email, isStarred: !email.isStarred });
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
        if (selectedEmail?.id === email.id)
          setSelectedEmail({ ...email, isRead: !email.isRead });
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
      if (!confirm("Delete this email permanently?")) return;
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

  // ── Detail view ──────────────────────────────────────────────────────

  if (selectedEmail) {
    return (
      <div className="-m-4 sm:-m-6 lg:-m-8 flex flex-col h-[calc(100svh-3.5rem)] lg:h-screen">
        {/* Top toolbar */}
        <div className="flex items-center justify-between h-12 px-2 border-b border-border bg-card shrink-0">
          <div className="flex items-center">
            <ToolbarButton
              onClick={() => setSelectedEmail(null)}
              title="Back to inbox"
            >
              <ArrowLeft className="h-[18px] w-[18px]" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => handleToggleRead(selectedEmail)}
              title={selectedEmail.isRead ? "Mark as unread" : "Mark as read"}
            >
              {selectedEmail.isRead ? (
                <Mail className="h-[18px] w-[18px]" />
              ) : (
                <MailOpen className="h-[18px] w-[18px]" />
              )}
            </ToolbarButton>
            <ToolbarButton
              onClick={() => handleDelete(selectedEmail)}
              title="Delete"
              className="hover:text-destructive"
            >
              <Trash2 className="h-[18px] w-[18px]" />
            </ToolbarButton>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-auto bg-background">
          <div className="max-w-[900px] mx-auto px-3 sm:px-6 lg:px-10">
            {/* Subject */}
            <h1 className="text-[22px] font-normal text-foreground pt-6 pb-5 leading-tight">
              {selectedEmail.subject || "(no subject)"}
            </h1>

            {/* Message card */}
            <div className="rounded-lg border border-border bg-card shadow-sm mb-8">
              {/* Sender header */}
              <div className="flex items-start gap-4 p-4 pb-0">
                {/* Avatar */}
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground shrink-0">
                  {senderInitial(selectedEmail.from)}
                </div>

                {/* Sender info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-sm font-medium text-foreground">
                          {extractSenderName(selectedEmail.from)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          &lt;{extractSenderEmail(selectedEmail.from)}&gt;
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        to {selectedEmail.to.join(", ")}
                        {selectedEmail.cc.length > 0 &&
                          `, cc: ${selectedEmail.cc.join(", ")}`}
                      </p>
                    </div>

                    {/* Date + star */}
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-xs text-muted-foreground">
                        {formatFullDate(selectedEmail.sentAt)}
                      </span>
                      <button
                        onClick={(e) => handleToggleStar(selectedEmail, e)}
                        className={cn(
                          "p-1.5 rounded-full transition-colors",
                          selectedEmail.isStarred
                            ? "text-amber-400"
                            : "text-muted-foreground/30 hover:text-muted-foreground",
                        )}
                      >
                        <Star
                          className="h-[18px] w-[18px]"
                          fill={
                            selectedEmail.isStarred ? "currentColor" : "none"
                          }
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email body */}
              <div className="px-4 py-5 sm:pl-[72px]">
                {selectedEmail.html ? (
                  <iframe
                    srcDoc={selectedEmail.html}
                    className="w-full border-0 rounded"
                    sandbox=""
                    title="Email content"
                    style={{ minHeight: 400 }}
                    onLoad={(e) => {
                      // Auto-resize iframe to fit content
                      try {
                        const iframe = e.target as HTMLIFrameElement;
                        const doc =
                          iframe.contentDocument ||
                          iframe.contentWindow?.document;
                        if (doc?.body) {
                          iframe.style.height = `${doc.body.scrollHeight + 32}px`;
                        }
                      } catch {
                        /* sandbox may block this */
                      }
                    }}
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
        </div>
      </div>
    );
  }

  // ── List view ────────────────────────────────────────────────────────

  const rangeStart = data ? (page - 1) * data.pageSize + 1 : 0;
  const rangeEnd = data ? Math.min(page * data.pageSize, data.total) : 0;

  return (
    <div className="-m-4 sm:-m-6 lg:-m-8 flex flex-col h-[calc(100svh-3.5rem)] lg:h-screen">
      {/* Toolbar */}
      <div className="flex items-center justify-between h-12 px-2 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-0.5">
          {/* Filter tabs */}
          <div className="flex rounded-md border border-border overflow-hidden mr-2">
            {(["all", "unread", "starred"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => {
                  setFilter(f);
                  setPage(1);
                }}
                className={cn(
                  "px-3 py-1 text-xs font-medium transition-colors capitalize border-r border-border last:border-r-0",
                  filter === f
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                )}
              >
                {f}
                {f === "unread" && data && data.unreadCount > 0 && (
                  <span className="ml-1 text-[10px] opacity-70">
                    ({data.unreadCount})
                  </span>
                )}
              </button>
            ))}
          </div>

          <ToolbarButton
            onClick={handleRefresh}
            disabled={isRefreshing}
            title="Refresh"
          >
            <RefreshCw
              className={cn("h-4 w-4", isRefreshing && "animate-spin")}
            />
          </ToolbarButton>
        </div>

        {/* Pagination */}
        {data && data.total > 0 && (
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground mr-1">
              {rangeStart}-{rangeEnd} of {data.total}
            </span>
            <ToolbarButton
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              title="Newer"
            >
              <ChevronLeft className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
              disabled={page >= data.totalPages}
              title="Older"
            >
              <ChevronRight className="h-4 w-4" />
            </ToolbarButton>
          </div>
        )}
      </div>

      {/* Email rows */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-64 text-sm text-muted-foreground gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Loading...
          </div>
        ) : !data?.data.length ? (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-2">
            <Mail className="h-12 w-12 opacity-20" />
            <p className="text-sm">Nothing here</p>
          </div>
        ) : (
          <div>
            {data.data.map((email) => (
              <div
                key={email.id}
                onClick={() => handleSelectEmail(email)}
                className={cn(
                  "flex items-center h-10 px-2 cursor-pointer border-b border-border/40 text-[13px] transition-colors",
                  "hover:shadow-[inset_0_-1px_0_0_rgba(0,0,0,0.05),inset_0_1px_0_0_rgba(0,0,0,0.05)]",
                  "dark:hover:shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.05),inset_0_1px_0_0_rgba(255,255,255,0.05)]",
                  !email.isRead ? "bg-card font-semibold" : "bg-muted/30",
                )}
              >
                {/* Star */}
                <button
                  onClick={(e) => handleToggleStar(email, e)}
                  className={cn(
                    "shrink-0 p-1.5 mr-1 transition-colors",
                    email.isStarred
                      ? "text-amber-400"
                      : "text-border hover:text-muted-foreground",
                  )}
                >
                  <Star
                    className="h-[15px] w-[15px]"
                    fill={email.isStarred ? "currentColor" : "none"}
                  />
                </button>

                {/* Sender — fixed width like Gmail */}
                <div className="w-[110px] shrink-0 truncate pr-2 sm:w-[200px] sm:pr-4">
                  <span
                    className={cn(
                      !email.isRead
                        ? "text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {extractSenderName(email.from)}
                  </span>
                </div>

                {/* Subject + snippet — fills remaining space */}
                <div className="flex-1 min-w-0 flex items-center pr-4 truncate">
                  <span
                    className={cn(
                      "truncate",
                      !email.isRead ? "text-foreground" : "text-foreground/80",
                    )}
                  >
                    {email.subject || "(no subject)"}
                  </span>
                  {email.text && (
                    <span className="text-muted-foreground/50 truncate ml-1 font-normal">
                      {" "}
                      — {email.text.slice(0, 100)}
                    </span>
                  )}
                </div>

                {/* Date — right-aligned */}
                <div
                  className={cn(
                    "shrink-0 text-xs whitespace-nowrap pl-2",
                    !email.isRead ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {formatSmartDate(email.sentAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
