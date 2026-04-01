"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { CheckCircle2, ExternalLink, Loader2, AlertCircle } from "lucide-react";

interface ConnectStatus {
  connected: boolean;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
}

interface StripeConnectSetupProps {
  onStatusChange?: (fullyOnboarded: boolean) => void;
}

export function StripeConnectSetup({ onStatusChange }: StripeConnectSetupProps) {
  const [status, setStatus] = useState<ConnectStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboarding, setOnboarding] = useState(false);
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
      const res = await fetch("/api/smart-albums/connect/onboard", { method: "POST" });
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

  const fullyOnboarded = status?.chargesEnabled && status?.payoutsEnabled;

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Checking Stripe Connect status...
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Stripe Connect</CardTitle>
        <CardDescription>
          Required to accept payments through Fotno. Clients pay securely and funds are
          transferred to your Stripe account.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Account connected</span>
            {status?.connected ? (
              <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-100">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Connected
              </Badge>
            ) : (
              <Badge variant="secondary">Not connected</Badge>
            )}
          </div>

          {status?.connected && (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Charges enabled</span>
                {status.chargesEnabled ? (
                  <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-100">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Enabled
                  </Badge>
                ) : (
                  <Badge variant="secondary">Pending</Badge>
                )}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Payouts enabled</span>
                {status.payoutsEnabled ? (
                  <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-100">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Enabled
                  </Badge>
                ) : (
                  <Badge variant="secondary">Pending</Badge>
                )}
              </div>
            </>
          )}
        </div>

        {fullyOnboarded ? (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-green-700 font-medium flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" />
              Ready to accept payments
            </p>
            <a
              href="https://dashboard.stripe.com/connect/accounts/overview"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              View earnings in Stripe dashboard
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        ) : (
          <Button onClick={handleOnboard} disabled={onboarding} size="sm">
            {onboarding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {status?.connected ? "Continue onboarding" : "Connect Stripe account"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
