"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { betterFetch } from "@better-fetch/fetch";

const MAX_RETRIES = 3;
const RETRY_DELAY = 5000;

async function checkSubscriptionStatus(): Promise<boolean> {
  try {
    const { data: session } = await betterFetch<{
      user?: { subscribed?: boolean };
    }>("/api/auth/get-session", {
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      credentials: "include",
    });
    return !!session?.user?.subscribed;
  } catch (error) {
    console.error("Error checking subscription status:", error);
    return false;
  }
}

async function verifyPaymentWithRetry(): Promise<boolean> {
  for (let i = 0; i < MAX_RETRIES; i++) {
    const isSubscribed = await checkSubscriptionStatus();
    if (isSubscribed) {
      return true;
    }
    // Wait before next retry
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
  }
  return false;
}

export default function PaymentCallback() {
  const router = useRouter();

  useEffect(() => {
    const verifyPayment = async () => {
      const isVerified = await verifyPaymentWithRetry();
      if (isVerified) {
        router.replace("/");
      } else {
        router.replace("/onboarding");
      }
    };

    verifyPayment();
  }, [router]);

  return (
    <div className="min-h-screen bg-foreground flex items-center justify-center">
      <div className="bg-background p-8 rounded-lg shadow-lg text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">Verifying Payment</h2>
        <p className="text-muted-foreground">
          Please wait while we confirm your payment...
        </p>
      </div>
    </div>
  );
}
