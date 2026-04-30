"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@workspace/ui/lib/utils";

export type LandingPlanTier = {
  gb: number;
  label: string;
  priceCents: number;
  priceCentsAnnual?: number | null;
  hasAnnual?: boolean;
  galleryLimit?: number | null;
  features?: string[];
  /** Regional pricing display (monthly only) */
  localPriceCents?: number;
  currency?: string;
  symbol?: string;
  locale?: string;
};

type Interval = "monthly" | "annual";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

/** Fixed feature checklist order, matching the design exactly */
const FEATURE_ORDER: { key: string; label: string }[] = [
  { key: "UNLIMITED_GALLERIES", label: "Unlimited galleries" },
  { key: "CLIENT_FAVORITES", label: "Client favorites & notes" },
  { key: "COMMENTS", label: "Gallery comments" },
  { key: "PASSWORD_PROTECTION", label: "Password-protected galleries" },
  { key: "CUSTOM_SLUGS", label: "Custom gallery slugs" },
  { key: "SLIDESHOW_SHARING", label: "Slideshow & social sharing" },
  { key: "DOWNLOAD", label: "Download Gallery (ZIP)" },
  { key: "GOOGLE_IMPORT", label: "Drive & Photos import" },
  { key: "ALBUMS", label: "Albums" },
  { key: "SMART_ALBUMS", label: "Print Albums" },
  { key: "ANALYTICS", label: "Gallery analytics" },
];

type TierCopy = {
  tagline: string;
  note: string;
  storageDesc: (jpegs: string) => string;
  smallNote: string;
  barPercent: number;
};

const FREE_COPY: TierCopy = {
  tagline: "For first frames · trial roll",
  note: "Try every gallery feature you'll need to send your first set.",
  storageDesc: (jpegs) => `≈ ${jpegs} high-res JPEGs · one wedding, edited.`,
  smallNote: "No credit card · forever",
  barPercent: 6,
};

const TIER_COPY: Record<string, TierCopy> = {
  Free: FREE_COPY,
  Solo: {
    tagline: "For the working photographer",
    note: "A full season of shoots, sorted, sent, and starred.",
    storageDesc: (jpegs) =>
      `≈ ${jpegs} high-res JPEGs · ten weddings, or a quiet year of portraits.`,
    smallNote: "Cancel anytime · keep your galleries",
    barPercent: 14,
  },
  Studio: {
    tagline: "For the busy season",
    note: "Where most studios land. Albums, imports, the whole bench.",
    storageDesc: (jpegs) =>
      `≈ ${jpegs} high-res JPEGs · forty weddings or a full editorial year.`,
    smallNote: "Save 2 months on annual · cancel anytime",
    barPercent: 55,
  },
  "Pro Studio": {
    tagline: "For volume & print pipelines",
    note: "Every tool, every analytic, every plate — for the whole studio.",
    storageDesc: (jpegs) =>
      `≈ ${jpegs} high-res JPEGs · several seasons, or one prolific year of commercial work.`,
    smallNote: "Priority support · early features",
    barPercent: 100,
  },
};

function approxJpegCount(gb: number): string {
  if (gb <= 0) return "0";
  const count = Math.round((gb * 1024) / 5);
  if (count >= 1000) {
    const thousands = (count / 1000).toFixed(0);
    return `${Number(thousands).toLocaleString()},000`;
  }
  return count.toLocaleString();
}

// Cinematic palette — kept inline so the section is fully self-contained
const PAPER = "#EFEAE0";
const PAPER_2 = "#E5DFD2";
const INK = "#111110";
const INK_2 = "#2B2A26";
const INK_3 = "#6E6A60";
const INK_4 = "#A8A294";
const RULE = "#BDB7A8";
const RULE_2 = "#D4CEBE";
const ACCENT = "#C24A1F";

const SERIF_FF = "var(--fotno-serif), 'Times New Roman', serif";

// Reusable: small uppercase label class (Inter Tight, tracked, readable)
const LABEL_SM = "text-[10px] font-medium uppercase tracking-[0.2em]";
const LABEL_XS = "text-[9px] font-medium uppercase tracking-[0.18em]";

const GRAIN_SVG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='7'/><feColorMatrix values='0 0 0 0 0.06  0 0 0 0 0.05  0 0 0 0 0.04  0 0 0 0.5 0'/></filter><rect width='240' height='240' filter='url(%23n)'/></svg>\")";

