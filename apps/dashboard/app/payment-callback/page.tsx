"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { jsonFetcher } from "@/lib/api/client";
import type { SubscriptionResponse } from "@/lib/types/api";

const MAX_RETRIES = 6;
const RETRY_DELAY = 5000;

async function checkSubscriptionStatus(): Promise<boolean> {
  try {
    const data = await jsonFetcher<SubscriptionResponse>(
      "/api/billing/subscription",
    );
    return data.access.status === "active";
  } catch {
    return false;
  }
}

async function verifyPaymentWithRetry(): Promise<boolean> {
  for (let i = 0; i < MAX_RETRIES; i++) {
    const isActive = await checkSubscriptionStatus();
    if (isActive) return true;
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
  }
  return false;
}

export default function PaymentCallback() {
  const router = useRouter();

  useEffect(() => {
    const verify = async () => {
      const isVerified = await verifyPaymentWithRetry();
      router.replace(isVerified ? "/" : "/billing");
    };
    verify();
  }, [router]);

  return (
    <div className="flex items-center justify-center py-20">
      <div className="rounded-lg bg-background p-8 text-center shadow-lg">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary" />
        <h2 className="mb-2 text-xl font-semibold">Verifying Payment</h2>
        <p className="text-muted-foreground">
          Please wait while we confirm your subscription...
        </p>
      </div>
    </div>
  );
}
