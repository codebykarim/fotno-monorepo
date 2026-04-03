"use client";

import { useState } from "react";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { apiRequest } from "@/lib/api/client";

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
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  VERIFIED: {
    icon: CheckCircle2,
    label: "Verified",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  FAILED: {
    icon: AlertCircle,
    label: "Verification Failed",
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
};

export function DomainSettings({ data, mutate }: Props) {
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

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold">Custom Domain</h3>
        <p className="text-sm text-muted-foreground">
          Use your own domain for gallery sharing instead of gallery.fotno.com.
        </p>
      </div>

      {data ? (
        <>
          {/* Current domain info */}
          <section className="space-y-4 rounded-xl border border-border/60 bg-card p-5">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">{data.domain}</h4>
              {(() => {
                const cfg = STATUS_CONFIG[data.status];
                const Icon = cfg.icon;
                return (
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${cfg.bg} ${cfg.color}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {cfg.label}
                  </span>
                );
              })()}
            </div>

            {data.status !== "VERIFIED" && (
              <div className="space-y-3 rounded-lg border border-border/40 bg-muted/50 p-4">
                <p className="text-xs font-medium">
                  Configure these DNS records at your domain registrar:
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-3 text-xs">
                    <span className="w-12 shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono font-medium">
                      CNAME
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-muted-foreground">
                        Point <strong>{data.domain}</strong> to:
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <code className="rounded bg-muted px-2 py-0.5 text-foreground">
                          gallery.fotno.com
                        </code>
                        <button
                          type="button"
                          onClick={() => copyToClipboard("gallery.fotno.com")}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-xs">
                    <span className="w-12 shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono font-medium">
                      TXT
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-muted-foreground">
                        Add a TXT record at{" "}
                        <strong>_fotno-verify.{data.domain}</strong> with value:
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <code className="rounded bg-muted px-2 py-0.5 text-foreground break-all">
                          {data.verificationToken}
                        </code>
                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(data.verificationToken)
                          }
                          className="shrink-0 text-muted-foreground hover:text-foreground"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          <div className="flex gap-3">
            {data.status !== "VERIFIED" && (
              <Button onClick={onVerify} disabled={verifying}>
                {verifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Verifying...
                  </>
                ) : (
                  "Verify Domain"
                )}
              </Button>
            )}
            <Button
              variant="destructive"
              onClick={onRemove}
              disabled={removing}
            >
              {removing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Remove Domain
            </Button>
          </div>
        </>
      ) : (
        <>
          <section className="space-y-4 rounded-xl border border-border/60 bg-card p-5">
            <h4 className="text-sm font-medium">Set Up Custom Domain</h4>
            <div className="space-y-1.5">
              <Label htmlFor="domain-input" className="text-xs">
                Domain
              </Label>
              <Input
                id="domain-input"
                placeholder="gallery.yourdomain.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
              />
              <p className="text-[10px] text-muted-foreground">
                Enter the domain you want to use for sharing galleries.
              </p>
            </div>
          </section>

          <Button
            onClick={onSetDomain}
            disabled={saving || !domain.trim()}
            className="w-full sm:w-auto"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Setting
                up...
              </>
            ) : (
              "Set Domain"
            )}
          </Button>
        </>
      )}
    </div>
  );
}
