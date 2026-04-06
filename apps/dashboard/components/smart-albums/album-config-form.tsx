"use client";

import { useState, useEffect } from "react";
import { Switch } from "@workspace/ui/components/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { StripeConnectSetup } from "./stripe-connect-setup";

interface SmartAlbumConfig {
  id: string;
  enabled: boolean;
  paymentMethod: "OUTSIDE_FOTNO" | "INSIDE_FOTNO";
  stripeConnectOnboarded?: boolean;
  platformFeePercent?: number;
  products: any[];
}

export function AlbumConfigForm() {
  const [config, setConfig] = useState<SmartAlbumConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectOnboarded, setConnectOnboarded] = useState(false);
  // Local UI selection — may differ from saved config while awaiting Stripe onboarding
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"OUTSIDE_FOTNO" | "INSIDE_FOTNO">("OUTSIDE_FOTNO");

  // Load config on mount
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await fetch("/api/smart-albums/config");
        if (!res.ok) throw new Error("Failed to load config");
        const data = await res.json();
        setConfig(data);
        setConnectOnboarded(data.stripeConnectOnboarded ?? false);
        setSelectedPaymentMethod(data.paymentMethod);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadConfig();
  }, []);

  const handleEnabledChange = async (enabled: boolean) => {
    if (!config) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/smart-albums/config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled }),
      });
      if (!res.ok) throw new Error("Failed to update config");
      const updated = await res.json();
      setConfig(updated);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const savePaymentMethod = async (paymentMethod: string) => {
    if (!config) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/smart-albums/config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethod }),
      });
      if (!res.ok) throw new Error("Failed to update config");
      const updated = await res.json();
      setConfig(updated);
      setSelectedPaymentMethod(updated.paymentMethod);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePaymentMethodSelect = (paymentMethod: string) => {
    const method = paymentMethod as "OUTSIDE_FOTNO" | "INSIDE_FOTNO";
    setSelectedPaymentMethod(method);

    // Only save to backend if selecting OUTSIDE_FOTNO or already onboarded
    if (method === "OUTSIDE_FOTNO" || connectOnboarded) {
      savePaymentMethod(method);
    }
  };

  if (loading)
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-64 mt-1" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-56" />
            </div>
            <Skeleton className="h-5 w-9 rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  if (!config) return <div>Failed to load configuration</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Album Settings</CardTitle>
        <CardDescription>
          Configure smart album feature and payment options
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium">Enable Smart Albums</label>
            <p className="text-xs text-muted-foreground">
              Allow clients to design and order physical albums
            </p>
          </div>
          <Switch
            checked={config.enabled}
            onCheckedChange={handleEnabledChange}
            disabled={saving}
          />
        </div>

        {config.enabled && (
          <div className="space-y-4">
            <div className="space-y-3">
              <label className="text-sm font-medium">Payment Method</label>
              <Select
                value={selectedPaymentMethod}
                onValueChange={handlePaymentMethodSelect}
                disabled={saving}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OUTSIDE_FOTNO">
                    Client pays directly (outside Fotno)
                  </SelectItem>
                  <SelectItem value="INSIDE_FOTNO">
                    Client pays through Fotno
                  </SelectItem>
                </SelectContent>
              </Select>

              <div className="rounded-md border bg-muted/50 px-4 py-3 text-sm space-y-2">
                {selectedPaymentMethod === "OUTSIDE_FOTNO" ? (
                  <>
                    <p className="font-medium">Direct Payment</p>
                    <p className="text-xs text-muted-foreground">
                      You handle payments yourself. After album submission, your client receives
                      a confirmation with your payment link. No platform fees apply — you manage
                      invoicing, pricing, and collection outside of Fotno.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-medium">Integrated Payment via Stripe</p>
                    <p className="text-xs text-muted-foreground">
                      Clients pay directly through Fotno at checkout. Payments are processed via
                      Stripe Connect and deposited to your connected Stripe account automatically.
                      No manual invoicing needed.
                    </p>
                  </>
                )}
              </div>

              {selectedPaymentMethod === "INSIDE_FOTNO" && config.platformFeePercent != null && (
                <div className="rounded-md border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm">
                  <p className="font-medium text-amber-400">
                    Platform fee: {config.platformFeePercent}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    A {config.platformFeePercent}% service fee is deducted from each album payment.
                    Your client pays the full price, and you receive{" "}
                    {100 - config.platformFeePercent}% of each sale directly to your Stripe account.
                  </p>
                </div>
              )}
            </div>

            {selectedPaymentMethod === "INSIDE_FOTNO" && (
              <StripeConnectSetup
                onStatusChange={(onboarded) => {
                  const wasOnboarded = connectOnboarded;
                  setConnectOnboarded(onboarded);
                  if (onboarded && !wasOnboarded) {
                    // Onboarding just completed — now persist INSIDE_FOTNO to backend
                    savePaymentMethod("INSIDE_FOTNO");
                  } else if (!onboarded && wasOnboarded) {
                    // Was onboarded, now disconnected — switch back to OUTSIDE_FOTNO
                    setSelectedPaymentMethod("OUTSIDE_FOTNO");
                    savePaymentMethod("OUTSIDE_FOTNO");
                  }
                }}
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
