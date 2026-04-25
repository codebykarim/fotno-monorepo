"use client";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const SIGNUP_CONVERSION = "AW-18119477393/CCfsCK-pvqIcEJGRhcBD";

export function fireSignupConversion(transactionId?: string) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }
  window.gtag("event", "conversion", {
    send_to: SIGNUP_CONVERSION,
    value: 1.0,
    currency: "EGP",
    transaction_id: transactionId ?? "",
  });
}
