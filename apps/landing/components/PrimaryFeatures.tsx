"use client";

import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { cn } from "@workspace/ui/lib/utils";
import type { CSSProperties } from "react";

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

const cellBase = cn(
  "group/cell relative flex flex-col overflow-hidden cursor-pointer p-7 rounded-[18px]",
  "bg-(--paper) border border-(--line) text-(--ink)",
  "transition-[transform,border-color,background] duration-500 ease-[cubic-bezier(.2,.8,.2,1)]",
  // "hover:border-(--line-strong) hover:bg-[color-mix(in_oklab,var(--paper)_80%,var(--bg-3))]",
  "before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:pointer-events-none",
  "before:opacity-0 group-hover/cell:before:opacity-100 before:transition-opacity before:duration-[400ms]",
  "before:[background:radial-gradient(400px_300px_at_var(--mx,50%)_var(--my,50%),var(--accent-soft),transparent_60%)]",
);

const numCls = cn(
  "absolute top-[22px] right-[26px] z-[3]",
  mono,
  "text-[11px] tracking-[0.18em] text-(--ink-dimmer)",
  "[&_em]:not-italic [&_em]:text-(--accent-2)",
);

const catCls = cn(
  mono,
  "text-[10px] tracking-[0.22em] uppercase text-(--ink-dimmer) mb-auto",
);

const cellHeading = cn(
  serif,
  "font-light text-(--ink) m-0 mb-[14px]",
  "text-[clamp(28px,2.6vw,42px)] leading-[0.95] tracking-[-0.025em]",
  "[&_em]:italic [&_em]:font-normal [&_em]:text-(--accent-2)",
);

const cellPara =
  "text-[13.5px] leading-[1.55] text-(--ink-dim) m-0 max-w-[42ch] [text-wrap:pretty]";

const footCls = cn(
  "mt-[18px] flex justify-between items-center",
  mono,
  "text-[10px] tracking-[0.16em] uppercase text-(--ink-dimmer)",
);

const pillCls =
  "border border-(--line-strong) rounded-full px-[10px] py-[5px] text-(--ink-2)";

const HeartFilled = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z" />
  </svg>
);
const HeartOutline = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z" />
  </svg>
);

type RevealProps = {
  className?: string;
  children: React.ReactNode;
};

const RevealArticle = ({ className, children }: RevealProps) => (
  <motion.article
    data-glow
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
    className={className}
  >
    {children}
  </motion.article>
);

const heartItems = [
  {
    on: true,
    left: "left-0",
    base: "rotate-[-8deg]",
    hover: "group-hover/fav:-rotate-[12deg] group-hover/fav:-translate-y-1",
  },
  {
    on: false,
    left: "left-[30px]",
    base: "rotate-[2deg] -translate-y-[6px]",
    hover: "group-hover/fav:rotate-[4deg] group-hover/fav:-translate-y-3",
  },
  {
    on: true,
    left: "left-[60px]",
    base: "rotate-[-4deg]",
    hover: "group-hover/fav:rotate-[-6deg] group-hover/fav:-translate-y-[6px]",
  },
  {
    on: false,
    left: "left-[90px]",
    base: "rotate-[6deg] -translate-y-1",
    hover: "group-hover/fav:rotate-[8deg] group-hover/fav:-translate-y-[10px]",
  },
  {
    on: true,
    left: "left-[120px]",
    base: "rotate-[-2deg]",
    hover: "group-hover/fav:rotate-[-4deg] group-hover/fav:-translate-y-[2px]",
  },
];

