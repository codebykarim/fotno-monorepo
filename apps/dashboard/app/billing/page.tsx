"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { motion } from "motion/react";
import { jsonFetcher, apiRequest } from "@/lib/api/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { toast } from "sonner";
import { cn } from "@workspace/ui/lib/utils";
import type {
  SubscriptionResponse,
  PlansResponse,
  PlanTier,
} from "@/lib/types/api";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/motion";
import { useRouter } from "next/navigation";

const FALLBACK_FEATURES = [
  "Unlimited galleries",
  "Unlimited clients",
  // "AI-powered captions",
  "Client favorites & selections",
  "Download tracking & analytics",
  "Password-protected galleries",
  "Custom gallery slugs",
  "Bulk upload with auto-retry",
  "Google Drive & Google Photos import",
  "Slideshow & social sharing",
];

const formatPrice = (cents: number, currency = "USD", locale = "en-US") => {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(cents / 100);
  } catch {
    return `$${(cents / 100).toFixed(0)}`;
  }
};

const formatTierPrice = (tier: PlanTier) => {
  if (tier.priceCents === 0) return "Free";
  return formatPrice(
    tier.localPriceCents ?? tier.priceCents,
    tier.currency ?? "USD",
    tier.locale ?? "en-US",
  );
};

const formatStorage = (gb: number) => {
  if (gb === -1) return "Unlimited";
  if (gb === 0) return "Free";
  if (gb >= 1000) return `${gb / 1000} TB`;
  return `${gb} GB`;
};

