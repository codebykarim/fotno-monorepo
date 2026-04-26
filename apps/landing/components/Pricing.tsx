import { cookies, headers } from "next/headers";
import { Instrument_Serif, Inter_Tight } from "next/font/google";
import { PricingTiers, type LandingPlanTier } from "./PricingTiers";

// Cinematic typography — display uses Instrument Serif; everything else
// (including the small uppercase labels) uses Inter Tight for legibility.
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--fotno-serif",
  display: "swap",
});
const sans = Inter_Tight({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--fotno-sans",
  display: "swap",
});

const FALLBACK_TIERS: LandingPlanTier[] = [
  {
    gb: 10,
    label: "Free",
    priceCents: 0,
    priceCentsAnnual: 0,
    hasAnnual: false,
    galleryLimit: 2,
    features: [
      "UNLIMITED_GALLERIES",
      "COMMENTS",
      "PASSWORD_PROTECTION",
      "SLIDESHOW_SHARING",
    ],
  },
];

async function fetchTiers(country?: string): Promise<LandingPlanTier[]> {
  const backendUrl =
    process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL;
  if (!backendUrl) return FALLBACK_TIERS;

  try {
    const url = country
      ? `${backendUrl}/api/billing/plans?country=${encodeURIComponent(country)}`
      : `${backendUrl}/api/billing/plans`;
    const res = await fetch(url, {
      next: { revalidate: process.env.NODE_ENV === "development" ? 0 : 300 },
    });
    if (!res.ok) return FALLBACK_TIERS;
    const data = await res.json();
    const tiers: LandingPlanTier[] = Array.isArray(data)
      ? data
      : Array.isArray(data?.tiers)
        ? data.tiers
        : [];
    return tiers.length > 0 ? tiers : FALLBACK_TIERS;
  } catch {
    return FALLBACK_TIERS;
  }
}

export async function Pricing() {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const country =
    cookieStore.get("user_country")?.value ||
    headerStore.get("cf-ipcountry") ||
    headerStore.get("x-vercel-ip-country") ||
    undefined;
  const tiers = await fetchTiers(country);
  const signupUrl = process.env.NEXT_PUBLIC_AUTH_URL ?? "";

  return (
    <div
      id="pricing"
      className={`${serif.variable} ${sans.variable}`}
    >
      <PricingTiers tiers={tiers} signupUrl={signupUrl} />
    </div>
  );
}
