"use client";

import { motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@workspace/ui/lib/utils";

const palette = {
  "--bg": "#f3ede1",
  "--bg-2": "#ebe4d4",
  "--bg-3": "#e0d8c5",
  "--paper": "#f8f3e8",
  "--ink": "#14110d",
  "--ink-2": "#2a2620",
  "--ink-dim": "#5b554c",
  "--ink-dimmer": "#8c867a",
  "--line": "#cdc6b3",
  "--line-strong": "#a8a08a",
  "--accent": "#e8a33d",
  "--accent-2": "#c46a2a",
  "--accent-soft": "rgba(232,163,61,0.14)",
} as CSSProperties;

const serif =
  "[font-family:var(--font-fraunces)] [font-variation-settings:'opsz'_144]";
const mono = "[font-family:var(--font-jetbrains-mono)]";

type Voice = {
  n: number;
  name: string;
  role: string;
  roleShort: string;
  studio: string;
  rating: number;
  quote: ReactNode;
};

const VOICES: Voice[] = [
  {
    n: 1,
    name: "Eliza Whitfield",
    role: "Wedding & Elopement Photographer",
    roleShort: "Wedding · Brooklyn, NY",
    studio: "Whitfield & Co.",
    rating: 5,
    quote: (
      <>
        I&rsquo;d been duct-taping Dropbox links to a Squarespace site for years.
        The first time I sent a Fotno gallery, my couple texted back asking who
        designed my website.{" "}
        <em>That&rsquo;s never happened to me before</em>.
      </>
    ),
  },
  {
    n: 2,
    name: "Tomás Reinholt",
    role: "Editorial Portrait Photographer",
    roleShort: "Portrait · Copenhagen",
    studio: "Studio Reinholt",
    rating: 5,
    quote: (
      <>
        The favorites flow is the quietly brilliant thing. Clients tap hearts on
        their phone, I open my dashboard, and{" "}
        <em>the shortlist is already there</em>. Selection rounds went from a
        week of email tennis to one afternoon.
      </>
    ),
  },
  {
    n: 3,
    name: "Priya Raghunathan",
    role: "Product & Still-Life Photographer",
    roleShort: "Product · Bengaluru",
    studio: "Half Moon Studio",
    rating: 4.5,
    quote: (
      <>
        Brand clients have opinions, and they want to leave them on the photos.
        Threaded comments per image meant{" "}
        <em>I stopped translating Slack threads into shot notes</em>. I just
        open the gallery and the feedback is right there.
      </>
    ),
  },
  {
    n: 4,
    name: "Marcus Donovan",
    role: "Event & Conference Photographer",
    roleShort: "Event · Austin, TX",
    studio: "Donovan Frames",
    rating: 5,
    quote: (
      <>
        I shot a 2,000-person conference on Tuesday. Bulk upload pulled the
        whole card in twenty minutes flat and{" "}
        <em>the gallery was live before I left the venue</em>. Two years ago
        that night would have ended at 3 a.m.
      </>
    ),
  },
  {
    n: 5,
    name: "Solène Martel-Aubry",
    role: "Fashion & Editorial Photographer",
    roleShort: "Fashion · Paris, FR",
    studio: "Atelier Martel",
    rating: 4.5,
    quote: (
      <>
        Most delivery tools flatten the work. Fotno&rsquo;s dark galleries hold
        the mood —{" "}
        <em>my black-and-white editorial actually reads as black-and-white</em>,
        not a washed-out preview. Art directors notice immediately.
      </>
    ),
  },
  {
    n: 6,
    name: "Adaeze Okonkwo",
    role: "Studio Owner & Lead Photographer",
    roleShort: "Studio · Lagos, NG",
    studio: "Okonkwo Studios",
    rating: 5,
    quote: (
      <>
        We run 60+ active galleries across three shooters. Fotno is the first
        tool that didn&rsquo;t punish us for scaling.{" "}
        <em>Pricing is honest, the dashboard is fast</em>, and I stopped getting
        &ldquo;where&rsquo;s my link?&rdquo; DMs at midnight.
      </>
    ),
  },
  {
    n: 7,
    name: "Henrik Bjørnstad",
    role: "Travel & Documentary Photographer",
    roleShort: "Documentary · Oslo",
    studio: "Bjørnstad Photo",
    rating: 4.5,
    quote: (
      <>
        I file from hotel Wi-Fi in places that barely qualify as Wi-Fi.
        Resumable uploads and signed download links mean{" "}
        <em>my editor in New York gets a working gallery before I&rsquo;ve even unpacked</em>
        .
      </>
    ),
  },
];

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0])
    .join("");

