"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Send, CheckCircle2, Loader2, CreditCard } from "lucide-react";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

interface PaymentInfo {
  clientSecret: string;
  amountCents: number;
  currency: string;
}

interface SubmitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  albumTitle: string;
  productName: string;
  pageCount: number;
  /** Called to submit the design. Returns payment info if INSIDE_FOTNO, undefined otherwise. */
  onConfirm: () => Promise<{ payment?: PaymentInfo } | void>;
  /** Called to confirm payment after Stripe Payment Element completes. */
  onConfirmPayment?: (paymentIntentId: string) => Promise<void>;
  onDone?: () => void;
}

// ─── Payment Form (inner component, rendered inside Elements) ─────────────────

function PaymentForm({
  amountCents,
  currency,
  onSuccess,
  onError,
}: {
  amountCents: number;
  currency: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (message: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [confirming, setConfirming] = useState(false);

  const formatAmount = (cents: number, cur: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: cur,
    }).format(cents / 100);
  };

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setConfirming(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: "if_required",
    });

    if (error) {
      onError(error.message ?? "Payment failed");
      setConfirming(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      onSuccess(paymentIntent.id);
    } else {
      onError(`Unexpected payment status: ${paymentIntent?.status}`);
      setConfirming(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border p-3 text-sm text-center font-medium">
        Total: {formatAmount(amountCents, currency)}
      </div>
      <PaymentElement />
      <Button onClick={handlePay} disabled={confirming || !stripe} className="w-full">
        {confirming ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing payment...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Pay and submit album
          </>
        )}
      </Button>
    </div>
  );
}

// ─── Main Submit Dialog ────────────────────────────────────────────────────────

export function SubmitDialog({
  open,
  onOpenChange,
  albumTitle,
  productName,
  pageCount,
  onConfirm,
  onConfirmPayment,
  onDone,
}: SubmitDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await onConfirm();
      if (result?.payment?.clientSecret) {
        // INSIDE_FOTNO: show payment form
        setPaymentInfo(result.payment);
      } else {
        // OUTSIDE_FOTNO: done
        setIsSuccess(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit album");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    setError(null);
    try {
      await onConfirmPayment?.(paymentIntentId);
      setIsSuccess(true);
      setPaymentInfo(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to confirm payment");
    }
  };

  const handlePaymentError = (message: string) => {
    setError(message);
  };

  const handleClose = () => {
    if (isSubmitting) return;
    // Don't allow closing while payment form is active (submission already created)
    if (paymentInfo) return;
    if (isSuccess && onDone) {
      onDone();
      return;
    }
    setIsSuccess(false);
    setError(null);
    onOpenChange(false);
  };

  if (isSuccess) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Album Submitted!
            </DialogTitle>
            <DialogDescription>
              Your album has been submitted to the photographer for review. You'll receive
              an email once they've reviewed it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleClose}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Payment step (INSIDE_FOTNO)
  if (paymentInfo) {
    if (!stripePromise) {
      return (
        <Dialog open={open} onOpenChange={() => {}}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Payment Configuration Error</DialogTitle>
              <DialogDescription>
                Payment processing is not configured. Please contact the photographer
                to resolve this issue.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );
    }

    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
            <DialogDescription>
              Enter your payment details to submit the album. Payment is processed
              securely through Stripe.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Elements
            stripe={stripePromise}
            options={{ clientSecret: paymentInfo.clientSecret }}
          >
            <PaymentForm
              amountCents={paymentInfo.amountCents}
              currency={paymentInfo.currency}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </Elements>
        </DialogContent>
      </Dialog>
    );
  }

  // Default: confirm submission step
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit Album for Review</DialogTitle>
          <DialogDescription>
            Once submitted, the album will be sent to the photographer for review. You
            won&apos;t be able to make changes until they respond.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div className="rounded-md border p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Album</span>
              <span className="font-medium">{albumTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Product</span>
              <span className="font-medium">{productName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pages</span>
              <span className="font-medium">{pageCount}</span>
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit for Review
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
