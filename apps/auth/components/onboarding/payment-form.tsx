"use client";

import { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

interface PaymentFormProps {
  plan: string;
  interval?: "monthly" | "annual";
  mode?: "payment" | "setup";
  onSuccess: () => void | Promise<void>;
  onSkipClick: () => void;
  displayPrice?: string | null;
}

export function PaymentForm({
  plan,
  interval = "monthly",
  mode = "payment",
  onSuccess,
  onSkipClick,
  displayPrice,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    // return_url is required for cards that trigger redirect-based 3D Secure.
    // On return, the onboarding page server component will detect the session
    // and resume at the stripe step, where completeOnboarding runs automatically.
    const returnUrl = `${window.location.origin}/onboarding?plan=${encodeURIComponent(plan)}&interval=${interval}&step=stripe&payment_status=success`;

    let errorMsg: string | undefined;
    let paymentSuccessStatus: boolean | undefined;

    if (mode === "setup") {
      const { error, setupIntent } = await stripe.confirmSetup({
        elements,
        redirect: "if_required",
        confirmParams: {
          return_url: returnUrl,
        },
      });
      errorMsg = error?.message;
      if (setupIntent?.status === "succeeded" && setupIntent.payment_method) {
        // Set this card as the customer's default for frictionless upgrades
        try {
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/billing/set-default-payment-method`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ paymentMethodId: setupIntent.payment_method }),
            }
          );
        } catch {
          // Non-critical — card is still saved, just won't auto-default
        }
      }
      paymentSuccessStatus = setupIntent?.status === "succeeded";
    } else {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
        confirmParams: {
          return_url: returnUrl,
        },
      });
      errorMsg = error?.message;
      console.log("[PaymentForm] confirmPayment result:", { status: paymentIntent?.status, error: error?.message });
      paymentSuccessStatus =
        paymentIntent?.status === "succeeded" ||
        paymentIntent?.status === "processing" ||
        paymentIntent?.status === "requires_capture";
    }

    if (errorMsg) {
      toast.error(errorMsg || "Payment failed. Please try again.");
      setIsProcessing(false);
      return;
    }

    if (paymentSuccessStatus) {
      await onSuccess();
    } else {
      toast.error("Payment not completed. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full mt-2">
      <PaymentElement />
      
      <div className="flex flex-col gap-3 mt-2">
        <Button
          type="submit"
          disabled={isProcessing || !stripe || !elements}
          className="h-12 w-full auth-cta text-primary-foreground"
        >
          {isProcessing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {mode === "setup"
            ? "Save card & Start Free Plan"
            : `Subscribe to ${plan}${
                displayPrice
                  ? ` — ${displayPrice}${interval === "annual" ? "/yr" : "/mo"}`
                  : ""
              }`}
        </Button>
        <Button
          type="button"
          onClick={onSkipClick}
          disabled={isProcessing}
          variant={mode === "setup" ? "ghost" : "outline"}
          className={`h-12 w-full ${mode === "setup" ? "text-muted-foreground hover:text-foreground text-sm" : ""}`}
        >
          Skip for now
        </Button>
      </div>
    </form>
  );
}
