"use client";

import { useState, useCallback } from "react";
import useSWR from "swr";
import { jsonFetcher, apiRequest } from "@/lib/api/client";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";
import { cn } from "@workspace/ui/lib/utils";

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

  const queryParams = new URLSearchParams({
    filter,
    page: String(page),
    pageSize: "30",
  }).toString();

  const { data, isLoading, mutate } = useSWR<InboxResponse>(
    `/api/inbox?${queryParams}`,
    jsonFetcher,
    { refreshInterval: 15000 },
  );

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
        toast.error(err instanceof Error ? err.message : "Something went wrong");
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
        toast.error(err instanceof Error ? err.message : "Something went wrong");
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
        toast.error(err instanceof Error ? err.message : "Something went wrong");
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
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
    }
    return formatDate(iso);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Inbox</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {data?.unreadCount
              ? `${data.unreadCount} unread`
              : "No unread emails"}
            {data?.total ? ` \u00B7 ${data.total} total` : ""}
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="mb-4 flex gap-1 rounded-lg border border-border bg-muted/50 p-1 w-fit">
        {(["all", "unread", "starred"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => {
              setFilter(f);
              setPage(1);
              setSelectedEmail(null);
            }}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors capitalize",
              filter === f
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex gap-4 min-h-[600px]">
        {/* Email list */}
        <div className="w-[420px] shrink-0 rounded-lg border border-border bg-card overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center p-8 text-sm text-muted-foreground">
              Loading...
            </div>
          ) : !data?.data.length ? (
            <div className="flex items-center justify-center p-8 text-sm text-muted-foreground">
              No emails
            </div>
          ) : (
            <div className="divide-y divide-border">
              {data.data.map((email) => (
                <button
                  key={email.id}
                  onClick={() => handleSelectEmail(email)}
                  className={cn(
                    "w-full text-left px-4 py-3 transition-colors hover:bg-muted/50",
                    selectedEmail?.id === email.id && "bg-muted",
                    !email.isRead && "bg-primary/[0.03]",
                  )}
                >
                  <div className="flex items-start gap-3">
                    {/* Unread dot */}
                    <div className="mt-2 shrink-0">
                      {!email.isRead ? (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      ) : (
                        <div className="h-2 w-2" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={cn(
                            "text-sm truncate",
                            !email.isRead
                              ? "font-semibold text-foreground"
                              : "font-medium text-foreground/80",
                          )}
                        >
                          {extractSenderName(email.from)}
                        </span>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {formatTime(email.sentAt)}
                        </span>
                      </div>
                      <p
                        className={cn(
                          "text-sm truncate mt-0.5",
                          !email.isRead
                            ? "text-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {email.subject || "(no subject)"}
                      </p>
                      {email.text && (
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {email.text.slice(0, 100)}
                        </p>
                      )}
                    </div>

                    {/* Star */}
                    <button
                      onClick={(e) => handleToggleStar(email, e)}
                      className={cn(
                        "mt-1 shrink-0 text-sm transition-colors",
                        email.isStarred
                          ? "text-amber-500"
                          : "text-muted-foreground/40 hover:text-muted-foreground",
                      )}
                    >
                      {email.isStarred ? "\u2605" : "\u2606"}
                    </button>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border px-4 py-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-xs text-muted-foreground">
                {page} / {data.totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((p) => Math.min(data.totalPages, p + 1))
                }
                disabled={page === data.totalPages}
                className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Email detail */}
        <div className="flex-1 rounded-lg border border-border bg-card overflow-hidden">
          {selectedEmail ? (
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="border-b border-border p-5">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-lg font-semibold text-foreground">
                    {selectedEmail.subject || "(no subject)"}
                  </h2>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleRead(selectedEmail)}
                      className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded border border-border hover:bg-muted transition-colors"
                    >
                      Mark {selectedEmail.isRead ? "unread" : "read"}
                    </button>
                    <button
                      onClick={() => handleDelete(selectedEmail)}
                      className="text-xs text-destructive hover:text-destructive/80 px-2 py-1 rounded border border-destructive/30 hover:bg-destructive/10 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground w-12">From</span>
                    <span className="font-medium">
                      {extractSenderName(selectedEmail.from)}
                    </span>
                    <span className="text-muted-foreground">
                      &lt;{extractSenderEmail(selectedEmail.from)}&gt;
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground w-12">To</span>
                    <span>{selectedEmail.to.join(", ")}</span>
                  </div>
                  {selectedEmail.cc.length > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground w-12">CC</span>
                      <span>{selectedEmail.cc.join(", ")}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground w-12">Date</span>
                    <span>
                      {new Date(selectedEmail.sentAt).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-auto p-5">
                {selectedEmail.html ? (
                  <iframe
                    srcDoc={selectedEmail.html}
                    className="w-full min-h-[400px] border-0"
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
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
              Select an email to read
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
