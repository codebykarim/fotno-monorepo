"use client";

import { useState } from "react";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  Copy,
  Globe,
  RefreshCw,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { apiRequest } from "@/lib/api/client";
import { useHasFeature } from "@/lib/hooks/use-features";
import { LockedPage } from "@/components/dashboard/feature-gate";

type DomainData = {
  id: string;
  domain: string;
  status: "PENDING" | "VERIFIED" | "FAILED";
  verificationToken: string;
  verifiedAt: string | null;
  createdAt: string;
} | null;

type Props = {
  data: DomainData;
  mutate: () => void;
};

const STATUS_CONFIG = {
  PENDING: {
    icon: Clock,
    label: "Pending Verification",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    border: "border-amber-200 dark:border-amber-800/50",
  },
  VERIFIED: {
    icon: CheckCircle2,
    label: "Verified",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    border: "border-emerald-200 dark:border-emerald-800/50",
  },
  FAILED: {
    icon: AlertCircle,
    label: "Verification Failed",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950/40",
    border: "border-red-200 dark:border-red-800/50",
  },
};

export function DomainSettings({ data, mutate }: Props) {
  const hasCustomDomains = useHasFeature("CUSTOM_DOMAINS");
  const [domain, setDomain] = useState("");
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [removing, setRemoving] = useState(false);

  async function onSetDomain() {
    if (!domain.trim()) {
      toast.error("Domain is required");
      return;
    }
    setSaving(true);
    try {
      await apiRequest("/api/settings/domain", {
        method: "POST",
        body: JSON.stringify({ domain }),
      });
      setDomain("");
      mutate();
      toast.success("Domain configured. Please set up DNS records.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to set domain",
      );
    } finally {
      setSaving(false);
    }
  }

  async function onVerify() {
    setVerifying(true);
    try {
      await apiRequest("/api/settings/domain/verify", { method: "POST" });
      mutate();
      toast.success("Domain verified successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Verification failed",
      );
    } finally {
      setVerifying(false);
    }
  }

  async function onRemove() {
    setRemoving(true);
    try {
      await apiRequest("/api/settings/domain", { method: "DELETE" });
      mutate();
      toast.success("Custom domain removed");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to remove domain",
      );
    } finally {
      setRemoving(false);
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  }

  if (!hasCustomDomains) {
    return (
      <LockedPage
        featureKey="CUSTOM_DOMAINS"
        title="Custom Domain"
        description="Use your own domain for gallery sharing instead of gallery.fotno.com."
      />
    );
  }

  // ── Domain is configured ──
  if (data) {
    const cfg = STATUS_CONFIG[data.status];
    const StatusIcon = cfg.icon;

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-base font-semibold">Custom Domain</h3>
          <p className="text-sm text-muted-foreground">
            Use your own domain for gallery sharing instead of
            gallery.fotno.com.
          </p>
        </div>

        {/* Status card */}
        <section className={`rounded-xl border p-5 ${cfg.border} ${cfg.bg}`}>
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${cfg.bg} ${cfg.color}`}
            >
              <StatusIcon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold">{data.domain}</h4>
                {data.status === "VERIFIED" && (
                  <a
                    href={`https://${data.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
              <p className={`text-xs ${cfg.color}`}>{cfg.label}</p>
            </div>
          </div>

          {data.status === "VERIFIED" && (
            <p className="mt-3 text-xs text-muted-foreground">
              Your galleries are now accessible at{" "}
              <strong className="text-foreground">{data.domain}</strong>. All
              share links use this domain.
            </p>
          )}
        </section>

        {/* DNS setup instructions — only when not verified */}
        {data.status !== "VERIFIED" && (
          <section className="space-y-4 rounded-xl border border-border/60 bg-card p-5">
            <h4 className="text-sm font-medium">DNS Configuration</h4>

            <p className="text-xs text-muted-foreground">
              Add these DNS records at your domain registrar. Changes can take
              up to 48 hours to propagate.
            </p>

            {/* DNS records table */}
            <div className="overflow-hidden rounded-lg border border-border/40">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/40 bg-muted/50">
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                      Type
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                      Name
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                      Value
                    </th>
                    <th className="w-10 px-3 py-2" />
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/40">
                    <td className="px-3 py-2.5">
                      <span className="rounded bg-blue-100 px-1.5 py-0.5 font-mono font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        CNAME
                      </span>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-foreground flex space-x-5">
                      <p>{data.domain}</p>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(data.domain)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-foreground">
                      gallery.fotno.com
                    </td>
                    <td className="px-3 py-2.5">
                      <button
                        type="button"
                        onClick={() => copyToClipboard("gallery.fotno.com")}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2.5">
                      <span className="rounded bg-purple-100 px-1.5 py-0.5 font-mono font-medium text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                        TXT
                      </span>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-foreground flex space-x-5">
                      <p>_fotno-verify.{data.domain}</p>
                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(`_fotno-verify.${data.domain}`)
                        }
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </td>
                    <td className="max-w-[200px] truncate px-3 py-2.5 font-mono text-foreground">
                      {data.verificationToken}
                    </td>
                    <td className="px-3 py-2.5">
                      <button
                        type="button"
                        onClick={() => copyToClipboard(data.verificationToken)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {data.status === "FAILED" && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800 dark:border-red-800/50 dark:bg-red-950/30 dark:text-red-300">
                DNS verification failed. Please check your records and try
                again. Changes can take up to 48 hours to propagate.
              </div>
            )}
          </section>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {data.status !== "VERIFIED" && (
            <Button onClick={onVerify} disabled={verifying} className="gap-1.5">
              {verifying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {verifying ? "Verifying..." : "Verify Domain"}
            </Button>
          )}
          <Button
            variant="outline"
            onClick={onRemove}
            disabled={removing}
            className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            {removing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Remove Domain
          </Button>
        </div>
      </div>
    );
  }

  // ── No domain configured ──
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold">Custom Domain</h3>
        <p className="text-sm text-muted-foreground">
          Use your own domain for gallery sharing instead of gallery.fotno.com.
        </p>
      </div>

      <section className="space-y-4 rounded-xl border border-border/60 bg-card p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-medium">Set Up Custom Domain</h4>
            <p className="text-xs text-muted-foreground">
              Your galleries will be accessible at your own domain.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="domain-input" className="text-xs">
            Domain
          </Label>
          <div className="flex gap-2">
            <Input
              id="domain-input"
              placeholder="gallery.yourdomain.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            />
            <Button
              onClick={onSetDomain}
              disabled={saving || !domain.trim()}
              className="shrink-0 gap-1.5"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
              {saving ? "Setting up..." : "Continue"}
            </Button>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Enter a subdomain (e.g. photos.yourdomain.com) or apex domain.
          </p>
        </div>
      </section>
    </div>
  );
}