export function PricingTiers({
  tiers,
  signupUrl,
}: {
  tiers: LandingPlanTier[];
  signupUrl: string;
}) {
  const [interval, setInterval] = useState<Interval>("monthly");

  const sorted = useMemo(
    () =>
      [...tiers].sort((a, b) => {
        const aSort = a.gb === -1 ? Infinity : a.gb;
        const bSort = b.gb === -1 ? Infinity : b.gb;
        return aSort - bSort;
      }),
    [tiers],
  );

  const annualAvailable = sorted.some((t) => t.hasAnnual);

  return (
    <div
      style={{ background: PAPER, color: INK }}
      className="relative overflow-hidden border-t font-[var(--fotno-sans)]"
    >
      {/* Paper grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.18] mix-blend-multiply"
        style={{ backgroundImage: GRAIN_SVG }}
      />

      <section className="relative z-[2] px-[clamp(20px,3.6vw,56px)] py-[clamp(80px,12vw,160px)]">
        <div className="mx-auto max-w-[1640px]">
          {/* Header */}
          <div
            className="mb-[50px] border-b pb-[30px]"
            style={{ borderColor: RULE }}
          >
            <h2
              className="m-0 max-w-[18ch] text-[clamp(48px,6.4vw,112px)] font-normal leading-[0.92] tracking-[-0.035em]"
              style={{ fontFamily: SERIF_FF, color: INK }}
            >
              Pick the{" "}
              <em className="italic" style={{ color: INK_3 }}>
                roll
              </em>{" "}
              that fits the&nbsp;
              <mark className="bg-transparent italic" style={{ color: ACCENT }}>
                year
              </mark>{" "}
              you&apos;re shooting.
            </h2>
          </div>

          {/* Billing toggle row */}
          {annualAvailable && (
            <div
              className={cn(
                "mb-[30px] flex flex-wrap items-center justify-between gap-[14px] border-y py-[14px]",
                LABEL_SM,
              )}
              style={{ borderColor: RULE, color: INK_3 }}
            >
              <span>
                <b className="font-medium" style={{ color: INK }}>
                  BILLING
                </b>{" "}
                · Choose your cadence
              </span>
              <IntervalToggle value={interval} onChange={setInterval} />
              <span
                className="inline-flex items-center gap-2 border px-3 py-[6px] italic"
                style={{ borderColor: ACCENT, color: ACCENT }}
              >
                <i
                  className="text-[14px] italic normal-case tracking-normal"
                  style={{ fontFamily: SERIF_FF }}
                >
                  −2 months
                </i>{" "}
                · save with annual
              </span>
            </div>
          )}

          {/* Tier rack */}
          <div
            className="grid grid-cols-1 border-l border-t md:grid-cols-2 xl:grid-cols-4"
            style={{ borderColor: INK }}
          >
            {sorted.map((tier, i) => (
              <TierCard
                key={tier.gb}
                tier={tier}
                index={i}
                interval={tier.hasAnnual ? interval : "monthly"}
                recommended={tier.label === "Studio" || tier.gb === 150}
                signupUrl={signupUrl}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function IntervalToggle({
  value,
  onChange,
}: {
  value: Interval;
  onChange: (v: Interval) => void;
}) {
  return (
    <div
      className="relative inline-flex"
      style={{ border: `1px solid ${INK}`, background: PAPER }}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 z-[1] w-1/2 transition-transform duration-[450ms] ease-[cubic-bezier(0.65,0.05,0.36,1)]",
          value === "annual" ? "translate-x-full" : "translate-x-0",
        )}
        style={{ background: INK }}
      />
      {(["monthly", "annual"] as const).map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={cn(
            "relative z-[2] cursor-pointer border-0 bg-transparent px-[18px] py-[10px] transition-colors duration-300",
            LABEL_SM,
          )}
          style={{ color: value === opt ? PAPER : INK_3 }}
        >
          {opt === "monthly" ? "Monthly" : "Annual"}
        </button>
      ))}
    </div>
  );
}

function TierCard({
  tier,
  index,
  interval,
  recommended,
  signupUrl,
}: {
  tier: LandingPlanTier;
  index: number;
  interval: Interval;
  recommended: boolean;
  signupUrl: string;
}) {
  const isFree = tier.priceCents === 0;
  const copy: TierCopy = TIER_COPY[tier.label] ?? FREE_COPY;
  const enabled = new Set(tier.features ?? []);
  const roman = ROMAN[index] ?? String(index + 1);
  const storageLabel = tier.gb === -1 ? "Unlimited" : `${tier.gb} GB`;

  // Animated price morph on toggle change. Two effects fire together:
  //   1. Number counts up/down to the target (700ms, power3.out)
  //   2. Slide-in + opacity pulse via the fotnoPriceMorph keyframe (600ms)
  // Mirrors the GSAP animation in the original design.
  const numRef = useRef<HTMLSpanElement | null>(null);
  const target = computeDisplayUSD(tier, interval);
  const [displayValue, setDisplayValue] = useState(target);
  const currentRef = useRef(target);
  const rafRef = useRef<number | null>(null);
  useEffect(() => {
    const el = numRef.current;
    if (el) {
      el.style.animation = "none";
      void el.offsetWidth;
      el.style.animation = "fotnoPriceMorph 0.6s cubic-bezier(0.2,0.7,0.2,1)";
    }

    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    const from = currentRef.current;
    const to = target;
    if (from === to) {
      setDisplayValue(to);
      return;
    }
    const start = performance.now();
    const duration = 700;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // power3.out
      const v = Math.round(from + (to - from) * eased);
      currentRef.current = v;
      setDisplayValue(v);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [target]);

  let wasLabel: string | null = null;
  if (!isFree) {
    wasLabel =
      interval === "annual"
        ? `$${Math.round((tier.priceCents * 12) / 80)}/yr`
        : `$${Math.round(tier.priceCents / 80)}/mo · billed monthly`;
  }

  let perTop: string;
  let perBottom: string;
  if (isFree) {
    perTop = "forever";
    perBottom = "no card";
  } else if (interval === "annual") {
    perTop = "per year";
    perBottom = "billed annual";
  } else {
    perTop = "per month";
    perBottom = "billed monthly";
  }

  const ctaCopy = isFree ? "Start free" : `Choose ${tier.label}`;
  const ctaSolid = !isFree && tier.label !== "Pro Studio";
  const ctaHref = isFree
    ? `${signupUrl}/account?plan=Free`
    : `${signupUrl}/account?plan=${encodeURIComponent(tier.label)}&interval=${interval}`;

  // Color tokens flip when this tier is recommended (inverted card)
  const fg = recommended ? PAPER : INK;
  const fg2 = recommended ? INK_4 : INK_2;
  const fg3 = recommended ? INK_4 : INK_3;
  const ruleColor = recommended ? "#3a3832" : RULE;
  const cardBg = recommended ? INK : PAPER;
  const checkBoxBorder = recommended ? PAPER : INK;
  const checkBoxOnFill = recommended ? PAPER : INK;
  const checkBoxOffFill = recommended ? INK : PAPER;

  return (
    <article
      className="relative flex min-h-[680px] flex-col gap-[18px] border-r border-b p-[28px] sm:p-[30px_28px_28px]"
      style={{
        background: cardBg,
        color: fg,
        borderColor: INK,
      }}
      data-tier={tier.label.toLowerCase().replace(/\s+/g, "-")}
    >
      {/* Local keyframe for the price morph */}
      <style>{`@keyframes fotnoPriceMorph{0%{transform:translateY(18%);opacity:0.4}100%{transform:translateY(0);opacity:1}}`}</style>

      {recommended && (
        <span
          className={cn("absolute -right-px -top-px z-[3] px-3 py-2", LABEL_XS)}
          style={{
            background: ACCENT,
            color: PAPER,
            letterSpacing: "0.22em",
          }}
        >
          Most chosen
        </span>
      )}

      {/* Header: Plate · roman · GB */}
      <header
        className={cn("flex items-baseline justify-between", LABEL_SM)}
        style={{ color: fg3 }}
      >
        <span>Plate</span>
        <span
          className="text-[36px] italic font-normal leading-[0.8] tracking-[-0.01em] normal-case"
          style={{
            fontFamily: SERIF_FF,
            color: fg,
            letterSpacing: "-0.01em",
          }}
        >
          {roman}
        </span>
        <span>{storageLabel}</span>
      </header>

      {/* Tier name + tagline */}
      <div>
        <h3
          className="m-0 text-[46px] font-normal leading-[0.95] tracking-[-0.025em]"
          style={{ fontFamily: SERIF_FF, color: fg }}
        >
          {renderTierName(tier.label, fg3)}
        </h3>
        <p
          className={cn(
            "mt-[-4px]",
            "text-[10px] font-medium uppercase tracking-[0.18em] leading-[1.5]",
          )}
          style={{ color: fg3 }}
        >
          {copy.tagline}
        </p>
      </div>

      {/* Price block */}
      <div className="grid content-start gap-[10px]">
        {wasLabel && (
          <p
            className={cn(
              "m-0 line-through leading-none",
              "text-[10px] font-medium uppercase tracking-[0.18em]",
            )}
            style={{ color: fg3 }}
          >
            {wasLabel}
          </p>
        )}
        <p
          className="m-0 flex items-baseline gap-[6px] leading-[0.85] tracking-[-0.04em]"
          style={{ fontFamily: SERIF_FF }}
        >
          <span
            className="self-start mt-[14px] text-[24px] italic"
            style={{ color: fg3 }}
          >
            $
          </span>
          <span
            ref={numRef}
            className="inline-block text-[96px] font-normal [font-feature-settings:'tnum']"
          >
            {displayValue}
          </span>
          <span
            className={cn(
              "self-end mb-[6px] ml-[6px] not-italic normal-case leading-[1.4]",
              "text-[10px] font-medium uppercase tracking-[0.18em]",
            )}
            style={{ color: fg3, fontFamily: "var(--fotno-sans)" }}
          >
            {perTop}
            <br />
            {perBottom}
          </span>
        </p>
        <span
          className="block text-[13px] leading-[1.45] normal-case tracking-normal"
          style={{ color: fg3 }}
        >
          {copy.note}
        </span>
      </div>

      {/* Storage */}
      <div className="grid gap-2">
        <div
          className={cn("flex justify-between", LABEL_SM)}
          style={{ color: fg3 }}
        >
          <span>Storage</span>
          <b
            className="text-[18px] italic font-normal leading-none normal-case tracking-[-0.01em]"
            style={{ fontFamily: SERIF_FF, color: fg }}
          >
            {storageLabel}
          </b>
        </div>
        <div
          className="relative h-[3px] overflow-hidden"
          style={{ background: recommended ? "#3a3832" : RULE_2 }}
        >
          <div
            className="absolute inset-y-0 left-0 transition-[width] duration-[1200ms] ease-[cubic-bezier(0.2,0.7,0.2,1)]"
            style={{
              width: `${copy.barPercent}%`,
              background: recommended ? ACCENT : INK,
            }}
          />
        </div>
        <p
          className="m-0 text-[14px] italic leading-[1.35]"
          style={{ fontFamily: SERIF_FF, color: fg3 }}
        >
          {copy.storageDesc(approxJpegCount(tier.gb))}
        </p>
      </div>

      {/* Hairline rule */}
      <div className="my-[6px] h-px" style={{ background: ruleColor }} />

      {/* Features list */}
      <ul className="m-0 grid flex-1 list-none gap-[7px] p-0">
        {FEATURE_ORDER.map(({ key, label }) => {
          const on = enabled.has(key);
          return (
            <li
              key={key}
              className={cn(
                "flex items-start gap-[10px] py-px text-[13px] leading-[1.4]",
                !on && "line-through",
              )}
              style={{ color: on ? fg2 : recommended ? "#5a574e" : INK_4 }}
            >
              <span
                aria-hidden="true"
                className="mt-[5px] inline-block h-[9px] w-[9px] flex-none border"
                style={{
                  borderColor: checkBoxBorder,
                  background: on ? checkBoxOnFill : checkBoxOffFill,
                }}
              />
              {label}
            </li>
          );
        })}
      </ul>

      {/* CTA */}
      <div className="mt-[6px] grid gap-[10px]">
        <a
          href={ctaHref}
          className={cn(
            "group inline-flex w-full items-center justify-center gap-[10px] border px-[18px] py-[13px] text-[12px] font-medium leading-none no-underline transition-colors duration-[250ms]",
          )}
          style={{
            borderColor: recommended ? PAPER : INK,
            background:
              recommended || ctaSolid ? (recommended ? PAPER : INK) : PAPER,
            color: recommended || ctaSolid ? (recommended ? INK : PAPER) : INK,
            fontFamily: "var(--fotno-sans)",
          }}
        >
          {ctaCopy}{" "}
          <span className="transition-transform duration-[250ms] group-hover:translate-x-[4px]">
            →
          </span>
        </a>
        <small
          className={cn(
            "block text-center leading-[1.4]",
            "text-[9px] font-medium uppercase tracking-[0.18em]",
          )}
          style={{ color: fg3 }}
        >
          {copy.smallNote}
        </small>
      </div>
    </article>
  );
}

/** Choose the visible USD whole-dollar number for the price display */
function computeDisplayUSD(tier: LandingPlanTier, interval: Interval): number {
  if (tier.priceCents === 0) return 0;
  if (interval === "annual" && tier.priceCentsAnnual != null) {
    return Math.round(tier.priceCentsAnnual / 100);
  }
  if (interval === "monthly" && tier.localPriceCents != null) {
    return Math.round(tier.localPriceCents / 100);
  }
  return Math.round(tier.priceCents / 100);
}

/** Reproduce the design's italic placement in tier names */
function renderTierName(label: string, italicColor: string) {
  const em = (text: string) => (
    <em className="italic" style={{ color: italicColor }}>
      {text}
    </em>
  );
  switch (label) {
    case "Free":
      return <>Free{em(".")}</>;
    case "Solo":
      return em("Solo.");
    case "Studio":
      return <>Studio{em(".")}</>;
    case "Pro Studio":
      return <>Pro {em("Studio.")}</>;
    default:
      return (
        <>
          {label}
          {em(".")}
        </>
      );
  }
}
