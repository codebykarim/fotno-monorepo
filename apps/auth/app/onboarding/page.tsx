import { redirect } from "next/navigation";
import { getSession } from "@workspace/lib/auth/auth-client";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";
import { headers } from "next/headers";

async function fetchValidPlanLabels(): Promise<string[]> {
  const backendUrl =
    process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL;
  if (!backendUrl) return ["Free"];
  try {
    const res = await fetch(`${backendUrl}/api/billing/plans`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return ["Free"];
    const data = await res.json();
    const tiers = Array.isArray(data) ? data : data?.tiers;
    if (!Array.isArray(tiers)) return ["Free"];
    const labels = tiers
      .map((t: { label?: string }) => t.label)
      .filter((l): l is string => typeof l === "string");
    return labels.length > 0 ? labels : ["Free"];
  } catch {
    return ["Free"];
  }
}

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const validLabels = await fetchValidPlanLabels();
  // Always allow "Free" in case the backend is unreachable mid-onboarding.
  const allowed = new Set([...validLabels, "Free"]);
  const rawPlan = typeof params.plan === "string" ? params.plan : "Free";
  const plan = allowed.has(rawPlan) ? rawPlan : "Free";

  const rawInterval = typeof params.interval === "string" ? params.interval : "monthly";
  const interval: "monthly" | "annual" =
    rawInterval === "annual" ? "annual" : "monthly";

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
      interval={interval}
      paymentSuccess={paymentSuccess}
    />
  );
}
