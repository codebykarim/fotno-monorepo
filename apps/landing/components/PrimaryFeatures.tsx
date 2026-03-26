"use client";

import { motion } from "motion/react";
import { cn } from "@workspace/ui/lib/utils";
import { Container } from "@/components/Container";
import {
  Images,
  Shield,
  Heart,
  Upload,
  Globe,
  Palette,
  Sparkles,
  Camera,
  type LucideIcon,
} from "lucide-react";

type Feature = {
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
};

const features: Feature[] = [
  {
    title: "Stunning galleries",
    description:
      "Create beautiful, responsive photo galleries for every session. Clients experience their photos in a premium lightbox.",
    icon: Images,
    className: "md:col-span-2",
  },
  {
    title: "Password protection",
    description:
      "Lock every gallery behind a password. Share the link and the code — your client's photos stay private and secure.",
    icon: Shield,
  },
  {
    title: "Client favorites",
    description:
      "Clients tap hearts on photos they love. You see their picks in real-time on your dashboard, making final selection effortless.",
    icon: Heart,
  },
  {
    title: "Bulk upload",
    description:
      "Drag-and-drop hundreds of photos at once. Chunked multipart uploads with automatic retries so nothing gets lost.",
    icon: Upload,
  },
  // {
  //   title: "AI-powered captions",
  //   description:
  //     "Automatically generate intelligent captions for your photos using AI. Save hours of manual work on every gallery.",
  //   icon: Sparkles,
  // },
  {
    title: "Dark mode everywhere",
    description:
      "Every surface supports light and dark mode. Galleries adapt to your client's preference automatically.",
    icon: Palette,
  },
  {
    title: "Custom delivery links",
    description:
      "Each gallery gets a clean slug URL on your Fotno subdomain. Professional links, not random cloud storage URLs.",
    icon: Globe,
    className: "md:col-span-2",
  },
  {
    title: "Google Drive & Photos import",
    description:
      "Import directly from Google Drive or Google Photos. No need to download and re-upload — just connect and go.",
    icon: Camera,
  },
];

export function PrimaryFeatures() {
  return (
    <section
      id="features"
      aria-label="Features"
      className="relative overflow-hidden bg-foreground py-24 sm:py-32"
    >
      {/* Decorative gradient orbs */}
      <div
        className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full opacity-30 blur-3xl"
        style={{ background: "oklch(0.78 0.14 65 / 0.15)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full opacity-30 blur-3xl"
        style={{ background: "oklch(0.65 0.12 50 / 0.12)" }}
      />

      <Container className="relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Features
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-background sm:text-4xl lg:text-5xl">
            Everything you need to deliver like a pro
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-background/50">
            Built from scratch for photographers who want a modern, premium
            experience for themselves and their clients.
          </p>
        </motion.div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                className={cn(
                  "group relative rounded-2xl border border-background/[0.08] bg-gradient-to-b from-background/[0.08] to-transparent p-8 transition-all duration-300 hover:border-primary/20 hover:from-background/[0.12]",
                  feature.className,
                )}
              >
                <div className="mb-5 inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 p-3 ring-1 ring-inset ring-primary/10 transition-shadow duration-300 group-hover:ring-primary/25">
                  <Icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-background">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-background/45">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
