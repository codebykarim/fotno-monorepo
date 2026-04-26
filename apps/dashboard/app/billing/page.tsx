"use client";

import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { motion } from "motion/react";
import { jsonFetcher, apiRequest } from "@/lib/api/client";
import { Button } from "@workspace/ui/components/button";
import { toast } from "sonner";
import { cn } from "@workspace/ui/lib/utils";
import type {
  SubscriptionResponse,
  PlansResponse,
  PlanTier,
  BillingInterval,
} from "@/lib/types/api";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/motion";
import { useRouter } from "next/navigation";
import { featureLabel } from "@workspace/lib";

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

/** Display price + suffix for a tier at the chosen interval */
function tierDisplayPrice(tier: PlanTier, interval: BillingInterval) {
  if (tier.priceCents === 0) {
    return { price: "Free", suffix: "forever" };
  }

  // Regional/PPP pricing only applies to monthly today (annual prices are
  // configured directly on the Stripe side).
  if (interval === "monthly" && tier.localPriceCents != null) {
    return {
      price: formatPrice(
        tier.localPriceCents,
        tier.currency ?? "USD",
        tier.locale ?? "en-US",
      ),
      suffix: "/mo",
    };
  }

  if (interval === "annual" && tier.priceCentsAnnual != null) {
    return { price: formatPrice(tier.priceCentsAnnual), suffix: "/yr" };
  }

  return { price: formatPrice(tier.priceCents), suffix: "/mo" };
}

const formatStorage = (gb: number) => {
  if (gb === -1) return "Unlimited";
  if (gb === 0) return "Free";
  if (gb >= 1000) return `${gb / 1000} TB`;
  return `${gb} GB`;
};

const formatBytes = (bytes: string | undefined) => {
  if (!bytes || bytes === "0") return "0 GB";
  const gb = Number(BigInt(bytes) / BigInt(1024 ** 3));
  if (gb >= 1000) return `${(gb / 1000).toFixed(0)} TB`;
  return `${gb} GB`;
};

const ROMAN = ["I", "II", "III", "IV", "V", "VI"];

