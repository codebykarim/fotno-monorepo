"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { apiRequest, jsonFetcher } from "@/lib/api/client";
import type { AdminUserEmail } from "@/lib/types/admin";

type PresetId =
  | "checkin"
  | "pricing"
  | "promo"
  | "feature"
  | "listening"
  | "correction"; // TEMPORARY: remove with the LAUNCH30 follow-ups

type Preset = {
  id: PresetId;
  label: string;
  description: string;
  requiresPromoCode?: boolean;
  requiresFeatureName?: boolean;
};

const PRESETS: Preset[] = [
  {
    id: "checkin",
    label: "Check in",
    description: "Personal note asking if anything's getting in their way.",
  },
  {
    id: "pricing",
    label: "About your subscription",
    description: "Reach out after a non-renewal to ask about pricing.",
  },
  {
    id: "promo",
    label: "Offer a promo code",
    description: "Send a thank-you with a promo code to use at checkout.",
    requiresPromoCode: true,
  },
  {
    id: "feature",
    label: "Highlight a feature",
    description: "Nudge them to try a specific Fotno feature.",
    requiresFeatureName: true,
  },
  {
    id: "listening",
    label: "We're listening",
    description: "Ask for feedback on what would make Fotno better.",
  },
  // TEMPORARY: remove this entry once LAUNCH30 follow-ups are sent.
  {
    id: "correction",
    label: "Promo correction (LAUNCH30)",
    description: "Re-send LAUNCH30 with a working link to broken-promo recipients.",
  },
];

type Props = {
  userId: string;
  userName: string;
  userEmail: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSent?: () => void;
};

