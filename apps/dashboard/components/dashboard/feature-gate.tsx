"use client";

import { Lock, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { useFeaturesLoaded } from "@/lib/hooks/use-features";
import { featureLabel } from "@workspace/lib";

/**
 * Wraps children with an upgrade overlay when the user's plan
 * doesn't include the required feature.
 */
export function FeatureGate({
  featureKey,
  children,
  className,
}: {
  featureKey: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { features, isLoaded } = useFeaturesLoaded();
  const hasFeature = features.includes(featureKey);

  // Don't show the gate while still loading features
  if (!isLoaded || hasFeature) return <>{children}</>;

  const label = featureLabel(featureKey);

  return (
    <div className={cn("relative", className)}>
      {/* Blurred content behind */}
      <div
        className="pointer-events-none select-none blur-[2px] opacity-50"
        aria-hidden
      >
        {children}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 rounded-xl bg-background/90 border border-border/60 px-8 py-6 text-center shadow-lg backdrop-blur-sm max-w-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">{label}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Upgrade your plan to unlock this feature.
            </p>
          </div>
          <Button size="sm" asChild className="gap-1.5">
            <Link href="/billing">
              <Sparkles className="h-3.5 w-3.5" />
              Upgrade
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Inline upgrade gate for form sections.
 * Replaces the locked section with a clean upgrade card.
 */
export function FeatureInlineGate({
  featureKey,
  children,
  noUpgrade = false,
}: {
  featureKey: string;
  children: React.ReactNode;
  noUpgrade?: boolean;
}) {
  const { features, isLoaded } = useFeaturesLoaded();
  const hasFeature = features.includes(featureKey);

  if (!isLoaded || hasFeature) return <>{children}</>;

  if (noUpgrade) {
    return (
      <div className="pointer-events-none opacity-40 select-none" aria-hidden>
        {children}
      </div>
    );
  }

  const label = featureLabel(featureKey);

  return (
    <Link
      href="/billing"
      className="group flex items-center gap-4 rounded-xl border border-border/60 bg-card p-5 transition-colors hover:border-primary/30 hover:bg-primary/[0.02]"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
        <Lock className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">
          Available on higher plans
        </p>
      </div>
      <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Sparkles className="h-3 w-3" />
        Upgrade
      </span>
    </Link>
  );
}

/**
 * Full-page locked state. Shows a centered card with lock icon,
 * feature description, and a prominent upgrade button.
 * Use this instead of redirecting — let users see what the feature is.
 */
export function LockedPage({
  featureKey,
  title,
  description,
}: {
  featureKey: string;
  title: string;
  description: string;
}) {
  const label = featureLabel(featureKey);

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="flex flex-col items-center gap-5 max-w-md text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Lock className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/50 px-4 py-2.5 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>
            <strong className="text-foreground">{label}</strong> is available on
            higher plans
          </span>
        </div>
        <Button asChild size="lg" className="gap-2 mt-2">
          <Link href="/billing">
            Upgrade Plan
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