/** Convert storageLimitBytes (string from API) to human-readable GB */
const formatBytes = (bytes: string | undefined) => {
  if (!bytes || bytes === "0") return "0 GB";
  const gb = Number(BigInt(bytes) / BigInt(1024 ** 3));
  if (gb >= 1000) return `${(gb / 1000).toFixed(0)} TB`;
  return `${gb} GB`;
};

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cn("h-5 w-5 flex-none fill-current stroke-current", className)}
      viewBox="0 0 24 24"
    >
      <path
        d="M9.307 12.248a.75.75 0 1 0-1.114 1.004l1.114-1.004ZM11 15.25l-.557.502a.75.75 0 0 0 1.15-.043L11 15.25Zm4.844-5.041a.75.75 0 0 0-1.188-.918l1.188.918Zm-7.651 3.043 2.25 2.5 1.114-1.004-2.25-2.5-1.114 1.004Zm3.4 2.457 4.25-5.5-1.187-.918-4.25 5.5 1.188.918Z"
        strokeWidth={0}
      />
      <circle
        cx={12}
        cy={12}
        r={8.25}
        fill="none"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function BillingPage() {
  // Handle both formats: new { tiers, features } and legacy PlanTier[]
  const { data: plansData } = useSWR<PlansResponse | PlanTier[]>(
    "/api/billing/plans",
    jsonFetcher,
  );
  const plans = Array.isArray(plansData) ? plansData : plansData?.tiers;
  const paidPlans = plans?.filter((t) => t.priceCents > 0);
  const features =
    (Array.isArray(plansData) ? null : plansData?.features) ??
    FALLBACK_FEATURES;
  const { data: billing, mutate } = useSWR<SubscriptionResponse>(
    "/api/billing/subscription",
    jsonFetcher,
    { revalidateOnFocus: true },
  );

  const router = useRouter();

  const [loading, setLoading] = useState<number | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [access, setAccess] = useState(billing?.access);
  const [subscription, setSubscription] = useState(billing?.subscription);

  useEffect(() => {
    setAccess(billing?.access);
    setSubscription(billing?.subscription);
  }, [billing]);

  const handleCheckout = async (tier: PlanTier) => {
    setLoading(tier.gb);
    try {
      const result = await apiRequest<{ checkoutUrl: string }>(
        "/api/billing/checkout",
        {
          method: "POST",
          body: JSON.stringify({ storageTierGb: tier.gb }),
        },
      );
      window.location.href = result.checkoutUrl;
    } catch {
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleCancel = async () => {
    setCancelLoading(true);
    try {
      await apiRequest("/api/billing/cancel", { method: "POST" });
      toast.success(
        "Subscription cancelled. Access continues until the end of your billing period.",
      );
      await mutate();
    } catch {
      toast.error("Failed to cancel subscription.");
    } finally {
      setCancelLoading(false);
    }
  };

  const handleChangeTier = async (newGb: number) => {
    setLoading(newGb);
    try {
      await apiRequest("/api/billing/change-tier", {
        method: "PATCH",
        body: JSON.stringify({ newStorageTierGb: newGb }),
      });
      toast.success(
        newGb === subscription?.storageTierGb
          ? "Your plan will remain on your current tier."
          : "Plan change scheduled. Your new plan will take effect at the end of this billing period.",
      );
      await mutate();
      router.refresh();
    } catch {
      toast.error("Failed to change plan.");
    } finally {
      setLoading(null);
    }
  };

  const handleManageBilling = async () => {
    try {
      const result = await apiRequest<{ portalUrl: string }>(
        "/api/billing/portal",
        { method: "POST" },
      );
      window.open(result.portalUrl, "_blank");
    } catch {
      toast.error("Failed to open billing portal.");
    }
  };

  const isFree = access?.status === "free";
  const hasSubscription =
    access?.status === "active" || access?.status === "cancelled_grace";

  return (
    <div className="space-y-10">
      {/* Page header */}
      <motion.div
        initial={fadeInUp.initial}
        animate={fadeInUp.animate}
        transition={fadeInUp.transition}
      >
        <h1 className="dashboard-title text-3xl font-semibold tracking-tight">
          Billing
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage your subscription and storage plan.
        </p>
      </motion.div>

      {/* ── Current Status ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
          </CardHeader>
          <CardContent>
            {!access ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : isFree ? (
              <div className="space-y-2 flex flex-col md:flex-row items-center justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    Free Plan
                  </span>
                  <span className="text-sm font-medium">
                    {formatBytes(access.storageLimitBytes)} storage &mdash;{" "}
                    {access.galleryCount ?? 0}/{access.galleryLimit ?? 2}{" "}
                    galleries
                  </span>
                </div>
                {!access.canUpload && (
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    You&apos;re over your storage limit. Upgrade or remove files
                    to upload again.
                  </p>
                )}
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    document
                      .getElementById("paid-plans")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Upgrade
                </Button>
              </div>
            ) : access.status === "active" ||
              access.status === "cancelled_grace" ? (
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                      {access.status === "cancelled_grace"
                        ? "Cancelling"
                        : "Active"}
                    </span>
                    <span className="text-sm font-medium">
                      {paidPlans?.find(
                        (t) => t.gb === subscription?.storageTierGb,
                      )?.label ?? "Fotno Pro"}{" "}
                      &mdash; {formatStorage(subscription?.storageTierGb ?? 0)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {(() => {
                        const currentTier = paidPlans?.find(
                          (t) => t.gb === subscription?.storageTierGb,
                        );
                        return currentTier
                          ? formatTierPrice(currentTier)
                          : formatPrice(subscription?.priceCents ?? 0);
                      })()}
                      /mo
                    </span>
                  </div>
                  {subscription?.currentPeriodEnd && (
                    <p className="text-sm text-muted-foreground">
                      {access.status === "cancelled_grace"
                        ? "Access until"
                        : "Renews on"}{" "}
                      {new Date(
                        subscription.currentPeriodEnd,
                      ).toLocaleDateString()}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleManageBilling}
                    >
                      Manage Billing
                    </Button>
                    {access.status !== "cancelled_grace" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancel}
                        disabled={cancelLoading}
                      >
                        {cancelLoading
                          ? "Cancelling..."
                          : "Cancel Subscription"}
                      </Button>
                    )}
                  </div>
                </div>
                {subscription?.pendingDowngrade && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/30 dark:bg-amber-950/20">
                    <p className="text-sm text-amber-900 dark:text-amber-200">
                      <strong>Plan change pending:</strong> You'll switch to{" "}
                      <strong>{subscription.pendingDowngrade.tierLabel}</strong>{" "}
                      ({formatStorage(subscription.pendingDowngrade.tierGb)}){" "}
                      {subscription.pendingDowngrade.effectiveAt
                        ? `on ${new Date(subscription.pendingDowngrade.effectiveAt).toLocaleDateString()}`
                        : "at the end of your billing period"}
                      .
                    </p>
                  </div>
                )}
              </div>
            ) : access.status === "past_due" ? (
              <div className="space-y-2">
                <span className="inline-flex items-center rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                  Payment Failed
                </span>
                <p className="text-sm">
                  Your last payment failed. Please update your payment method to
                  keep your subscription active.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <span className="inline-flex items-center rounded-full bg-zinc-500/15 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:text-zinc-400">
                  No Plan
                </span>
                <p className="text-sm">
                  Choose a plan below to start uploading photos and creating
                  galleries.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Storage Tiers — Paid plans grid ────────────────────── */}
      <motion.div
        id="paid-plans"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative"
      >
        <div
          className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full opacity-15 blur-3xl"
          style={{ background: "oklch(0.78 0.14 65 / 0.25)" }}
          aria-hidden="true"
        />

        <h2 className="text-xl font-semibold tracking-tight">
          {hasSubscription ? "Change Plan" : "Upgrade to Pro"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Every feature is included at every tier — only storage differs.
          Unlimited galleries.
        </p>

        {!paidPlans ? (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-44 animate-pulse rounded-2xl bg-muted"
              />
            ))}
          </div>
        ) : (
          <motion.div
            className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(150px,1fr))]"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            {paidPlans.map((tier) => {
              const isCurrent =
                subscription?.storageTierGb === tier.gb && hasSubscription;
              const isPopular =
                (tier.label === "Professional" || tier.gb === 100) &&
                !hasSubscription;
              const isLoading = loading === tier.gb;

              return (
                <motion.div key={tier.gb} variants={staggerItem}>
                  <div
                    className={cn(
                      "relative flex flex-col items-center rounded-2xl px-4 py-6 text-center transition-all duration-300",
                      isCurrent
                        ? "bg-primary shadow-lg shadow-primary/20 ring-2 ring-primary"
                        : isPopular
                          ? "bg-primary shadow-xl shadow-primary/20 scale-[1.04]"
                          : "bg-card border border-border/50 hover:border-primary/20 hover:-translate-y-1",
                    )}
                  >
                    {isCurrent && (
                      <span className="absolute -top-3 rounded-full bg-background px-3 py-0.5 text-xs font-semibold text-foreground shadow-sm border border-border">
                        Current
                      </span>
                    )}
                    {isPopular && !isCurrent && (
                      <span className="absolute -top-3 rounded-full bg-background px-3 py-0.5 text-xs font-semibold text-foreground shadow-sm">
                        Popular
                      </span>
                    )}

                    <span
                      className={cn(
                        "text-3xl font-light tracking-tight",
                        isCurrent || isPopular
                          ? "text-primary-foreground"
                          : "text-foreground",
                      )}
                    >
                      {formatTierPrice(tier)}
                    </span>
                    <span
                      className={cn(
                        "mt-1 text-sm",
                        isCurrent || isPopular
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground",
                      )}
                    >
                      /month
                    </span>

                    <span
                      className={cn(
                        "mt-2 text-xs font-medium",
                        isCurrent || isPopular
                          ? "text-primary-foreground/80"
                          : "text-muted-foreground",
                      )}
                    >
                      {tier.label}
                    </span>
                    <span
                      className={cn(
                        "mt-1 text-base font-semibold",
                        isCurrent || isPopular
                          ? "text-primary-foreground"
                          : "text-foreground",
                      )}
                    >
                      {formatStorage(tier.gb)}
                    </span>

                    <div className="mt-4 w-full">
                      {isCurrent ? (
                        subscription?.pendingDowngrade ? (
                          <Button
                            size="sm"
                            className="w-full text-xs"
                            variant={"secondary"}
                            onClick={() => handleChangeTier(tier.gb)}
                            disabled={isLoading}
                          >
                            {isLoading ? "..." : "Return to Current Plan"}
                          </Button>
                        ) : (
                          <Button
                            disabled
                            size="sm"
                            variant="secondary"
                            className="w-full text-xs"
                          >
                            Current Plan
                          </Button>
                        )
                      ) : access?.status === "cancelled_grace" ? (
                        <Button
                          size="sm"
                          className="w-full text-xs"
                          variant={isPopular ? "secondary" : "outline"}
                          onClick={handleManageBilling}
                        >
                          Manage Billing
                        </Button>
                      ) : hasSubscription ? (
                        <Button
                          size="sm"
                          className="w-full text-xs"
                          variant={isPopular ? "secondary" : "default"}
                          onClick={() => handleChangeTier(tier.gb)}
                          disabled={isLoading}
                        >
                          {isLoading
                            ? "..."
                            : (tier.gb === -1 ? Infinity : tier.gb) >
                                (subscription?.storageTierGb === -1
                                  ? Infinity
                                  : (subscription?.storageTierGb ?? 0))
                              ? "Upgrade"
                              : "Downgrade"}
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant={isPopular ? "secondary" : "outline"}
                          className="w-full text-xs"
                          onClick={() => handleCheckout(tier)}
                          disabled={isLoading}
                        >
                          {isLoading ? "..." : "Upgrade"}
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </motion.div>

      {/* ── Features list ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="text-center text-lg font-semibold text-foreground">
          Everything included with Fotno Pro
        </h3>
        <ul
          role="list"
          className="mt-6 grid grid-cols-1 gap-x-12 gap-y-3 text-sm text-muted-foreground sm:grid-cols-2 max-w-3xl mx-auto"
        >
          {features.map((feature, index) => (
            <motion.li
              key={feature}
              className="flex items-center"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.04 }}
            >
              <CheckIcon className="text-primary" />
              <span className="ml-3">{feature}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
