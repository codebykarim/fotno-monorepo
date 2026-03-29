"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useTheme } from "next-themes";
import { PaymentForm } from "./payment-form";
import type { Appearance } from "@stripe/stripe-js";
import { trackEvent } from "../../lib/rybbit";

// Only load stripe outside of component render
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
  {
    developerTools: {
      assistant: { enabled: process.env.NODE_ENV === "development" },
    },
  },
);

interface StripeStepProps {
  plan: string;
  paymentSuccess?: boolean;
}

export function StripeStep({ plan, paymentSuccess }: StripeStepProps) {
  const [isSkipping, setIsSkipping] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoadingSecret, setIsLoadingSecret] = useState(!paymentSuccess);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const [displayPrice, setDisplayPrice] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  // Stripe Elements renders in an iframe — CSS variables from the host page
  // do NOT cascade into it. We must pass static color values.
  const stripeAppearance = useMemo<Appearance>(() => {
    const isDark = resolvedTheme === "dark";
    return {
      theme: isDark ? "night" : "stripe",
      variables: {
        colorPrimary: isDark ? "#dda040" : "#c87d2f",
        colorBackground: isDark ? "#1a1610" : "#faf9f7",
        colorText: isDark ? "#f5f3f0" : "#1a1610",
        colorDanger: "#ef4444",
        fontFamily: "system-ui, sans-serif",
        borderRadius: "0.625rem",
      },
    };
  }, [resolvedTheme]);

  useEffect(() => {
    trackEvent("stripe_step_viewed", { plan });
  }, [plan]);

  useEffect(() => {
    if (paymentSuccess) return;

    let isMounted = true;
    const fetchIntent = async () => {
      setIsLoadingSecret(true);
      try {
        const endpoint =
          plan === "Free"
            ? "/api/billing/create-setup-intent"
            : "/api/billing/create-subscription-intent";

        // Detect country for regional pricing:
        // 1. user_country cookie (set by landing page)
        // 2. Browser's Intl locale (e.g. "en-EG" → "EG")
        let countryCode: string | null = null;
        const cookieMatch = document.cookie.match(/user_country=([A-Z]{2})/);
        if (cookieMatch && cookieMatch[1]) {
          countryCode = cookieMatch[1];
        } else {
          try {
            const locale = Intl.DateTimeFormat().resolvedOptions().locale;
            const parts = locale.split("-");
            if (parts.length >= 2) {
              const lastPart = parts[parts.length - 1];
              if (lastPart && lastPart.length === 2) {
                countryCode = lastPart.toUpperCase();
              }
            }
          } catch {
            /* ignore */
          }
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body:
              plan === "Free"
                ? undefined
                : JSON.stringify({ tierLabel: plan, countryCode }),
          },
        );

        if (!response.ok) {
          const json = await response.json().catch(() => ({}));
          throw new Error(json.error || "Failed to initialize payment");
        }

        const json = await response.json();
        if (isMounted) {
          // If the backend auto-charged a saved card, subscription is already active
          if (json.data.status === "active") {
            trackEvent("subscription_started", { plan, method: "saved_card" });
            await completeOnboarding("subscribed");
            return;
          }
          setClientSecret(json.data.clientSecret);
          if (json.data.displayPrice?.formatted) {
            setDisplayPrice(json.data.displayPrice.formatted);
          }
        }
      } catch (err: any) {
        if (isMounted) {
          toast.error(err.message || "Failed to connect to billing service");
        }
      } finally {
        if (isMounted) {
          setIsLoadingSecret(false);
        }
      }
    };

    fetchIntent();

    return () => {
      isMounted = false;
    };
  }, [plan, paymentSuccess]);

  const completeOnboarding = async (outcome: "subscribed" | "free") => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/complete-onboarding`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        },
      );

      if (!response.ok) {
        toast.error("Failed to complete onboarding. Please try again.");
        return false;
      }

      toast.success("Welcome to FOTNO!");
      trackEvent("onboarding_completed", { outcome, plan });
      window.location.href =
        process.env.NEXT_PUBLIC_DASHBOARD_URL || "https://dashboard.fotno.com";
      return true;
    } catch {
      toast.error("Failed to complete setup. Please try again.");
      return false;
    }
  };

  const handleSkip = async () => {
    if (plan !== "Free" && !showSkipConfirm) {
      setShowSkipConfirm(true);
      return;
    }

    setIsSkipping(true);
    trackEvent("subscription_skipped", { originalPlan: plan });
    const success = await completeOnboarding("free");
    if (!success) {
      setIsSkipping(false);
      setShowSkipConfirm(false);
    }
  };

  const handlePaymentSuccess = async () => {
    if (plan === "Free") {
      trackEvent("card_saved", { plan });
      await completeOnboarding("free");
    } else {
      trackEvent("subscription_started", { plan });
      await completeOnboarding("subscribed");
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (paymentSuccess) {
      handlePaymentSuccess();
    }
  }, [paymentSuccess]);

  // If we just got a successful payment callback, we're transitioning
  // to the dashboard, so just show a loading screen entirely
  if (paymentSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-3 mt-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-foreground">
          Setting up your workspace...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        {plan === "Free" ? "Add a payment method" : "Set up your subscription"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        You selected the <strong>{plan}</strong> plan.
        {plan !== "Free" && displayPrice && (
          <>
            {" "}
            <strong>{displayPrice}/mo</strong>
          </>
        )}
      </p>

      {showSkipConfirm && (
        <div className="my-6 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 flex gap-3 text-amber-600 dark:text-amber-500">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">
              Are you sure you want to skip?
            </p>
            <p className="text-xs opacity-90">
              You&apos;ll start on the Free plan instead. You can always upgrade
              later from your dashboard.
            </p>
          </div>
        </div>
      )}

      {plan === "Free" && !showSkipConfirm && (
        <div className="my-6 rounded-lg border border-border bg-muted/50 p-5">
          <p className="text-sm text-foreground font-medium">
            Add a payment method (Optional)
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Save a card now for frictionless upgrades later.{" "}
            <strong>You will not be charged on the Free plan.</strong>
          </p>
        </div>
      )}

      <div className="mt-6 mb-2">
        {isLoadingSecret ? (
          <div className="flex flex-col items-center justify-center p-8 gap-3 border border-border rounded-lg bg-card mt-6">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Securely loading payment...
            </p>
          </div>
        ) : clientSecret ? (
          showSkipConfirm ? (
            <div className="flex flex-col gap-3 mt-6">
              <Button
                type="button"
                onClick={handleSkip}
                disabled={isSkipping}
                className="h-12 w-full border-none bg-amber-600 hover:bg-amber-700 text-white"
              >
                {isSkipping ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Yes, start on Free plan
              </Button>
              <Button
                type="button"
                onClick={() => setShowSkipConfirm(false)}
                disabled={isSkipping}
                variant="outline"
                className="h-12 w-full"
              >
                Go back to payment
              </Button>
            </div>
          ) : (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: stripeAppearance,
              }}
            >
              <PaymentForm
                plan={plan}
                mode={plan === "Free" ? "setup" : "payment"}
                onSuccess={handlePaymentSuccess}
                onSkipClick={handleSkip}
                displayPrice={displayPrice}
              />
            </Elements>
          )
        ) : (
          <div className="flex flex-col gap-3 mt-6">
            <p className="text-sm text-destructive font-medium mb-2">
              Unable to load payment methods right now.
            </p>
            <Button
              type="button"
              onClick={handleSkip}
              disabled={isSkipping || showSkipConfirm}
              variant="outline"
              className="h-12 w-full"
            >
              {isSkipping ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Skip for now
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
