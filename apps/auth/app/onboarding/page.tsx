import { redirect } from "next/navigation";
import { getSession } from "@workspace/lib/auth/auth-client";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";
import { headers } from "next/headers";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const VALID_PLANS = ["Free", "Solo", "Studio", "Unlimited"];
  const rawPlan = typeof params.plan === "string" ? params.plan : "Free";
  const plan = VALID_PLANS.includes(rawPlan) ? rawPlan : "Free";
  const paymentSuccess = params.payment_status === "success";

  // Check auth status
  const { data: session } = await getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  // Determine initial step
  let initialStep: "account" | "stripe" = "account";

  if (session?.user) {
    if ((session.user as any).finishOnboarding === true) {
      // Already finished onboarding, don't let them do it again unless forced
      redirect(
        process.env.NEXT_PUBLIC_DASHBOARD_URL || "https://dashboard.fotno.com",
      );
    } else {
      // Has session but hasn't finished onboarding -> always resume at Stripe step
      initialStep = "stripe";
    }
  } else {
    // No session -> must create an account first regardless of requested step
    initialStep = "account";
  }

  return (
    <OnboardingFlow
      initialStep={initialStep}
      plan={plan}
      paymentSuccess={paymentSuccess}
    />
  );
}
