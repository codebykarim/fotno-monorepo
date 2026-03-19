"use client";

import { useState } from "react";
import useSWR from "swr";
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
import type { SubscriptionResponse, PlanTier } from "@/lib/types/api";

const FEATURES = [
  "Unlimited galleries",
  "Unlimited clients",
  "AI-powered captions",
  "Client favorites & selections",
  "Download tracking & analytics",
  "Password-protected galleries",
  "Custom gallery slugs",
  "Bulk upload with auto-retry",
  "Google Drive & Google Photos import",
  "Slideshow & social sharing",
];

const formatPrice = (cents: number) => `$${(cents / 100).toFixed(0)}`;

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cn(
        "h-5 w-5 flex-none fill-current stroke-current",
        className,
      )}
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
  const { data: plans } = useSWR<PlanTier[]>("/api/billing/plans", jsonFetcher);
  const { data: billing, mutate } = useSWR<SubscriptionResponse>(
    "/api/billing/subscription",
    jsonFetcher,
    { revalidateOnFocus: true },
  );

  const [loading, setLoading] = useState<number | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const access = billing?.access;
  const subscription = billing?.subscription;

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
      toast.success("Plan updated successfully!");
      await mutate();
    } catch {
      toast.error("Failed to change plan.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-10">
      {/* Page header */}
      <div>
        <h1 className="dashboard-title text-3xl font-semibold tracking-tight">
          Billing
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage your subscription and storage plan.
        </p>
      </div>

      {/* ── Current Status ─────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
        </CardHeader>
        <CardContent>
          {!access ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : access.status === "active" ||
            access.status === "cancelled_grace" ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  {access.status === "cancelled_grace"
                    ? "Cancelling"
                    : "Active"}
                </span>
                <span className="text-sm font-medium">
                  Fotno Pro &mdash;{" "}
                  {plans?.find((t) => t.gb === subscription?.storageTierGb)
                    ?.label ?? `${subscription?.storageTierGb} GB`}
                </span>
                <span className="text-sm text-muted-foreground">
                  {formatPrice(subscription?.priceCents ?? 0)}/mo
                </span>
              </div>
              {subscription?.currentPeriodEnd && (
                <p className="text-sm text-muted-foreground">
                  {access.status === "cancelled_grace"
                    ? "Access until"
                    : "Renews on"}{" "}
                  {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                </p>
              )}
              {access.status !== "cancelled_grace" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={cancelLoading}
                >
                  {cancelLoading ? "Cancelling..." : "Cancel Subscription"}
                </Button>
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

      {/* ── Storage Tiers — Landing-page style grid ────────────── */}
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          {access?.status === "active" ? "Change Plan" : "Choose Your Plan"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Every feature is included at every tier — only storage differs.
        </p>

        {!plans ? (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-44 animate-pulse rounded-2xl bg-muted"
              />
            ))}
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {plans.map((tier) => {
              const isCurrent =
                subscription?.storageTierGb === tier.gb &&
                (access?.status === "active" ||
                  access?.status === "cancelled_grace");
              const hasSubscription =
                access?.status === "active" ||
                access?.status === "cancelled_grace";
              const isPopular = tier.gb === 250 && !hasSubscription;
              const isLoading = loading === tier.gb;

              return (
                <div
                  key={tier.gb}
                  className={cn(
                    "relative flex flex-col items-center rounded-2xl px-4 py-6 text-center transition-all duration-300",
                    isCurrent
                      ? "bg-primary shadow-lg shadow-primary/20 ring-2 ring-primary"
                      : isPopular
                        ? "bg-primary shadow-xl shadow-primary/20 scale-[1.04]"
                        : "bg-card border border-border/50 hover:border-border hover:-translate-y-1",
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
                    {formatPrice(tier.priceCents)}
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
                      "mt-3 text-base font-semibold",
                      isCurrent || isPopular
                        ? "text-primary-foreground"
                        : "text-foreground",
                    )}
                  >
                    {tier.label}
                  </span>

                  <div className="mt-4 w-full">
                    {isCurrent ? (
                      <Button
                        disabled
                        size="sm"
                        variant="secondary"
                        className="w-full text-xs"
                      >
                        Current Plan
                      </Button>
                    ) : access?.status === "active" ? (
                      <Button
                        size="sm"
                        className="w-full text-xs"
                        variant={isPopular ? "secondary" : "default"}
                        onClick={() => handleChangeTier(tier.gb)}
                        disabled={isLoading}
                      >
                        {isLoading
                          ? "..."
                          : tier.gb > (subscription?.storageTierGb ?? 0)
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
                        {isLoading ? "..." : "Subscribe"}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Features list ──────────────────────────────────────── */}
      <div>
        <h3 className="text-center text-lg font-semibold text-foreground">
          Everything included with Fotno Pro
        </h3>
        <ul
          role="list"
          className="mt-6 grid grid-cols-1 gap-x-12 gap-y-3 text-sm text-muted-foreground sm:grid-cols-2 max-w-3xl mx-auto"
        >
          {FEATURES.map((feature) => (
            <li key={feature} className="flex items-center">
              <CheckIcon className="text-primary" />
              <span className="ml-3">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
