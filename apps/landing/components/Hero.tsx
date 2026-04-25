"use client";

import { LayoutGroup, motion } from "motion/react";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { TextRotate } from "@workspace/ui/components/text-rotate";

function formatCount(count: number): string {
  if (count >= 1_000_000)
    return `${(count / 1_000_000).toFixed(count >= 10_000_000 ? 0 : 1).replace(/\.0$/, "")}M+`;
  if (count >= 1_000)
    return `${(count / 1_000).toFixed(count >= 10_000 ? 0 : 1).replace(/\.0$/, "")}K+`;
  return `${count}`;
}

export type HeroStats = {
  photoCount: number;
  galleryCount: number;
  photographerCount: number;
  favoriteCount: number;
};

export function Hero({
  photoCount,
  galleryCount,
  photographerCount,
  favoriteCount,
}: HeroStats) {
  const stats = [
    { value: formatCount(photoCount), label: "Photos delivered" },
    { value: formatCount(galleryCount), label: "Galleries" },
    // { value: formatCount(photographerCount), label: "Photographers" },
    // { value: formatCount(favoriteCount), label: "Favorites picked" },
    { value: "99.9%", label: "Uptime" },
    { value: "4.9/5", label: "User rating" },
  ];
  return (
    <div className="relative isolate overflow-hidden bg-background">
      {/* Gradient mesh background */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute -top-1/2 left-1/2 h-[200%] w-[200%] -translate-x-1/2 opacity-40 dark:opacity-20"
          style={{
            background: `
              radial-gradient(ellipse 50% 80% at 20% 40%, oklch(0.78 0.14 65 / 0.3) 0%, transparent 100%),
              radial-gradient(ellipse 50% 80% at 80% 50%, oklch(0.65 0.12 50 / 0.2) 0%, transparent 100%),
              radial-gradient(ellipse 40% 60% at 50% 90%, oklch(0.72 0.10 80 / 0.15) 0%, transparent 100%)
            `,
          }}
        />
      </div>

      <Container className="relative pb-20 pt-20 sm:pb-32 sm:pt-32 lg:pb-40 lg:pt-44">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <div className="inline-flex items-center text-xs gap-2.5 rounded-full border border-border/80 bg-background/60 px-4 py-1.5 md:text-sm text-muted-foreground shadow-sm backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/80 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Built for professional photographers.
          </div>
        </motion.div>

        {/* Headline with rotating text */}
        <div className="mx-auto mt-10 w-full max-w-5xl text-3xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          <LayoutGroup>
            <motion.h1
              className="flex flex-wrap items-center justify-center text-center"
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <motion.span
                className="pt-0.5 sm:pt-1 md:pt-2"
                layout
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
              >
                The best way to{" "}
              </motion.span>
              <TextRotate
                texts={[
                  " Share ",
                  " Deliver ",
                  " Showcase ",
                  " Protect ",
                  " Store ",
                ]}
                mainClassName="text-primary-foreground px-2 sm:px-3 md:px-4 bg-primary overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-xl mx-1 sm:mx-2"
                staggerFrom={"last"}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={2500}
              />
              <motion.span
                className="pt-0.5 sm:pt-1 md:pt-2"
                layout
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
              >
                {" "}
                your photography.
              </motion.span>
            </motion.h1>
          </LayoutGroup>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-8 max-w-2xl text-center text-lg leading-relaxed text-muted-foreground sm:text-xl"
        >
          FOTNO is the modern photo gallery delivery platform for photographers.
          Upload, organize, and deliver stunning password-protected galleries.
          Your clients pick favorites in real-time, no clunky links.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-5"
        >
          <Button
            href={`${process.env.NEXT_PUBLIC_AUTH_URL}/account?plan=Free`}
            className="w-full px-8 py-3 text-base sm:w-auto"
          >
            Get started free
          </Button>
          <Button
            href="#features"
            variant="outline"
            color="main"
            className="w-full px-8 py-3 text-base sm:w-auto"
          >
            <span>See features</span>
            <svg
              className="ml-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
              />
            </svg>
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mx-auto mt-20 max-w-3xl sm:mt-24"
        >
          <div className="grid grid-cols-2 gap-y-6 sm:grid-cols-4 sm:gap-y-8">
            {stats.map((stat) => (
              <div key={stat.label} className="px-3 text-center sm:px-4">
                <div className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </Container>
    </div>
  );
}
