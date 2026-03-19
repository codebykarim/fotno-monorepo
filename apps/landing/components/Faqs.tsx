"use client";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Container } from "@/components/Container";

const faqs = [
  {
    question: "How does gallery delivery work?",
    answer:
      "Upload your photos to a gallery, set a password, and share the link with your client. They view the photos in a beautiful lightbox, tap hearts on their favorites, and you see the picks on your dashboard.",
  },
  {
    question: "Can my clients download photos?",
    answer:
      "Yes. You control whether downloads are enabled per gallery. Clients can download individual photos or the full gallery depending on your settings.",
  },
  {
    question: "Is there a limit on photo uploads?",
    answer:
      "Each plan includes a storage quota. Within that quota you can upload as many photos as you want. Our chunked upload pipeline handles even large RAW exports reliably.",
  },
  {
    question: "How does the favorites feature work?",
    answer:
      "When viewing a gallery, clients can tap a heart icon on any photo. You see their selections in real-time on your dashboard, making final edits and album curation a breeze.",
  },
  {
    question: "Can I use my own domain?",
    answer:
      "Custom domains are on our roadmap. For now, every gallery gets a clean slug URL on your Fotno subdomain (e.g. gallery.fotno.com/your-shoot).",
  },
  {
    question: "What happens if I exceed my storage?",
    answer:
      "We don't cut you off. Overage is billed at a fair per-GB rate, clearly shown in your dashboard so there are no surprises.",
  },
  {
    question: "Is my data secure?",
    answer:
      "All photos are stored on enterprise-grade cloud infrastructure with encryption at rest. Gallery passwords are hashed, and all traffic is served over HTTPS.",
  },
  {
    question: "How do I get started?",
    answer:
      "Sign up for a free account, choose the storage plan that fits your needs, and start uploading photos right away. It takes less than 2 minutes.",
  },
  {
    question: "How do I get support?",
    answer:
      "Email us at support@fotno.com. All customers receive the same responsive support — no tiered priority.",
  },
];

export function Faqs() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="bg-background py-24 sm:py-32"
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            FAQ
          </p>
          <h2
            id="faq-title"
            className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            Frequently asked questions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Can&apos;t find what you&apos;re looking for?{" "}
            <Link
              href="mailto:support@fotno.com"
              className="text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
            >
              Contact our team
            </Link>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-16 max-w-3xl divide-y divide-border"
        >
          {faqs.map((faq, index) => (
            <Disclosure as="div" key={index}>
              <DisclosureButton className="group flex w-full items-center justify-between py-6 text-left">
                <span className="text-base font-semibold text-foreground transition-colors group-hover:text-primary">
                  {faq.question}
                </span>
                <ChevronDown className="ml-4 h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[open]:rotate-180" />
              </DisclosureButton>
              <DisclosurePanel
                transition
                className="origin-top pb-6 pr-12 text-base leading-relaxed text-muted-foreground transition duration-200 ease-out data-[closed]:-translate-y-4 data-[closed]:opacity-0"
              >
                {faq.answer}
              </DisclosurePanel>
            </Disclosure>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
