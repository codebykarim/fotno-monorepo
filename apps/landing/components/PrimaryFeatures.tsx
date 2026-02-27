"use client";

import { useState } from "react";
import { cn } from "@workspace/ui/lib/utils";
import { Container } from "@/components/Container";
import {
  Images,
  Shield,
  Heart,
  Upload,
  Globe,
  Palette,
} from "lucide-react";

const features = [
  {
    title: "Stunning galleries",
    description:
      "Create beautiful, responsive photo galleries for every session. Your clients see their photos in a premium lightbox experience -- no clunky downloads or zip files.",
    icon: Images,
  },
  {
    title: "Password protection",
    description:
      "Every gallery can be locked behind a password so only your clients can view their photos. Share the link and the password -- done.",
    icon: Shield,
  },
  {
    title: "Client favorites",
    description:
      "Clients tap the heart icon on photos they love. You see their picks in real-time on your dashboard, making final selection effortless.",
    icon: Heart,
  },
  {
    title: "Bulk upload",
    description:
      "Drag-and-drop hundreds of photos at once. Our upload pipeline handles chunked multipart uploads with automatic retries so nothing gets lost.",
    icon: Upload,
  },
  {
    title: "Custom delivery links",
    description:
      "Each gallery gets a clean slug URL on your own Fotno subdomain. Share a link that looks professional, not a random cloud storage URL.",
    icon: Globe,
  },
  {
    title: "Dark mode everywhere",
    description:
      "Your brand, your vibe. Every Fotno surface supports light and dark mode. Galleries adapt to your client's preference automatically.",
    icon: Palette,
  },
];

export function PrimaryFeatures() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section
      id="features"
      aria-label="Fotno features"
      className="bg-foreground py-20 sm:py-32"
    >
      <Container>
        <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
          <h2 className="text-3xl tracking-tight text-background sm:text-4xl md:text-5xl font-semibold">
            Everything you need to deliver photos professionally.
          </h2>
          <p className="mt-6 text-lg tracking-tight text-background/60">
            Built from scratch for photographers who want a modern, premium
            experience for themselves and their clients.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:mt-20 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={cn(
                  "group relative rounded-2xl border border-white/10 p-8 transition-all duration-300",
                  hoveredIndex === index
                    ? "bg-white/10 border-primary/40"
                    : "bg-white/5 hover:bg-white/8"
                )}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="mb-4 inline-flex rounded-xl bg-primary/20 p-3">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-background">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-background/60">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