export function PrimaryFeatures() {
  const sectionRef = useRef<HTMLElement>(null);

  // Pointer-tracked accent glow per cell
  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    const cells = root.querySelectorAll<HTMLElement>("[data-glow]");
    const handle = (e: PointerEvent) => {
      const el = e.currentTarget as HTMLElement;
      const r = el.getBoundingClientRect();
      el.style.setProperty(
        "--mx",
        `${((e.clientX - r.left) / r.width) * 100}%`,
      );
      el.style.setProperty(
        "--my",
        `${((e.clientY - r.top) / r.height) * 100}%`,
      );
    };
    cells.forEach((el) => el.addEventListener("pointermove", handle));
    return () =>
      cells.forEach((el) => el.removeEventListener("pointermove", handle));
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      aria-label="Features"
      style={palette}
      className={cn(
        "relative overflow-hidden bg-(--bg) text-(--ink) py-20 pb-[140px] antialiased",
        "[font-family:var(--font-inter)]",
        "before:content-[''] before:absolute before:inset-0 before:pointer-events-none",
        "before:[background:radial-gradient(900px_500px_at_90%_0%,var(--accent-soft),transparent_60%),radial-gradient(700px_400px_at_0%_100%,color-mix(in_oklab,var(--accent)_8%,transparent),transparent_60%)]",
      )}
    >
      <div className="relative max-w-[1440px] mx-auto px-[clamp(20px,4vw,56px)]">
        {/* Section head */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
          className="grid grid-cols-1 sm:grid-cols-[1.4fr_1fr] gap-y-8 gap-x-16 items-end pb-10 mb-7 border-b border-(--line)"
        >
          <div className="flex flex-col gap-3.5">
            <h2 className="m-0 font-bold not-italic text-[clamp(56px,9vw,132px)] leading-[0.92] tracking-[-0.045em] [font-family:var(--font-inter)]">
              Everything
              <br />
              you need.
              <br />
              <em
                className={cn(
                  "italic font-bold text-(--accent-2) tracking-[-0.025em]",
                  serif,
                )}
              >
                Nothing
              </em>{" "}
              you don&apos;t.
            </h2>
          </div>
          <div className="sm:justify-self-end sm:text-right max-w-none sm:max-w-[360px]">
            <p className="m-0 text-sm leading-[1.55] text-(--ink-dim) [text-wrap:pretty]">
              Built from scratch for photographers who want a modern, premium
              experience for themselves and their clients. Each tool ships
              today, on the free tier, with no asterisks.
            </p>
          </div>
        </motion.div>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:auto-rows-[180px] gap-3.5 mt-8">
          {/* HERO 01 */}
          <RevealArticle
            className={cn(
              cellBase,
              "lg:col-span-8 lg:row-span-3 p-0 bg-(--ink) text-(--paper) border-(--ink)",
              "before:[background:radial-gradient(500px_400px_at_var(--mx,50%)_var(--my,50%),rgba(232,163,61,.18),transparent_60%)]",
            )}
          >
            <div className="contents">
              <span
                className={cn(
                  numCls,
                  "top-7 right-8 text-white/50",
                  "[&_em]:text-(--accent-2)",
                )}
              >
                01<em>/09</em>
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 h-full relative z-[2]">
                <div className="p-9 flex flex-col">
                  <span className={cn(catCls, "text-white/50")}>
                    Presentation
                  </span>
                  <div className="mt-auto">
                    <h3
                      className={cn(
                        cellHeading,
                        "text-(--paper) [&_em]:text-(--accent)",
                        "text-[clamp(48px,5.5vw,88px)] leading-[0.92]",
                      )}
                    >
                      <em>Presentation,</em>
                      <br />
                      not just delivery.
                    </h3>
                    <p
                      className={cn(
                        cellPara,
                        "text-white/70 text-[15px] max-w-[38ch]",
                      )}
                    >
                      Editorial layouts, buttery full-screen lightbox, 60fps
                      scroll on any device. Clients think you hand-coded a
                      custom site.
                    </p>
                    <div className={cn(footCls, "text-white/40")}>
                      <span>Editorial · Lightbox · Lazy-loaded</span>
                      <span
                        className={cn(
                          pillCls,
                          "text-(--paper) border-white/20",
                        )}
                      >
                        Signature
                      </span>
                    </div>
                  </div>
                </div>
                <div className="relative p-7 min-h-[320px] md:min-h-0">
                  <i
                    className="absolute top-7 right-7 w-[62%] h-[58%] rounded-md bg-cover bg-center bg-[#2a2620] shadow-[0_20px_50px_-20px_rgba(0,0,0,.6)] transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] group-hover/cell:-translate-x-1 group-hover/cell:-translate-y-1"
                    style={{
                      backgroundImage:
                        "url(https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80)",
                    }}
                  />
                  <i
                    className="absolute bottom-7 left-7 w-1/2 h-1/2 rounded-md bg-cover bg-center bg-[#2a2620] shadow-[0_20px_50px_-20px_rgba(0,0,0,.6)] transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] group-hover/cell:translate-x-1 group-hover/cell:translate-y-1"
                    style={{
                      backgroundImage:
                        "url(https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500&q=80)",
                    }}
                  />
                  <i
                    className="absolute top-[18%] left-[18%] w-[28%] h-[26%] rounded-md bg-cover bg-center bg-[#2a2620] shadow-[0_20px_50px_-20px_rgba(0,0,0,.6)] rotate-[-3deg] transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] group-hover/cell:rotate-[-6deg] group-hover/cell:-translate-y-1"
                    style={{
                      backgroundImage:
                        "url(https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400&q=80)",
                    }}
                  />
                  <i
                    className="absolute bottom-[22%] right-[14%] w-[26%] h-[24%] rounded-md bg-cover bg-center bg-[#2a2620] shadow-[0_20px_50px_-20px_rgba(0,0,0,.6)] rotate-[2deg] transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] group-hover/cell:rotate-[5deg] group-hover/cell:translate-y-1"
                    style={{
                      backgroundImage:
                        "url(https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&q=80)",
                    }}
                  />
                </div>
              </div>
            </div>
          </RevealArticle>

          {/* 02 Client favorites */}
          <RevealArticle
            className={cn(cellBase, "group/fav lg:col-span-4 lg:row-span-3")}
          >
            <div className="contents">
              <span className={numCls}>
                02<em>/09</em>
              </span>
              <span className={catCls}>Collaboration</span>
              <div className="mt-auto">
                <h3 className={cellHeading}>
                  Client <em>favorites.</em>
                </h3>
                <p className={cellPara}>
                  Clients star and comment, you get a shortlist. Live on your
                  dashboard, exportable to CSV.
                </p>
              </div>
              <div className="relative h-[72px] my-3.5 mb-3">
                {heartItems.map((h, i) => (
                  <span
                    key={i}
                    className={cn(
                      "absolute bottom-0 w-[38px] h-[38px] rounded-full grid place-items-center border transition-transform duration-400 ease-[cubic-bezier(.2,.8,.2,1)]",
                      h.on
                        ? "bg-(--accent-2) text-(--paper) border-(--accent-2)"
                        : "bg-(--paper) text-(--accent-2) border-(--line)",
                      h.left,
                      h.base,
                      h.hover,
                    )}
                  >
                    {h.on ? <HeartFilled /> : <HeartOutline />}
                  </span>
                ))}
              </div>
              <div className={footCls}>
                <span
                  className={cn(
                    serif,
                    "italic text-sm text-(--accent-2) normal-case tracking-normal",
                  )}
                >
                  <em className="italic">142</em> stars · live
                </span>
                <span className={pillCls}>Live</span>
              </div>
            </div>
          </RevealArticle>

          {/* 03 Comments */}
          <RevealArticle
            className={cn(cellBase, "lg:col-span-5 lg:row-span-2")}
          >
            <div className="contents">
              <span className={numCls}>
                03<em>/09</em>
              </span>
              <span className={catCls}>Feedback</span>
              <div className="mt-auto">
                <h3 className={cellHeading}>
                  Threaded <em>comments.</em>
                </h3>
                <p className={cellPara}>
                  Threaded feedback pinned to each photo. No more re-reading 40
                  texts looking for &ldquo;the one with the hat&rdquo;.
                </p>
              </div>
              <div className="mt-3.5 flex flex-col gap-1.5">
                <div className="bg-(--bg-2) border border-(--line) rounded-[10px] px-2.5 py-2 text-xs text-(--ink-2) leading-[1.4] max-w-[90%]">
                  <b
                    className={cn(
                      "block font-medium text-[9px] tracking-[0.12em] uppercase mb-0.5 text-(--accent-2)",
                      mono,
                    )}
                  >
                    Aanya — 2:41 PM
                  </b>
                  Love 47, can we crop tighter?
                </div>
                <div className="bg-(--ink) border border-(--ink) rounded-[10px] px-2.5 py-2 text-xs text-(--paper) leading-[1.4] max-w-[90%] self-end">
                  <b
                    className={cn(
                      "block font-medium text-[9px] tracking-[0.12em] uppercase mb-0.5 text-(--accent)",
                      mono,
                    )}
                  >
                    You — 2:42 PM
                  </b>
                  On it, re-uploading now.
                </div>
                <div className="bg-(--bg-2) border border-(--line) rounded-[10px] px-2.5 py-2 text-xs text-(--ink-2) leading-[1.4] max-w-[90%]">
                  <b
                    className={cn(
                      "block font-medium text-[9px] tracking-[0.12em] uppercase mb-0.5 text-(--accent-2)",
                      mono,
                    )}
                  >
                    Aanya — 2:44 PM
                  </b>
                  Perfect — print this one ✨
                </div>
              </div>
              <div className={footCls}>
                <span>Per-photo · Email digest</span>
                <span className={pillCls}>Threaded</span>
              </div>
            </div>
          </RevealArticle>

          {/* 04 Password */}
          <RevealArticle
            className={cn(cellBase, "lg:col-span-3 lg:row-span-2")}
          >
            <div className="contents">
              <span className={numCls}>
                04<em>/09</em>
              </span>
              <span className={catCls}>Privacy</span>
              <div className="mt-auto">
                <h3 className={cellHeading}>
                  Password <em>protection.</em>
                </h3>
                <p className={cellPara}>
                  Lock private sets behind a shared password.
                  Brute-force-protected, optional expiry.
                </p>
              </div>
              <div
                className={cn(
                  "mt-[18px] mb-3.5 bg-(--bg-2) border border-(--line) rounded-xl p-4 text-xs",
                  mono,
                )}
              >
                <div className="flex gap-1.5 mb-2.5 text-(--ink-dim) text-[10px] tracking-[0.12em] uppercase">
                  aanya-2025.fotno.com
                </div>
                <div className="flex gap-2 px-3 py-2.5 bg-(--paper) border border-(--line) rounded-lg text-base tracking-[0.5em] text-(--accent-2)">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <i
                      key={i}
                      className={cn(
                        "w-2 h-2 rounded-full bg-(--accent-2) inline-block",
                        i === 4 && "animate-pulse",
                      )}
                    />
                  ))}
                  <i className="w-2 h-2 rounded-full inline-block bg-transparent border border-(--accent-2)" />
                </div>
              </div>
              <div className={footCls}>
                <span>Bcrypt · SSL · Expiry</span>
                <span className={pillCls}>Pro</span>
              </div>
            </div>
          </RevealArticle>

          {/* 05 Custom slugs */}
          <RevealArticle
            className={cn(cellBase, "lg:col-span-4 lg:row-span-2")}
          >
            <div className="contents">
              <span className={numCls}>
                05<em>/09</em>
              </span>
              <span className={catCls}>Branding</span>
              <div className="mt-auto">
                <h3 className={cellHeading}>
                  Custom <em>slugs.</em>
                </h3>
                <p className={cellPara}>
                  Share clean, memorable URLs per gallery. No tokens. No
                  &ldquo;dl.dropboxusercontent&rdquo; weirdness.
                </p>
              </div>
              <div
                className={cn(
                  "mt-3.5 mb-2.5 bg-(--bg-2) border border-(--line) rounded-[10px] px-3.5 py-3 overflow-hidden whitespace-nowrap text-(--ink-dim) text-[13px]",
                  mono,
                )}
              >
                gallery.fotno.com/
                <span className="text-(--accent-2) font-medium">
                  aanya-and-ravi
                </span>
                <span className="inline-block w-2 h-3.5 bg-(--accent-2) ml-0.5 align-middle animate-pulse" />
              </div>
              <div className={footCls}>
                <span>Per-gallery slugs</span>
                <span className={pillCls}>Free</span>
              </div>
            </div>
          </RevealArticle>

          {/* 06 Download (full width) */}
          <RevealArticle
            className={cn(
              cellBase,
              "lg:col-span-12 lg:row-span-2 p-9 grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-6 md:gap-12 items-stretch",
            )}
          >
            <div className="contents">
              <span className={numCls}>
                06<em>/09</em>
              </span>
              <div className="flex flex-col">
                <span className={catCls}>Delivery</span>
                <div className="mt-auto">
                  <h3 className={cellHeading}>
                    High-res <em>download.</em>
                  </h3>
                  <p className={cellPara}>
                    High-res ZIP downloads for clients and you. Original
                    quality, no re-encoding, signed URLs.
                  </p>
                </div>
                <div className={footCls}>
                  <span>ZIP · Signed URLs</span>
                  <span className={pillCls}>Free</span>
                </div>
              </div>
              <div
                className={cn(
                  "self-center w-full bg-(--bg-2) border border-(--line) rounded-xl px-[22px] py-5",
                  mono,
                )}
              >
                <div className="flex justify-between text-[13px] text-(--ink-2) mb-2.5">
                  <span>aanya-ravi-2025.zip</span>
                  <span className="text-(--ink-dim)">3.2 GB</span>
                </div>
                <div className="h-1 bg-(--paper) rounded-sm overflow-hidden">
                  <i
                    className="block h-full bg-(--accent-2) rounded-sm"
                    style={{ width: "64%" }}
                  />
                </div>
                <div className="text-[11px] text-(--ink-dimmer) mt-2 tracking-[0.08em]">
                  312 photos · 64% · 1m 12s left
                </div>
              </div>
            </div>
          </RevealArticle>
        </div>

        {/* ROW 2 — three cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:auto-rows-[180px] gap-3.5 mt-3.5">
          {/* 07 Google import */}
          <RevealArticle
            className={cn(cellBase, "lg:col-span-4 lg:row-span-2")}
          >
            <div className="contents">
              <span className={numCls}>
                07<em>/09</em>
              </span>
              <span className={catCls}>Import</span>
              <div className="mt-auto">
                <h3 className={cellHeading}>
                  Google <em>import.</em>
                </h3>
                <p className={cellPara}>
                  Pull existing libraries straight into Fotno. Pick a Drive or
                  Photos folder, walk away.
                </p>
              </div>
              <div className="mt-3.5 flex flex-col gap-1.5">
                {[
                  {
                    ico: "GD",
                    icoBg: "bg-(--accent) text-(--ink)",
                    name: "Aanya & Ravi",
                    n: 312,
                  },
                  {
                    ico: "GP",
                    icoBg: "bg-(--ink) text-(--accent)",
                    name: "2025 — Editorial",
                    n: 88,
                  },
                ].map((src) => (
                  <div
                    key={src.ico}
                    className={cn(
                      "grid grid-cols-[28px_1fr_auto] items-center gap-2.5 px-2.5 py-2 bg-(--bg-2) border border-(--line) rounded-lg text-[11px] text-(--ink-2)",
                      mono,
                    )}
                  >
                    <span
                      className={cn(
                        "w-6 h-6 rounded-md grid place-items-center font-semibold text-[9px] tracking-[0.05em]",
                        src.icoBg,
                      )}
                    >
                      {src.ico}
                    </span>
                    <span>{src.name}</span>
                    <span className="text-(--ink-dimmer) text-[10px]">
                      {src.n}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </RevealArticle>

          {/* 08 Albums */}
          <RevealArticle
            className={cn(cellBase, "lg:col-span-4 lg:row-span-2")}
          >
            <div className="contents">
              <span className={numCls}>
                08<em>/09</em>
              </span>
              <span className={catCls}>Organize</span>
              <div className="mt-auto">
                <h3 className={cellHeading}>
                  Curated <em>albums.</em>
                </h3>
                <p className={cellPara}>
                  Organize gallery photos into curated albums for ceremony,
                  reception, portraits — whatever fits the day.
                </p>
              </div>
              <div className="mt-3.5 flex flex-col gap-1.5">
                {[
                  {
                    img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=200&q=70",
                    name: "Ceremony",
                    n: 48,
                  },
                  {
                    img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=200&q=70",
                    name: "Reception",
                    n: 112,
                  },
                  {
                    img: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=200&q=70",
                    name: "Portraits",
                    n: 26,
                  },
                ].map((al) => (
                  <div
                    key={al.name}
                    className={cn(
                      "grid grid-cols-[32px_1fr_auto] items-center gap-2.5 pl-1.5 pr-2.5 py-1.5 bg-(--bg-2) border border-(--line) rounded-lg text-[11px] text-(--ink-2)",
                      mono,
                    )}
                  >
                    <i
                      className="w-7 h-7 rounded-md bg-cover bg-center bg-(--bg-3)"
                      style={{ backgroundImage: `url(${al.img})` }}
                    />
                    <span>{al.name}</span>
                    <b className="text-(--accent-2) font-medium text-[10px]">
                      {al.n}
                    </b>
                  </div>
                ))}
              </div>
            </div>
          </RevealArticle>

          {/* 09 Print albums */}
          <RevealArticle
            className={cn(cellBase, "lg:col-span-4 lg:row-span-2")}
          >
            <div className="contents">
              <span className={numCls}>
                09<em>/09</em>
              </span>
              <span className={catCls}>Print</span>
              <div className="mt-auto">
                <h3 className={cellHeading}>
                  Print <em>albums.</em>
                </h3>
                <p className={cellPara}>
                  Let clients design and order printed photo albums. Linen
                  covers, lay-flat spreads, shipped direct.
                </p>
              </div>
              <div className="mt-3.5">
                <div className="grid grid-cols-2 gap-1 bg-(--bg-2) p-2 rounded-lg border border-(--line)">
                  <div className="bg-(--paper) border border-(--line) rounded h-20 flex gap-0.5 p-1 overflow-hidden">
                    <i
                      className="flex-1 bg-cover bg-center rounded-[2px]"
                      style={{
                        backgroundImage:
                          "url(https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=200&q=70)",
                      }}
                    />
                  </div>
                  <div className="bg-(--paper) border border-(--line) rounded h-20 flex gap-0.5 p-1 overflow-hidden">
                    <i
                      className="flex-1 bg-cover bg-center rounded-[2px]"
                      style={{
                        backgroundImage:
                          "url(https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&q=70)",
                      }}
                    />
                    <i
                      className="flex-1 bg-cover bg-center rounded-[2px]"
                      style={{
                        backgroundImage:
                          "url(https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=70)",
                      }}
                    />
                  </div>
                </div>
                <div
                  className={cn(
                    "text-[10px] text-(--ink-dim) mt-2 tracking-[0.08em]",
                    mono,
                  )}
                >
                  12×12″ · linen · 40 pgs
                </div>
              </div>
            </div>
          </RevealArticle>
        </div>

        {/* BOTTOM STRIP — analytics */}
        <div className="grid grid-cols-1 mt-3.5">
          <RevealArticle
            className={cn(
              cellBase,
              "p-8 grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-8 items-center min-h-[200px]",
            )}
          >
            <div className="contents">
              <span
                className={cn(
                  "absolute top-4 right-[18px]",
                  mono,
                  "text-[10px] tracking-[0.16em] text-(--ink-dimmer)",
                )}
              >
                — Insight
              </span>
              <div className="flex flex-col">
                <span className={catCls}>Reporting</span>
                <h3 className={cn(cellHeading, "text-[36px]")}>
                  Gallery <em>analytics.</em>
                </h3>
                <p className={cn(cellPara, "max-w-[32ch] text-[12.5px]")}>
                  See views, downloads, and top photos. Spot which sets clients
                  linger on — and which ones convert to print.
                </p>
              </div>
              <div>
                <div className="flex items-end gap-1 h-14 pb-1.5 border-b border-(--line)">
                  {[38, 62, 48, 88, 54, 72, 40].map((h, i) => (
                    <i
                      key={i}
                      className={cn(
                        "flex-1 rounded-t-[2px] min-h-[4px]",
                        i === 3
                          ? "bg-(--ink) opacity-100"
                          : "bg-(--accent-2) opacity-85",
                      )}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <div
                  className={cn(
                    "text-[10px] text-(--ink-dim) mt-2 tracking-[0.08em] [&_b]:text-(--ink)",
                    mono,
                  )}
                >
                  <b>2,184</b> views · <b>312</b> downloads · <b>47</b> top
                </div>
              </div>
            </div>
          </RevealArticle>
        </div>
      </div>
    </section>
  );
}
