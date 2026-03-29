"use client";

import { motion } from "motion/react";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";

export function CallToAction() {
  return (
    <section
      id="get-started-today"
      className="relative isolate overflow-hidden py-24 sm:py-32"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.72 0.14 65) 0%, oklch(0.65 0.14 50) 50%, oklch(0.58 0.12 40) 100%)",
      }}
    >
      {/* Decorative blur circles */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-[120%] -translate-x-1/2 bg-gradient-to-b from-white/[0.06] to-transparent" />

      <Container className="relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Ready to deliver like a pro?
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-white/80">
            Join photographers who've upgraded their delivery workflow. Sign up,
            choose a plan, and start creating stunning galleries in minutes.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              href={`${process.env.NEXT_PUBLIC_AUTH_URL}/account?plan=Free`}
              color="white"
              className="w-full px-8 py-3 text-base sm:w-auto"
            >
              Get started free
            </Button>
            <Button
              href="#pricing"
              variant="outline"
              color="white"
              className="w-full px-8 py-3 text-base sm:w-auto"
            >
              View pricing
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