function formatRelative(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const days = Math.floor(ms / 86400000);
  if (days < 1) {
    const hours = Math.floor(ms / 3600000);
    return hours < 1 ? "just now" : `${hours}h ago`;
  }
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export function EmailUserModal({
  userId,
  userName,
  userEmail,
  open,
  onOpenChange,
  onSent,
}: Props) {
  const [presetId, setPresetId] = useState<PresetId | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [featureName, setFeatureName] = useState("");
  const [preview, setPreview] = useState<{ subject: string; html: string } | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const { data: history, mutate: refreshHistory } = useSWR<AdminUserEmail[]>(
    open ? `/api/users/${userId}/emails` : null,
    jsonFetcher
  );

  const preset = PRESETS.find((p) => p.id === presetId) ?? null;
  const paramReady =
    !preset ||
    (!preset.requiresPromoCode || promoCode.trim().length > 0) &&
      (!preset.requiresFeatureName || featureName.trim().length > 0);
  const canSend = Boolean(preset && paramReady && preview && !isSending);

  useEffect(() => {
    if (!open) {
      setPresetId(null);
      setPromoCode("");
      setFeatureName("");
      setPreview(null);
      setPreviewError(null);
      setIsPreviewing(false);
      setIsSending(false);
    }
  }, [open]);

  useEffect(() => {
    if (!preset || !paramReady) {
      setPreview(null);
      setPreviewError(null);
      return;
    }
    let cancelled = false;
    const handle = setTimeout(async () => {
      setIsPreviewing(true);
      setPreviewError(null);
      try {
        const body = JSON.stringify({
          preset: preset.id,
          promoCode: preset.requiresPromoCode ? promoCode.trim() : undefined,
          featureName: preset.requiresFeatureName ? featureName.trim() : undefined,
        });
        const res = await apiRequest<{ subject: string; html: string }>(
          `/api/users/${userId}/email/preview`,
          { method: "POST", body }
        );
        if (!cancelled) setPreview(res);
      } catch (e: any) {
        if (!cancelled) {
          setPreview(null);
          setPreviewError(e?.message ?? "Failed to render preview");
        }
      } finally {
        if (!cancelled) setIsPreviewing(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [preset, paramReady, promoCode, featureName, userId]);

  const handleSend = async () => {
    if (!preset || !canSend) return;
    setIsSending(true);
    try {
      await apiRequest(`/api/users/${userId}/email`, {
        method: "POST",
        body: JSON.stringify({
          preset: preset.id,
          promoCode: preset.requiresPromoCode ? promoCode.trim() : undefined,
          featureName: preset.requiresFeatureName ? featureName.trim() : undefined,
        }),
      });
      toast.success(`Email sent to ${userEmail}`);
      refreshHistory();
      onSent?.();
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to send email");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Email {userName}</DialogTitle>
          <DialogDescription>
            Pick a preset — what you preview is exactly what will be sent to{" "}
            <span className="font-medium text-foreground">{userEmail}</span>.
          </DialogDescription>
        </DialogHeader>

        {history && history.length > 0 && (
          <div className="rounded-md border border-border bg-muted/40 p-2">
            <p className="px-1 pb-1 text-xs font-medium text-muted-foreground">
              Previously sent ({history.length})
            </p>
            <ul className="max-h-28 space-y-1 overflow-y-auto">
              {history.map((h) => {
                const label = PRESETS.find((p) => p.id === h.preset)?.label ?? h.preset;
                return (
                  <li
                    key={h.id}
                    className="flex items-center justify-between rounded px-2 py-1 text-xs"
                  >
                    <span>
                      <span className="font-medium">{label}</span>
                      {h.promoCode && (
                        <span className="ml-1 text-muted-foreground">
                          · code {h.promoCode}
                        </span>
                      )}
                      {h.featureName && (
                        <span className="ml-1 text-muted-foreground">
                          · {h.featureName}
                        </span>
                      )}
                    </span>
                    <span
                      className="text-muted-foreground"
                      title={new Date(h.sentAt).toLocaleString()}
                    >
                      {formatRelative(h.sentAt)}
                      {h.sentBy && ` · ${h.sentBy.name}`}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            {PRESETS.map((p) => {
              const selected = p.id === presetId;
              return (
                <div key={p.id}>
                  <button
                    type="button"
                    onClick={() => setPresetId(p.id)}
                    className={`w-full rounded-lg border p-3 text-left transition-colors ${
                      selected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    <p className="text-sm font-medium">{p.label}</p>
                    <p className="text-xs text-muted-foreground">{p.description}</p>
                  </button>
                  {selected && p.requiresPromoCode && (
                    <input
                      autoFocus
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Promo code (e.g. FOTNO20)"
                      className="mt-2 h-9 w-full rounded-md border border-border bg-background px-3 text-sm"
                    />
                  )}
                  {selected && p.requiresFeatureName && (
                    <input
                      autoFocus
                      type="text"
                      value={featureName}
                      onChange={(e) => setFeatureName(e.target.value)}
                      placeholder="Feature name (e.g. Smart Albums)"
                      className="mt-2 h-9 w-full rounded-md border border-border bg-background px-3 text-sm"
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="rounded-lg border border-border bg-muted/30 p-2">
            {!preset && (
              <p className="p-6 text-center text-sm text-muted-foreground">
                Pick a preset to preview the email.
              </p>
            )}
            {preset && !paramReady && (
              <p className="p-6 text-center text-sm text-muted-foreground">
                {preset.requiresPromoCode
                  ? "Enter a promo code to preview."
                  : "Enter a feature name to preview."}
              </p>
            )}
            {preset && paramReady && (
              <div className="flex h-full flex-col">
                <div className="px-2 pb-2 pt-1 text-xs text-muted-foreground">
                  Subject:{" "}
                  <span className="font-medium text-foreground">
                    {preview?.subject ?? "…"}
                  </span>
                </div>
                {previewError ? (
                  <p className="p-4 text-sm text-red-600">{previewError}</p>
                ) : (
                  <iframe
                    title="Email preview"
                    srcDoc={preview?.html ?? ""}
                    sandbox=""
                    className="h-[420px] w-full rounded border-0 bg-white"
                  />
                )}
                {isPreviewing && (
                  <p className="px-2 pt-1 text-xs text-muted-foreground">Updating preview…</p>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-md px-3 py-2 text-sm hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canSend}
            onClick={handleSend}
            className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSending ? "Sending…" : `Send to ${userEmail}`}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
