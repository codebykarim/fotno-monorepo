"use client";

import { useState, useCallback } from "react";
import useSWR from "swr";
import {
  Camera,
  Check,
  CornerDownRight,
  MessageSquare,
  Pencil,
  Reply,
  Send,
  ThumbsUp,
  Trash2,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { cn } from "@workspace/ui/lib/utils";
import { apiRequest, jsonFetcher } from "@/lib/api/client";
import { useSession } from "@workspace/lib/auth/auth-client";

type CommentPhoto = {
  thumbnailSrc: string;
  originalSrc: string;
  originalFilename: string;
};

type GalleryComment = {
  id: string;
  authorName: string;
  authorRole: "client" | "photographer";
  message: string;
  photoId: string | null;
  parentId: string | null;
  likes: string[];
  createdAt: string;
  updatedAt: string;
  viewerId: string | null;
  replies: GalleryComment[];
  photo?: CommentPhoto | null;
};

type CommentsResponse = {
  comments: GalleryComment[];
};

const MAX_REPLY_DEPTH = 6;

function formatRelative(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

function countAllComments(comments: GalleryComment[]): number {
  let count = 0;
  for (const c of comments) {
    count += 1;
    if (c.replies?.length) count += countAllComments(c.replies);
  }
  return count;
}

function CommentNode({
  comment,
  depth,
  currentUserId,
  editingComment,
  editText,
  onSetEditText,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
  onReply,
  onToggleLike,
  onPhotoClick,
}: {
  comment: GalleryComment;
  depth: number;
  currentUserId: string;
  editingComment: GalleryComment | null;
  editText: string;
  onSetEditText: (text: string) => void;
  onStartEdit: (c: GalleryComment) => void;
  onCancelEdit: () => void;
  onSaveEdit: (c: GalleryComment) => void;
  onDelete: (c: GalleryComment) => void;
  onReply: (c: GalleryComment) => void;
  onToggleLike: (c: GalleryComment) => void;
  onPhotoClick: (photo: CommentPhoto) => void;
}) {
  const isEditing = editingComment?.id === comment.id;
  const isPhotographerComment = comment.authorRole === "photographer";
  const isNested = depth > 0;
  const liked = comment.likes.includes(currentUserId);

  return (
    <div className="space-y-2">
      <article
        className={cn(
          "rounded-xl border p-3",
          isNested
            ? "border-border/50 bg-background/60"
            : "border-border/70 bg-card",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-foreground">
              {comment.authorName}
            </span>
            {isPhotographerComment ? (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                <Camera className="h-2.5 w-2.5" />
                Photographer
              </span>
            ) : (
              <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                Client
              </span>
            )}
            {comment.updatedAt !== comment.createdAt && (
              <span className="text-[10px] text-muted-foreground/60">
                (edited)
              </span>
            )}
          </div>
          <span className="shrink-0 text-muted-foreground">
            {formatRelative(comment.createdAt)}
          </span>
        </div>

        {/* Referenced photo */}
        {comment.photoId && comment.photo?.thumbnailSrc && (
          <button
            type="button"
            onClick={() => comment.photo && onPhotoClick(comment.photo)}
            className="mt-2 flex items-center gap-2 rounded-lg border border-border/70 bg-muted/40 p-1.5 text-left transition-shadow hover:ring-2 hover:ring-primary/40"
          >
            <img
              src={comment.photo.thumbnailSrc}
              alt={comment.photo.originalFilename}
              className="h-10 w-10 rounded object-cover"
              draggable={false}
            />
            <span className="text-[11px] text-muted-foreground">
              Referenced photo
            </span>
          </button>
        )}

        {/* Message or edit form */}
        {isEditing ? (
          <div className="mt-2 space-y-2">
            <textarea
              value={editText}
              onChange={(e) => onSetEditText(e.target.value)}
              className="min-h-[60px] w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none ring-primary/20 transition focus:ring-2"
            />
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => onSaveEdit(comment)}
                disabled={!editText.trim()}
                className="inline-flex h-7 items-center gap-1 rounded-md bg-primary px-2.5 text-[11px] font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
              >
                <Check className="h-3 w-3" />
                Save
              </button>
              <button
                type="button"
                onClick={onCancelEdit}
                className="inline-flex h-7 items-center gap-1 rounded-md border border-border px-2.5 text-[11px] font-medium text-muted-foreground transition hover:text-foreground"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-2 text-sm leading-relaxed text-foreground/90">
            {comment.message}
          </p>
        )}

        {/* Actions */}
        {!isEditing && (
          <div className="mt-2 flex items-center gap-3">
            {/* Like button */}
            <button
              type="button"
              disabled={!currentUserId}
              onClick={() => onToggleLike(comment)}
              className={cn(
                "inline-flex items-center gap-1 text-xs transition",
                !currentUserId && "pointer-events-none opacity-50",
                liked
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <ThumbsUp className={cn("h-3 w-3", liked && "fill-primary")} />
              {comment.likes.length > 0 ? comment.likes.length : null}
            </button>

            {depth < MAX_REPLY_DEPTH && (
              <button
                type="button"
                onClick={() => onReply(comment)}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground transition hover:text-foreground"
              >
                <Reply className="h-3 w-3" />
                Reply
              </button>
            )}

            {/* Photographer can edit own comments */}
            {isPhotographerComment && (
              <button
                type="button"
                onClick={() => onStartEdit(comment)}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground transition hover:text-foreground"
              >
                <Pencil className="h-3 w-3" />
                Edit
              </button>
            )}

            {/* Photographer can delete any comment */}
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Delete this comment?")) {
                  onDelete(comment);
                }
              }}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground transition hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
              Delete
            </button>
          </div>
        )}
      </article>

      {/* Recursive nested replies */}
      {comment.replies?.length > 0 && (
        <div className="ml-4 space-y-2 border-l-2 border-border/50 pl-3">
          {comment.replies.map((reply) => (
            <CommentNode
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              currentUserId={currentUserId}
              editingComment={editingComment}
              editText={editText}
              onSetEditText={onSetEditText}
              onStartEdit={onStartEdit}
              onCancelEdit={onCancelEdit}
              onSaveEdit={onSaveEdit}
              onDelete={onDelete}
              onReply={onReply}
              onToggleLike={onToggleLike}
              onPhotoClick={onPhotoClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function GalleryCommentsPanel({ galleryId }: { galleryId: string }) {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id ?? "";

  const { data, mutate, isLoading } = useSWR<CommentsResponse>(
    `/api/galleries/${galleryId}/comments`,
    jsonFetcher,
    { revalidateOnFocus: false, refreshInterval: 15_000 },
  );

  const comments = data?.comments ?? [];

  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState<GalleryComment | null>(null);
  const [editingComment, setEditingComment] = useState<GalleryComment | null>(
    null,
  );
  const [editText, setEditText] = useState("");
  const [sending, setSending] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState<CommentPhoto | null>(null);

  const postComment = useCallback(async () => {
    if (!commentText.trim() || sending) return;
    setSending(true);
    try {
      await apiRequest(`/api/galleries/${galleryId}/comments`, {
        method: "POST",
        body: JSON.stringify({
          message: commentText.trim(),
          parentId: replyingTo?.id ?? null,
        }),
      });
      setCommentText("");
      setReplyingTo(null);
      await mutate();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to post comment",
      );
    } finally {
      setSending(false);
    }
  }, [commentText, replyingTo, galleryId, mutate, sending]);

  const editComment = useCallback(
    async (comment: GalleryComment, message: string) => {
      try {
        await apiRequest(`/api/galleries/${galleryId}/comments/${comment.id}`, {
          method: "PATCH",
          body: JSON.stringify({ message }),
        });
        setEditingComment(null);
        setEditText("");
        await mutate();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to edit comment",
        );
      }
    },
    [galleryId, mutate],
  );

  const deleteComment = useCallback(
    async (comment: GalleryComment) => {
      try {
        await apiRequest(`/api/galleries/${galleryId}/comments/${comment.id}`, {
          method: "DELETE",
        });
        await mutate();
        toast.success("Comment deleted");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to delete comment",
        );
      }
    },
    [galleryId, mutate],
  );

  const toggleLike = useCallback(
    async (comment: GalleryComment) => {
      try {
        await apiRequest(
          `/api/galleries/${galleryId}/comments/${comment.id}/like`,
          { method: "POST" },
        );
        await mutate();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to toggle like",
        );
      }
    },
    [galleryId, mutate],
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  const totalCount = countAllComments(comments);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Comments</h2>
        <p className="text-muted-foreground text-sm mt-1">
          {totalCount === 0
            ? "No comments yet on this gallery."
            : `${totalCount} comment${totalCount !== 1 ? "s" : ""} on this gallery`}
        </p>
      </div>

      {/* Compose area */}
      <div className="rounded-xl border border-border/60 bg-card p-4">
        {replyingTo && (
          <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-2.5 py-1.5 text-xs mb-3">
            <CornerDownRight className="h-3 w-3 shrink-0 text-primary" />
            <span className="truncate text-foreground/80">
              Replying to <strong>{replyingTo.authorName}</strong>
            </span>
            <button
              type="button"
              onClick={() => setReplyingTo(null)}
              className="ml-auto shrink-0 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

        <div className="flex gap-3">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={
              replyingTo
                ? `Reply to ${replyingTo.authorName}...`
                : "Write a reply to your clients..."
            }
            rows={2}
            className="min-h-[56px] flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none ring-primary/20 transition focus:ring-2 resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                void postComment();
              }
            }}
          />
          <Button
            size="icon"
            className="h-10 w-10 shrink-0 self-end"
            onClick={() => void postComment()}
            disabled={!commentText.trim() || sending}
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Comments list */}
      <div className="space-y-3">
        {comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60 mb-3">
              <MessageSquare className="h-7 w-7 text-muted-foreground/40" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              No comments yet
            </p>
            <p className="mt-1 text-xs text-muted-foreground/60">
              Comments from your gallery visitors will appear here
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentNode
              key={comment.id}
              comment={comment}
              depth={0}
              currentUserId={currentUserId}
              editingComment={editingComment}
              editText={editText}
              onSetEditText={setEditText}
              onStartEdit={(c) => {
                setEditingComment(c);
                setEditText(c.message);
              }}
              onCancelEdit={() => {
                setEditingComment(null);
                setEditText("");
              }}
              onSaveEdit={(c) => void editComment(c, editText)}
              onDelete={(c) => void deleteComment(c)}
              onReply={(c) => {
                setReplyingTo(c);
                setCommentText("");
              }}
              onToggleLike={(c) => void toggleLike(c)}
              onPhotoClick={setLightboxPhoto}
            />
          ))
        )}
      </div>

      <Dialog
        open={!!lightboxPhoto}
        onOpenChange={(open) => !open && setLightboxPhoto(null)}
      >
        <DialogContent className="max-w-5xl max-h-fit p-2 sm:p-4">
          <DialogTitle className="sr-only">
            {lightboxPhoto?.originalFilename ?? "Referenced photo"}
          </DialogTitle>
          {lightboxPhoto && (
            <div className="flex flex-col items-center gap-3">
              <img
                src={lightboxPhoto.originalSrc}
                alt={lightboxPhoto.originalFilename}
                className="max-h-[80vh] w-auto rounded-lg object-contain"
              />
              <p className="max-w-full truncate text-sm text-muted-foreground">
                {lightboxPhoto.originalFilename}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
