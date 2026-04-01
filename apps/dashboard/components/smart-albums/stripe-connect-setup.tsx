"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@workspace/ui/components/button";
import {
  CheckCircle2,
  ExternalLink,
  Loader2,
  AlertCircle,
  Unlink,
} from "lucide-react";
import Image from "next/image";

interface ConnectStatus {
  connected: boolean;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
}

interface StripeConnectSetupProps {
  onStatusChange?: (fullyOnboarded: boolean) => void;
}

function StripeLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 60 25"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a12.3 12.3 0 0 1-4.56.85c-4.05 0-6.83-2.11-6.83-7.14 0-4.17 2.28-7.2 6.25-7.2 3.78 0 5.99 2.73 5.99 7.15 0 .5-.04 1.13-.04 1.42zM53.7 9.13c0-1.37.74-2.88 2.4-2.88 1.73 0 2.27 1.57 2.27 2.88H53.7zm-8.65 9.75h4.15V.45h-4.15v18.43zm-4.3-13.17h-.07c-.73-.87-1.83-1.35-3.32-1.35-3.32 0-6.17 2.98-6.17 7.14s2.73 7.01 6.04 7.01c1.54 0 2.67-.53 3.45-1.42h.1l.18 1.23h3.67V.45h-4.14v5.26h.26zm0 7.47c0 .2-.01.38-.04.55-.26 1.2-1.2 2.01-2.34 2.01-1.64 0-2.73-1.37-2.73-3.58 0-2.08 1.02-3.7 2.76-3.7 1.2 0 2.08.82 2.31 2.01.03.2.04.44.04.62v2.09zm-13.86-.44c0 3.9-2.73 5.64-5.36 5.64-2.89 0-5.24-2.11-5.24-5.51 0-3.58 2.4-5.64 5.42-5.64 3.08 0 5.18 2.17 5.18 5.51zm-6.44 0c0-1.48.5-3.39 2.27-3.39s2.27 1.84 2.27 3.39c0 1.42-.5 3.39-2.27 3.39s-2.27-1.97-2.27-3.39zm-5.3-7.01h-.07c-.73-.87-1.83-1.35-3.32-1.35-3.32 0-6.17 2.98-6.17 7.14s2.73 7.01 6.04 7.01c1.54 0 2.67-.53 3.45-1.42h.1l.18 1.23H19V.45h-4.14v5.26h.33zm0 7.47c0 .2-.01.38-.04.55-.26 1.2-1.2 2.01-2.34 2.01-1.64 0-2.73-1.37-2.73-3.58 0-2.08 1.02-3.7 2.76-3.7 1.2 0 2.08.82 2.31 2.01.03.2.04.44.04.62v2.09zM6.24 5.72c0-.75.62-1.05 1.64-1.05 1.47 0 3.32.44 4.79 1.23V2.24A12.84 12.84 0 0 0 7.88.94C4.56.94 2.22 2.72 2.22 5.9c0 4.92 6.77 4.12 6.77 6.24 0 .88-.77 1.17-1.84 1.17-1.6 0-3.64-.66-5.24-1.54v3.72a13.33 13.33 0 0 0 5.24 1.11c3.39 0 5.73-1.67 5.73-4.92-.06-5.32-6.64-4.36-6.64-6.36z" />
    </svg>
  );
}

