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
import type {
  SubscriptionResponse,
  PlanTier,
  ManualPlanRequestResponse,
} from "@/lib/types/api";

const TIERS: PlanTier[] = [
  { gb: 50, priceCents: 500, label: "50 GB" },
  { gb: 100, priceCents: 900, label: "100 GB" },
  { gb: 250, priceCents: 1900, label: "250 GB" },
  { gb: 500, priceCents: 3500, label: "500 GB" },
  { gb: 1000, priceCents: 5900, label: "1 TB" },
  { gb: 2000, priceCents: 9900, label: "2 TB" },
];

const formatPrice = (cents: number) => `$${(cents / 100).toFixed(0)}`;

export default function BillingPage() {
  const { data: billing, mutate } = useSWR<SubscriptionResponse>(
    "/api/billing/subscription",
    jsonFetcher,
    { revalidateOnFocus: true },
  );
  const { data: manualRequest, mutate: mutateManual } =
    useSWR<ManualPlanRequestResponse>(
      "/api/billing/get-manual-request",
      jsonFetcher,
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
    } catch (err) {
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleManualRequest = async (tier: PlanTier) => {
    setLoading(tier.gb);
    try {
      await apiRequest("/api/billing/manual-request", {
        method: "POST",
        body: JSON.stringify({ storageTierGb: tier.gb }),
      });
      toast.success("Plan request submitted! We'll review it shortly.");
      await mutateManual();
    } catch (err) {
      toast.error("Failed to submit request. You may already have a pending request.");
    } finally {
      setLoading(null);
    }
  };

  const handleCancel = async () => {
    setCancelLoading(true);
    try {
      await apiRequest("/api/billing/cancel", { method: "POST" });
      toast.success("Subscription cancelled. Access continues until the end of your billing period.");
      await mutate();
    } catch (err) {
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
    } catch (err) {
      toast.error("Failed to change plan.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="dashboard-title text-3xl font-semibold tracking-tight">
          Billing
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage your subscription and storage plan.
        </p>
      </div>

      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
        </CardHeader>
        <CardContent>
          {!access ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : access.status === "trial" ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-blue-500/15 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-400">
                  Free Trial
                </span>
                <span className="text-sm text-muted-foreground">
                  {access.trialDaysRemaining} day
                  {access.trialDaysRemaining !== 1 ? "s" : ""} remaining
                </span>
              </div>
              <p className="text-sm">
                You have full access during your trial. Subscribe to continue
                after it ends.
              </p>
            </div>
          ) : access.status === "active" || access.status === "cancelled_grace" ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  {access.status === "cancelled_grace" ? "Cancelling" : "Active"}
                </span>
                <span className="text-sm font-medium">
                  Fotno Pro &mdash;{" "}
                  {TIERS.find((t) => t.gb === subscription?.storageTierGb)
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
                Expired
              </span>
              <p className="text-sm">
                Your trial has ended. Subscribe to continue uploading and
                creating galleries.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending Manual Request */}
      {manualRequest && (
        <Card>
          <CardHeader>
            <CardTitle>Plan Request</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-blue-500/15 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-400">
                Pending Review
              </span>
              <span className="text-sm">
                {TIERS.find((t) => t.gb === manualRequest.storageTierGb)
                  ?.label ?? `${manualRequest.storageTierGb} GB`}{" "}
                plan requested on{" "}
                {new Date(manualRequest.createdAt).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Storage Tiers */}
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          {access?.status === "active" ? "Change Plan" : "Choose Your Plan"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          All plans include unlimited galleries, AI captions, client favorites,
          and download tracking.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TIERS.map((tier) => {
            const isCurrent =
              subscription?.storageTierGb === tier.gb &&
              (access?.status === "active" ||
                access?.status === "cancelled_grace");
            const isLoading = loading === tier.gb;

            return (
              <Card
                key={tier.gb}
                className={`relative ${isCurrent ? "border-primary ring-1 ring-primary" : ""}`}
              >
                {isCurrent && (
                  <span className="absolute -top-2.5 left-4 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                    Current
                  </span>
                )}
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div>
                      <p className="text-2xl font-bold">
                        {formatPrice(tier.priceCents)}
                        <span className="text-sm font-normal text-muted-foreground">
                          /mo
                        </span>
                      </p>
                      <p className="text-lg font-medium">{tier.label}</p>
                    </div>

                    {isCurrent ? (
                      <Button disabled size="sm" className="w-full">
                        Current Plan
                      </Button>
                    ) : access?.status === "active" ? (
                      <Button
                        size="sm"
                        className="w-full"
                        variant={
                          tier.gb > (subscription?.storageTierGb ?? 0)
                            ? "default"
                            : "outline"
                        }
                        onClick={() => handleChangeTier(tier.gb)}
                        disabled={isLoading}
                      >
                        {isLoading
                          ? "Updating..."
                          : tier.gb > (subscription?.storageTierGb ?? 0)
                            ? "Upgrade"
                            : "Downgrade"}
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => handleCheckout(tier)}
                          disabled={isLoading || !!manualRequest}
                        >
                          {isLoading ? "Loading..." : "Subscribe"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full"
                          onClick={() => handleManualRequest(tier)}
                          disabled={isLoading || !!manualRequest}
                        >
                          Pay via bank transfer
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