export default function BillingPage() {
  const { data: plansData } = useSWR<PlansResponse | PlanTier[]>(
    "/api/billing/plans",
    jsonFetcher,
  );
  const plans = Array.isArray(plansData) ? plansData : plansData?.tiers;
  const paidPlans = plans?.filter((t) => t.priceCents > 0);
  const { data: billing, mutate } = useSWR<SubscriptionResponse>(
    "/api/billing/subscription",
    jsonFetcher,
    { revalidateOnFocus: true },
  );

  const router = useRouter();

  const [interval, setInterval] = useState<BillingInterval>("monthly");
  const [loading, setLoading] = useState<number | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [access, setAccess] = useState(billing?.access);
  const [subscription, setSubscription] = useState(billing?.subscription);

  useEffect(() => {
    setAccess(billing?.access);
    setSubscription(billing?.subscription);
  }, [billing]);

  // Annual is only meaningful if at least one paid plan has it configured.
  const annualAvailable = useMemo(
    () => Boolean(paidPlans?.some((t) => t.hasAnnual)),
    [paidPlans],
  );

  const handleCheckout = async (tier: PlanTier) => {
    setLoading(tier.gb);
    try {
      const result = await apiRequest<{ checkoutUrl: string }>(
        "/api/billing/checkout",
        {
          method: "POST",
          body: JSON.stringify({
            storageTierGb: tier.gb,
            interval: tier.hasAnnual ? interval : "monthly",
          }),
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
        {!access ? (
          <div className="border border-foreground p-6">
            <p className="text-sm text-muted-foreground">Loading…</p>
          </div>
        ) : (
          (() => {
            // Resolve banner copy + status pill
            const isActive = access.status === "active";
            const isCancelling = access.status === "cancelled_grace";
            const isPastDue = access.status === "past_due";
            const isPaid = isActive || isCancelling;

            const planLabel = isFree
              ? "Free"
              : (plans?.find((t) => t.gb === subscription?.storageTierGb)
                  ?.label ?? "Fotno Pro");
            const storageGb = isFree
              ? formatBytes(access.storageLimitBytes)
              : formatStorage(subscription?.storageTierGb ?? 0);
            const galleryCount = access.galleryCount ?? 0;
            const galleryLimit = access.galleryLimit;
            const galleryLimitDisplay =
              galleryLimit == null
                ? `Unlimited`
                : `${galleryCount}/${galleryLimit}`;
            const enabledFeatures = access.features ?? [];

            const statusLabel = isFree
              ? "Free"
              : isCancelling
                ? "Cancelling"
                : isPastDue
                  ? "Past due"
                  : isActive
                    ? "Active"
                    : "No plan";
            const renewLabel =
              !isFree && subscription?.currentPeriodEnd
                ? `${
                    isCancelling ? "Access until" : "Renews on"
                  } ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`
                : null;

            return (
              <article className="relative border border-foreground bg-card">
                {/* Status pin (corner ribbon) */}
                <span
                  className={cn(
                    "absolute -right-px -top-6.5 z-10 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.22em]",
                    isPastDue
                      ? "bg-destructive text-background"
                      : "bg-primary text-primary-foreground",
                  )}
                >
                  {statusLabel}
                </span>

                {/* Plate header strip */}
                <header className="flex items-baseline justify-between border-b border-border px-6 py-3 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  <span>Current Plan</span>
                  <span>{storageGb}</span>
                </header>

                {/* Body */}
                <div className="grid grid-cols-1 gap-6 px-6 pb-4 pt-6 md:grid-cols-[1fr_auto] md:items-end">
                  <div className="flex flex-col gap-3">
                    <h3 className="font-serif text-[44px] font-normal leading-none tracking-tight text-foreground">
                      {planLabel}
                      <em className="italic text-muted-foreground">.</em>
                    </h3>
                    <dl className="flex flex-wrap gap-x-8 gap-y-2">
                      <div className="flex flex-col gap-0.5">
                        <dt className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                          Storage
                        </dt>
                        <dd className="text-sm font-medium text-foreground">
                          {storageGb}
                        </dd>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <dt className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                          Galleries
                        </dt>
                        <dd className="text-sm font-medium text-foreground">
                          {galleryLimitDisplay}
                        </dd>
                      </div>
                      {!isFree && (
                        <div className="flex flex-col gap-0.5">
                          <dt className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                            Price
                          </dt>
                          <dd className="text-sm font-medium text-foreground">
                            {formatPrice(subscription?.priceCents ?? 0)}
                          </dd>
                        </div>
                      )}
                      {renewLabel && (
                        <div className="flex flex-col gap-0.5">
                          <dt className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                            {isCancelling ? "Ends" : "Renews"}
                          </dt>
                          <dd className="text-sm font-medium text-foreground">
                            {renewLabel.replace(
                              /^(Renews on|Access until) /,
                              "",
                            )}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  {isPaid && (
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleManageBilling}
                      >
                        Manage Billing
                      </Button>
                      {!isCancelling && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancel}
                          disabled={cancelLoading}
                        >
                          {cancelLoading
                            ? "Cancelling…"
                            : "Cancel Subscription"}
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                {/* Features row */}
                {enabledFeatures.length > 0 && (
                  <div className="border-t border-border px-6 py-4">
                    <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                      What&apos;s included
                    </p>
                    <ul className="flex flex-wrap gap-x-6 gap-y-1.5">
                      {enabledFeatures.map((featureKey) => (
                        <li
                          key={featureKey}
                          className="flex items-start gap-2 text-[13px] leading-snug text-foreground"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-[5px] inline-block h-[9px] w-[9px] flex-none border border-foreground bg-foreground"
                          />
                          {featureLabel(featureKey)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Inline notices */}
                {isFree && !access.canUpload && (
                  <div className="border-t border-border bg-muted/40 px-6 py-3 text-sm text-foreground">
                    You&apos;re over your storage limit. Upgrade or remove files
                    to upload again.
                  </div>
                )}
                {isPastDue && (
                  <div className="border-t border-border bg-muted/40 px-6 py-3 text-sm text-foreground">
                    Your last payment failed. Update your payment method to keep
                    your subscription active.
                  </div>
                )}
                {!isFree && !isPaid && !isPastDue && (
                  <div className="border-t border-border bg-muted/40 px-6 py-3 text-sm text-muted-foreground">
                    Choose a plan below to start uploading photos and creating
                    galleries.
                  </div>
                )}
                {subscription?.pendingDowngrade && (
                  <div className="border-t border-border bg-muted/40 px-6 py-3 text-sm text-foreground">
                    <strong>Plan change pending:</strong> You&apos;ll switch to{" "}
                    <strong>{subscription.pendingDowngrade.tierLabel}</strong> (
                    {formatStorage(subscription.pendingDowngrade.tierGb)}){" "}
                    {subscription.pendingDowngrade.effectiveAt
                      ? `on ${new Date(subscription.pendingDowngrade.effectiveAt).toLocaleDateString()}`
                      : "at the end of your billing period"}
                    .
                  </div>
                )}
              </article>
            );
          })()
        )}
      </motion.div>

      {/* ── Plan Cards ────────────────────────────────────────── */}
      <motion.div
        id="paid-plans"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {!paidPlans ? (
          <>
            <h2 className="text-xl font-semibold tracking-tight">
              {hasSubscription ? "Change Plan" : "Choose a Plan"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Higher tiers unlock more features and storage. Pick the plan that
              fits your workflow.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-border">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[460px] animate-pulse bg-muted/30 border-r border-b border-border"
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">
                  {hasSubscription ? "Change Plan" : "Choose a Plan"}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Higher tiers unlock more features and storage.
                </p>
              </div>
              {annualAvailable && !hasSubscription && (
                <BillingIntervalToggle
                  value={interval}
                  onChange={setInterval}
                />
              )}
            </div>

            <motion.div
              className={cn(
                "mt-6 grid grid-cols-1 border-t border-l border-foreground sm:grid-cols-2",
                paidPlans.length >= 3 && "lg:grid-cols-3",
                paidPlans.length >= 4 && "xl:grid-cols-4",
              )}
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              {paidPlans.map((tier, index) => {
                const isCurrent =
                  subscription?.storageTierGb === tier.gb && hasSubscription;
                const isRecommended =
                  (tier.label === "Studio" || tier.gb === 150) &&
                  !hasSubscription;
                const isLoading = loading === tier.gb;
                const effectiveInterval: BillingInterval = tier.hasAnnual
                  ? interval
                  : "monthly";
                const display = tierDisplayPrice(tier, effectiveInterval);
                const enabledKeys = new Set(tier.features ?? []);
                const allFeatureKeys =
                  paidPlans[paidPlans.length - 1]?.features ?? [];
                const roman = ROMAN[index] ?? String(index + 1);

                let wasLabel: string | null = null;
                if (effectiveInterval === "annual") {
                  wasLabel = `${formatPrice(tier.priceCents * 12)}/yr`;
                }

                return (
                  <motion.div key={tier.gb} variants={staggerItem}>
                    <article
                      className={cn(
                        "relative flex h-full flex-col gap-4 border-r border-b border-foreground p-6 transition-colors",
                        isRecommended
                          ? "bg-foreground text-background"
                          : "bg-card hover:bg-muted/40",
                        isCurrent &&
                          !isRecommended &&
                          "ring-2 ring-primary ring-inset",
                      )}
                    >
                      {isRecommended && (
                        <span className="absolute -right-px -top-px z-10 bg-primary px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-primary-foreground">
                          Most chosen
                        </span>
                      )}
                      {isCurrent && (
                        <span className="absolute -right-px -top-px z-10 bg-primary px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-primary-foreground">
                          Current
                        </span>
                      )}

                      {/* Plate header */}
                      <header
                        className={cn(
                          "flex items-baseline justify-between text-[10px] font-medium uppercase tracking-[0.2em]",
                          isRecommended
                            ? "text-background/60"
                            : "text-muted-foreground",
                        )}
                      >
                        <span>Plan</span>
                        <span
                          className={cn(
                            "font-serif text-3xl italic font-normal leading-none normal-case tracking-tight",
                            isRecommended
                              ? "text-background"
                              : "text-foreground",
                          )}
                        >
                          {roman}
                        </span>
                        <span>{formatStorage(tier.gb)}</span>
                      </header>

                      {/* Tier name */}
                      <div>
                        <h3
                          className={cn(
                            "font-serif text-[34px] font-normal leading-none tracking-tight",
                            isRecommended
                              ? "text-background"
                              : "text-foreground",
                          )}
                        >
                          {tier.label}
                          <em
                            className={cn(
                              "italic",
                              isRecommended
                                ? "text-background/60"
                                : "text-muted-foreground",
                            )}
                          >
                            .
                          </em>
                        </h3>
                      </div>

                      {/* Price */}
                      <div className="flex flex-col gap-1">
                        {wasLabel && (
                          <span
                            className={cn(
                              "text-[10px] font-medium uppercase tracking-[0.18em] line-through",
                              isRecommended
                                ? "text-background/50"
                                : "text-muted-foreground",
                            )}
                          >
                            {wasLabel}
                          </span>
                        )}
                        <div className="flex items-baseline gap-1.5">
                          <span
                            className={cn(
                              "font-serif text-[64px] font-normal leading-none tracking-tight [font-feature-settings:'tnum']",
                              isRecommended
                                ? "text-background"
                                : "text-foreground",
                            )}
                          >
                            {display.price}
                          </span>
                          <span
                            className={cn(
                              "text-[10px] font-medium uppercase tracking-[0.18em]",
                              isRecommended
                                ? "text-background/60"
                                : "text-muted-foreground",
                            )}
                          >
                            {effectiveInterval === "annual"
                              ? "per year"
                              : "per month"}
                          </span>
                        </div>
                      </div>

                      {/* Hairline rule */}
                      <div
                        className={cn(
                          "h-px",
                          isRecommended ? "bg-background/20" : "bg-border",
                        )}
                      />

                      {/* Features */}
                      <ul className="flex-1 space-y-2">
                        {allFeatureKeys.map((featureKey) => {
                          const on = enabledKeys.has(featureKey);
                          return (
                            <li
                              key={featureKey}
                              className={cn(
                                "flex items-start gap-2.5 text-[13px] leading-snug",
                                on
                                  ? isRecommended
                                    ? "text-background"
                                    : "text-foreground"
                                  : isRecommended
                                    ? "text-background/40 line-through"
                                    : "text-muted-foreground/60 line-through",
                              )}
                            >
                              <span
                                aria-hidden="true"
                                className={cn(
                                  "mt-[5px] inline-block h-[9px] w-[9px] flex-none border",
                                  isRecommended
                                    ? "border-background"
                                    : "border-foreground",
                                  on
                                    ? isRecommended
                                      ? "bg-background"
                                      : "bg-foreground"
                                    : "bg-transparent",
                                )}
                              />
                              {featureLabel(featureKey)}
                            </li>
                          );
                        })}
                      </ul>

                      {/* CTA */}
                      <div className="mt-2">
                        {isCurrent ? (
                          subscription?.pendingDowngrade ? (
                            <Button
                              size="sm"
                              className="w-full"
                              variant={isRecommended ? "secondary" : "default"}
                              onClick={() => handleChangeTier(tier.gb)}
                              disabled={isLoading}
                            >
                              {isLoading ? "..." : "Return to Current Plan"}
                            </Button>
                          ) : (
                            <Button
                              disabled
                              size="sm"
                              variant={isRecommended ? "secondary" : "outline"}
                              className="w-full"
                            >
                              Current Plan
                            </Button>
                          )
                        ) : access?.status === "cancelled_grace" ? (
                          <Button
                            size="sm"
                            className="w-full"
                            variant={isRecommended ? "secondary" : "outline"}
                            onClick={handleManageBilling}
                          >
                            Manage Billing
                          </Button>
                        ) : hasSubscription ? (
                          <Button
                            size="sm"
                            className="w-full"
                            variant={isRecommended ? "secondary" : "default"}
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
                            variant={isRecommended ? "secondary" : "default"}
                            className="w-full"
                            onClick={() => handleCheckout(tier)}
                            disabled={isLoading}
                          >
                            {isLoading ? "..." : `Choose ${tier.label}`}
                          </Button>
                        )}
                      </div>
                    </article>
                  </motion.div>
                );
              })}
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}

function BillingIntervalToggle({
  value,
  onChange,
}: {
  value: BillingInterval;
  onChange: (v: BillingInterval) => void;
}) {
  return (
    <div className="inline-flex items-center gap-3">
      <div className="relative inline-flex border border-foreground bg-background">
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-0 w-1/2 bg-foreground transition-transform duration-[450ms] ease-[cubic-bezier(0.65,0.05,0.36,1)]",
            value === "annual" ? "translate-x-full" : "translate-x-0",
          )}
        />
        {(["monthly", "annual"] as const).map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={cn(
              "relative z-10 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.2em] transition-colors",
              value === opt
                ? "text-background"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {opt}
          </button>
        ))}
      </div>
      <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-primary">
        Save 2 months on annual
      </span>
    </div>
  );
}
