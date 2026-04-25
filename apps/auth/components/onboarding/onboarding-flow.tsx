"use client";

import { useEffect, useState } from "react";
import { AccountInfoStep } from "./account-info-step";
import { StripeStep } from "./stripe-step";
import { Icons } from "@workspace/ui/components/icons";
import { trackEvent, identifyUser } from "../../lib/rybbit";
import { getSession } from "@workspace/lib/auth/auth-client";
import Logo from "@workspace/ui/components/logo";

export type OnboardingStep = "account" | "stripe";

interface OnboardingFlowProps {
  initialStep: OnboardingStep;
  plan: string;
  paymentSuccess?: boolean;
}

export function OnboardingFlow({
  initialStep,
  plan,
  paymentSuccess,
}: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(initialStep);

  useEffect(() => {
    trackEvent("onboarding_started", { plan, initialStep });

    // Identify user for analytics (covers social sign-in redirects)
    getSession().then((session) => {
      const email = session?.data?.user?.email;
      if (email) identifyUser(email, { email });
    });
  }, [plan, initialStep]);

  // The steps configuration can be extended in the future (FR-015)
  const steps: { id: OnboardingStep; component: React.ReactNode }[] = [
    {
      id: "account",
      component: (
        <AccountInfoStep
          plan={plan}
          onSuccess={() => setCurrentStep("stripe")}
        />
      ),
    },
    {
      id: "stripe",
      component: <StripeStep plan={plan} paymentSuccess={paymentSuccess} />,
    },
  ];

  const renderCurrentStep = () => {
    const step = steps.find((s) => s.id === currentStep);
    return step ? step.component : null;
  };

  const currentIndex = steps.findIndex((s) => s.id === currentStep) + 1;
  const totalSteps = steps.length;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-2">
          <Logo />
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,_oklch(0.72_0.14_65_/_0.15),transparent_70%)] pointer-events-none" />

          <div className="relative z-10">{renderCurrentStep()}</div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm font-medium text-muted-foreground/80">
            Step {currentIndex} of {totalSteps}
          </p>
        </div>
      </div>
    </div>
  );
}