function StatusDot({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-block h-2 w-2 rounded-full ${active ? "bg-[#00d924]" : "bg-white/30"}`}
    />
  );
}

export function StripeConnectSetup({
  onStatusChange,
}: StripeConnectSetupProps) {
  const [status, setStatus] = useState<ConnectStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboarding, setOnboarding] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [confirmDisconnect, setConfirmDisconnect] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const onStatusChangeRef = useRef(onStatusChange);
  onStatusChangeRef.current = onStatusChange;

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/smart-albums/connect/status");
        if (!res.ok) throw new Error("Failed to fetch Connect status");
        const data: ConnectStatus = await res.json();
        setStatus(data);
        onStatusChangeRef.current?.(data.chargesEnabled && data.payoutsEnabled);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const handleOnboard = async () => {
    setOnboarding(true);
    setError(null);
    try {
      const res = await fetch("/api/smart-albums/connect/onboard", {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to start onboarding");
      const data = await res.json();
      if (data.onboardingUrl) {
        window.location.href = data.onboardingUrl;
      }
    } catch (err: any) {
      setError(err.message);
      setOnboarding(false);
    }
  };

  const handleDisconnect = async () => {
    setDisconnecting(true);
    setError(null);
    try {
      const res = await fetch("/api/smart-albums/connect/disconnect", {
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to disconnect");
      }
      setStatus({
        connected: false,
        chargesEnabled: false,
        payoutsEnabled: false,
      });
      setConfirmDisconnect(false);
      onStatusChangeRef.current?.(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDisconnecting(false);
    }
  };

  const fullyOnboarded = status?.chargesEnabled && status?.payoutsEnabled;
  const canDisconnect = status?.connected;

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Checking Stripe Connect status...
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl bg-gradient-to-br from-[#635bff] to-[#4b45c6] text-white shadow-lg">
      {/* Header */}
      <div className="px-6 pt-5 pb-4">
        <div className="flex items-center gap-2.5 mb-1">
          <Image src="/stripe.svg" alt="Stripe Logo" width={32} height={32} />
          <span className="text-sm font-semibold tracking-wide text-white/70">
            Connect
          </span>
        </div>
        <p className="text-sm text-white/60 mt-1">
          Accept payments through Fotno. Clients pay securely and funds are
          transferred to your Stripe account.
        </p>
      </div>

      {/* Body */}
      <div className="px-6 pb-5 space-y-4">
        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-500/20 border border-red-400/30 px-3 py-2.5 text-sm text-red-100">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Status rows */}
        <div className="rounded-lg bg-white/10 backdrop-blur-sm divide-y divide-white/10">
          <div className="flex items-center justify-between px-4 py-2.5 text-sm">
            <span className="text-white/70">Account connected</span>
            <div className="flex items-center gap-2">
              <StatusDot active={!!status?.connected} />
              <span
                className={
                  status?.connected
                    ? "text-[#b9ffc5] font-medium"
                    : "text-white/40"
                }
              >
                {status?.connected ? "Connected" : "Not connected"}
              </span>
            </div>
          </div>

          {status?.connected && (
            <>
              <div className="flex items-center justify-between px-4 py-2.5 text-sm">
                <span className="text-white/70">Charges enabled</span>
                <div className="flex items-center gap-2">
                  <StatusDot active={status.chargesEnabled} />
                  <span
                    className={
                      status.chargesEnabled
                        ? "text-[#b9ffc5] font-medium"
                        : "text-white/40"
                    }
                  >
                    {status.chargesEnabled ? "Enabled" : "Pending"}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between px-4 py-2.5 text-sm">
                <span className="text-white/70">Payouts enabled</span>
                <div className="flex items-center gap-2">
                  <StatusDot active={status.payoutsEnabled} />
                  <span
                    className={
                      status.payoutsEnabled
                        ? "text-[#b9ffc5] font-medium"
                        : "text-white/40"
                    }
                  >
                    {status.payoutsEnabled ? "Enabled" : "Pending"}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        {fullyOnboarded ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 rounded-lg bg-[#00d924]/15 border border-[#00d924]/30 px-4 py-2.5">
              <CheckCircle2 className="h-4 w-4 text-[#b9ffc5]" />
              <span className="text-sm font-medium text-[#b9ffc5]">
                Ready to accept payments
              </span>
            </div>
            <a
              href="https://dashboard.stripe.com/connect/accounts/overview"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white/80 transition-colors"
            >
              View earnings in Stripe dashboard
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        ) : (
          <button
            onClick={handleOnboard}
            disabled={onboarding}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-[#635bff] shadow-sm hover:bg-white/90 transition-colors disabled:opacity-60"
          >
            {onboarding && <Loader2 className="h-4 w-4 animate-spin" />}
            {status?.connected
              ? "Continue onboarding"
              : "Connect Stripe account"}
          </button>
        )}

        {/* Disconnect */}
        {canDisconnect && (
          <div className="border-t border-white/10 pt-3">
            {confirmDisconnect ? (
              <div className="space-y-3">
                <p className="text-sm text-red-200">
                  Are you sure? This will disconnect your Stripe account and
                  switch payment method to &quot;outside Fotno&quot;. You can
                  reconnect a different account anytime.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDisconnect}
                    disabled={disconnecting}
                    className="flex items-center gap-1.5 rounded-lg bg-red-500/20 border border-red-400/30 px-3 py-1.5 text-sm font-medium text-red-100 hover:bg-red-500/30 transition-colors disabled:opacity-60"
                  >
                    {disconnecting && (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    )}
                    Yes, disconnect
                  </button>
                  <button
                    onClick={() => setConfirmDisconnect(false)}
                    disabled={disconnecting}
                    className="rounded-lg px-3 py-1.5 text-sm text-white/50 hover:text-white/80 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="flex items-center gap-1.5 text-sm text-white/40 hover:text-red-300 transition-colors"
                onClick={() => setConfirmDisconnect(true)}
              >
                <Unlink className="h-3 w-3" />
                Disconnect Stripe account
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