const roleWithBoldTitle = (role: string) =>
  role.replace(
    /(Lead Photographer|Photographer|Owner)$/,
    (m) => `__BOLD__${m}__/BOLD__`,
  );

function RoleText({ role }: { role: string }) {
  const marked = roleWithBoldTitle(role);
  const parts = marked.split(/(__BOLD__|__\/BOLD__)/);
  let bold = false;
  return (
    <>
      {parts.map((p, i) => {
        if (p === "__BOLD__") {
          bold = true;
          return null;
        }
        if (p === "__/BOLD__") {
          bold = false;
          return null;
        }
        return bold ? (
          <b key={i} className="font-medium text-(--ink-2)">
            {p}
          </b>
        ) : (
          <span key={i}>{p}</span>
        );
      })}
    </>
  );
}

function Stars({ rating }: { rating: number }) {
  const items: ("full" | "half" | "empty")[] = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) items.push("full");
    else if (rating >= i - 0.5) items.push("half");
    else items.push("empty");
  }
  return (
    <span className="inline-flex items-center gap-1 text-sm text-(--accent-2)">
      {items.map((kind, i) => {
        if (kind === "full") return <span key={i}>★</span>;
        if (kind === "empty")
          return (
            <span
              key={i}
              className="text-[color-mix(in_oklab,var(--accent-2)_30%,transparent)]"
            >
              ★
            </span>
          );
        return (
          <span
            key={i}
            className="relative inline-block w-[14px] text-[color-mix(in_oklab,var(--accent-2)_30%,transparent)]"
          >
            ★
            <span className="absolute left-0 top-0 w-1/2 overflow-hidden text-(--accent-2)">
              ★
            </span>
          </span>
        );
      })}
    </span>
  );
}

function AnimatedQuote({ children, swapKey }: { children: ReactNode; swapKey: number }) {
  // Re-trigger word-stagger on swap by remounting via key.
  const containerRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    // Wrap text nodes in spans for staggered reveal.
    const wrapTextNodes = (node: Node) => {
      const children = Array.from(node.childNodes);
      children.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const text = child.textContent ?? "";
          const frag = document.createDocumentFragment();
          text.split(/(\s+)/).forEach((word) => {
            if (!word) return;
            if (/^\s+$/.test(word)) {
              frag.appendChild(document.createTextNode(word));
            } else {
              const span = document.createElement("span");
              span.className = "inline-block opacity-0 translate-y-3 transition-[transform,opacity] duration-500 ease-[cubic-bezier(.2,.8,.2,1)]";
              span.textContent = word;
              frag.appendChild(span);
            }
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          wrapTextNodes(child);
        }
      });
    };
    wrapTextNodes(root);
    const spans = root.querySelectorAll<HTMLElement>("span.inline-block");
    spans.forEach((span, i) => {
      window.setTimeout(() => {
        span.style.transform = "translateY(0)";
        span.style.opacity = "1";
      }, 30 + i * 18);
    });
  }, [swapKey]);

  return (
    <p
      ref={containerRef}
      key={swapKey}
      className={cn(
        serif,
        "relative m-0 font-light text-(--ink) [text-wrap:balance]",
        "text-[clamp(36px,4.4vw,72px)] leading-[1.04] tracking-[-0.025em]",
        "[&_em]:not-italic [&_em]:italic [&_em]:font-light [&_em]:text-(--accent-2)",
        "[&_em]:[background:linear-gradient(180deg,transparent_62%,color-mix(in_oklab,var(--accent)_28%,transparent)_62%,color-mix(in_oklab,var(--accent)_28%,transparent)_92%,transparent_92%)]",
        "[&_em]:px-1 [&_em]:-mx-1",
      )}
    >
      {children}
    </p>
  );
}

const AUTO_MS = 6500;
const RESUME_MS = 12000;

export function Testimonials() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);
  const [pausedByHover, setPausedByHover] = useState(false);
  const resumeRef = useRef<number | null>(null);

  const setActive = useCallback(
    (i: number, fromUser: boolean) => {
      if (i === activeIdx) return;
      setActiveIdx(i);
      if (fromUser) {
        setUserInteracted(true);
        if (resumeRef.current) window.clearTimeout(resumeRef.current);
        resumeRef.current = window.setTimeout(
          () => setUserInteracted(false),
          RESUME_MS,
        );
      }
    },
    [activeIdx],
  );

  useEffect(() => {
    if (userInteracted || pausedByHover) return;
    const id = window.setInterval(() => {
      setActiveIdx((i) => (i + 1) % VOICES.length);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [userInteracted, pausedByHover]);

  const v = VOICES[activeIdx] ?? VOICES[0]!;
  const totalLabel = useMemo(
    () => String(VOICES.length).padStart(2, "0"),
    [],
  );

  return (
    <section
      id="testimonials"
      aria-label="What photographers say"
      style={palette}
      className={cn(
        "relative overflow-hidden bg-(--bg) text-(--ink) py-20 pb-[120px] antialiased",
        "[font-family:var(--font-inter)]",
        "before:content-[''] before:absolute before:inset-0 before:pointer-events-none",
        "before:[background:radial-gradient(900px_500px_at_90%_0%,var(--accent-soft),transparent_60%),radial-gradient(700px_400px_at_0%_100%,color-mix(in_oklab,var(--accent)_8%,transparent),transparent_60%)]",
      )}
    >
      <div className="relative max-w-[1440px] mx-auto px-[clamp(20px,4vw,56px)]">
        {/* TOP META BAR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
          className={cn(
            "grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-6 pb-[22px] mb-14 border-b border-(--line)",
            mono,
            "text-[10px] tracking-[0.22em] uppercase text-(--ink-dimmer)",
          )}
        >
          <span className="inline-flex items-center gap-3 before:content-[''] before:w-6 before:h-px before:bg-(--accent)">
            Voices
          </span>
          <span className="hidden sm:inline-flex items-center gap-3.5 text-(--ink-dim) justify-self-center">
            <i className="w-1.5 h-1.5 rounded-full bg-(--accent-2) inline-block" />
            <b
              className={cn(
                serif,
                "italic font-normal text-base text-(--ink) tracking-[-0.01em] normal-case",
              )}
            >
              Voices
            </b>
            — what photographers say
            <i className="w-1.5 h-1.5 rounded-full bg-(--accent-2) inline-block" />
          </span>
          <span className="sm:justify-self-end">
            Updated weekly · 45 reviews
          </span>
        </motion.div>

        {/* STAGE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
          onMouseEnter={() => setPausedByHover(true)}
          onMouseLeave={() => setPausedByHover(false)}
          className="relative grid grid-cols-1 lg:grid-cols-[64px_1fr_360px] gap-12 min-h-[640px]"
        >
          {/* LEFT RAIL */}
          <aside className="hidden lg:flex relative flex-col justify-between items-center py-2">
            <div
              className={cn(
                mono,
                "[writing-mode:vertical-rl] rotate-180 text-[11px] tracking-[0.42em] uppercase text-(--ink-dim)",
              )}
            >
              Fotno&nbsp;&nbsp;·&nbsp;&nbsp;
              <b className="text-(--ink) font-medium">Testimonials</b>
              &nbsp;&nbsp;·&nbsp;&nbsp;Vol.&nbsp;01
            </div>
            <div className="flex-1 w-px my-6 [background:linear-gradient(to_bottom,transparent,var(--line)_12%,var(--line)_88%,transparent)]" />
            <div
              className={cn(
                "relative w-16 h-16 grid place-items-center rounded-full border border-(--accent-2) text-(--accent-2) -rotate-[8deg]",
                serif,
                "italic font-light text-[22px] leading-none",
                "before:content-[''] before:absolute before:inset-1 before:rounded-full before:border before:border-dashed before:border-[color-mix(in_oklab,var(--accent-2)_50%,transparent)]",
              )}
              title="Average rating"
            >
              4.8
              <small
                className={cn(
                  "absolute -bottom-[22px] left-1/2 -translate-x-1/2 rotate-[8deg]",
                  mono,
                  "text-[8px] tracking-[0.2em] text-(--ink-dimmer) uppercase whitespace-nowrap not-italic",
                )}
              >
                Verified
              </small>
            </div>
          </aside>

          {/* CENTER — quote */}
          <div className="relative flex flex-col justify-between">
            <div className="relative flex-1 grid grid-cols-1 content-center">
              <span
                aria-hidden
                className={cn(
                  serif,
                  "absolute -left-7 -top-16 select-none pointer-events-none italic font-light leading-none text-(--accent-2)",
                  "text-[clamp(180px,22vw,320px)] opacity-[0.14]",
                )}
              >
                &ldquo;
              </span>
              <AnimatedQuote swapKey={activeIdx}>{v.quote}</AnimatedQuote>
            </div>

            <div
              key={`byline-${activeIdx}`}
              className="mt-9 grid grid-cols-[56px_1fr_auto] items-center gap-[18px] pt-[22px] border-t border-(--line) animate-[fadein_.5s_ease]"
            >
              <span
                className={cn(
                  "relative w-14 h-14 rounded-full bg-(--paper) border border-(--line-strong) grid place-items-center text-(--accent-2)",
                  serif,
                  "italic font-normal text-[22px] tracking-[-0.02em]",
                  "after:content-[''] after:absolute after:-inset-1 after:rounded-full after:border after:border-dashed after:border-[color-mix(in_oklab,var(--accent-2)_35%,transparent)] after:pointer-events-none",
                )}
              >
                {initialsOf(v.name)}
              </span>
              <span className="flex flex-col gap-0.5">
                <span
                  className={cn(
                    serif,
                    "italic font-normal text-2xl leading-none tracking-[-0.015em] text-(--ink)",
                  )}
                >
                  {v.name}
                </span>
                <span
                  className={cn(
                    mono,
                    "mt-1.5 text-[10px] tracking-[0.2em] uppercase text-(--ink-dim)",
                  )}
                >
                  <RoleText role={v.role} />
                </span>
              </span>
              <Stars rating={v.rating} />
            </div>
          </div>

          {/* RIGHT — index */}
          <aside className="relative flex flex-col lg:border-l lg:border-(--line) lg:pl-7 pt-6 lg:pt-1 border-t lg:border-t-0 border-(--line) mt-8 lg:mt-0">
            <div
              className={cn(
                mono,
                "flex justify-between items-baseline pb-3.5 border-b border-dashed border-(--line) mb-1 text-[10px] tracking-[0.22em] uppercase text-(--ink-dim)",
              )}
            >
              <span>Index of voices</span>
              <b className="text-(--ink) font-medium">{totalLabel}</b>
            </div>
            <ul className="list-none m-0 p-0 flex flex-col">
              {VOICES.map((voice, i) => {
                const active = i === activeIdx;
                return (
                  <li
                    key={voice.n}
                    onClick={() => setActive(i, true)}
                    onMouseEnter={() => setActive(i, false)}
                    className={cn(
                      "relative grid grid-cols-[32px_1fr_14px] gap-2.5 items-center py-[11px] pr-1.5 border-b border-dashed border-(--line) cursor-pointer",
                      "transition-[padding,background] duration-400 ease-[cubic-bezier(.2,.8,.2,1)]",
                      "before:content-[''] before:absolute before:-left-[29px] before:top-1/2 before:h-px before:transition-[background,width] before:duration-300",
                      active
                        ? "pl-2 bg-[color-mix(in_oklab,var(--paper)_50%,transparent)] before:bg-(--accent-2) before:w-3"
                        : "before:bg-transparent before:w-2 hover:pl-2 hover:bg-[color-mix(in_oklab,var(--paper)_60%,transparent)]",
                    )}
                  >
                    <span
                      className={cn(
                        mono,
                        "text-[10px] tracking-[0.14em] tabular-nums",
                        active ? "text-(--accent-2)" : "text-(--ink-dimmer)",
                      )}
                    >
                      {String(voice.n).padStart(2, "0")}
                    </span>
                    <span className="flex flex-col gap-0.5 min-w-0">
                      <span
                        className={cn(
                          serif,
                          "italic font-normal text-base leading-tight tracking-[-0.01em] text-(--ink) truncate",
                        )}
                      >
                        {voice.name}
                      </span>
                      <span
                        className={cn(
                          mono,
                          "text-[9px] tracking-[0.16em] uppercase text-(--ink-dimmer)",
                        )}
                      >
                        {voice.roleShort}
                      </span>
                    </span>
                    <span
                      className={cn(
                        mono,
                        "text-sm transition-[color,transform] duration-300",
                        active
                          ? "text-(--accent-2) translate-x-[3px]"
                          : "text-(--ink-dimmer)",
                      )}
                    >
                      →
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="mt-[22px] pt-[18px] border-t border-dashed border-(--line) flex flex-col gap-2.5">
              <span
                className={cn(
                  mono,
                  "text-[10px] tracking-[0.22em] uppercase text-(--accent-2)",
                )}
              >
                → More voices
              </span>
              <p
                className={cn(
                  serif,
                  "m-0 italic font-light text-[19px] leading-[1.25] tracking-[-0.015em] text-(--ink) [text-wrap:pretty]",
                  "[&_em]:italic [&_em]:text-(--accent-2)",
                )}
              >
                &ldquo;The quiet best-in-class for{" "}
                <em>photographers who actually ship</em>.&rdquo;
              </p>
              <span
                className={cn(
                  mono,
                  "text-[9px] tracking-[0.18em] uppercase text-(--ink-dimmer)",
                )}
              >
                — Studio review, Q1 2026
              </span>
            </div>

            <div
              className={cn(
                "mt-[18px] pt-3.5 border-t border-(--line) grid grid-cols-2 gap-3",
                mono,
                "text-[10px] tracking-[0.16em] uppercase text-(--ink-dimmer)",
              )}
            >
              <span>
                Avg. rating
                <b
                  className={cn(
                    "block text-(--ink) font-normal",
                    serif,
                    "italic text-[22px] tracking-[-0.015em] normal-case mb-0.5",
                  )}
                >
                  4.8
                  <em className="italic text-(--accent-2)">/5</em>
                </b>
              </span>
              <span>
                From
                <b
                  className={cn(
                    "block text-(--ink) font-normal",
                    serif,
                    "italic text-[22px] tracking-[-0.015em] normal-case mb-0.5",
                  )}
                >
                  70+ studios
                </b>
              </span>
            </div>
          </aside>
        </motion.div>

        {/* BOTTOM — pull quote + stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
          className="mt-20 pt-8 border-t border-(--line) grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-6 items-stretch"
        >
          <div className="flex flex-col py-6 lg:pr-6 lg:border-r lg:border-(--line)">
            <span
              className={cn(
                mono,
                "text-[10px] tracking-[0.22em] uppercase text-(--ink-dimmer) mb-3.5 before:content-['→_'] before:text-(--accent-2)",
              )}
            >
              Press · The Photographer&rsquo;s Quarterly
            </span>
            <p
              className={cn(
                serif,
                "m-0 mb-3.5 italic font-light text-[22px] leading-[1.15] tracking-[-0.015em] text-(--ink) [text-wrap:pretty]",
                "[&_em]:italic [&_em]:text-(--accent-2)",
              )}
            >
              &ldquo;A delivery tool that finally <em>respects the work</em>.
              The dark-mode galleries alone are worth the switch.&rdquo;
            </p>
            <span
              className={cn(
                mono,
                "mt-auto text-[10px] tracking-[0.14em] uppercase text-(--ink-dim)",
              )}
            >
              <b className="text-(--ink)">Issue 14</b> · Spring 2026
            </span>
          </div>

          {[
            {
              cat: "Switched from",
              num: <em className="italic text-(--accent-2)">92%</em>,
              boldLabel: "switched from",
              sub: "Pixieset · Drive · WeTransfer",
            },
            {
              cat: "Time saved",
              num: (
                <>
                  4.2<em className="italic text-(--accent-2)">h</em>
                </>
              ),
              boldLabel: "per gallery",
              sub: "vs. previous workflow",
            },
            {
              cat: "Would recommend",
              num: (
                <>
                  9.6<em className="italic text-(--accent-2)">/10</em>
                </>
              ),
              boldLabel: "NPS score",
              sub: "across active studios",
            },
          ].map((s, i, arr) => (
            <div
              key={s.cat}
              className={cn(
                "flex flex-col py-6 lg:pr-6",
                i < arr.length - 1 && "lg:border-r lg:border-(--line)",
              )}
            >
              <span
                className={cn(
                  mono,
                  "text-[10px] tracking-[0.22em] uppercase text-(--ink-dimmer) mb-3.5 before:content-['→_'] before:text-(--accent-2)",
                )}
              >
                {s.cat}
              </span>
              <h4
                className={cn(
                  serif,
                  "m-0 italic font-light leading-[0.9] tracking-[-0.04em] text-(--ink)",
                  "text-[clamp(64px,6.5vw,92px)]",
                )}
              >
                {s.num}
              </h4>
              <span
                className={cn(
                  mono,
                  "mt-3 text-[10px] tracking-[0.18em] uppercase text-(--ink-dim) leading-[1.5]",
                )}
              >
                <b className="text-(--ink)">{s.boldLabel}</b>
                <br />
                {s.sub}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      <style>{`
        @keyframes fadein {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </section>
  );
}
