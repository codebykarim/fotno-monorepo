"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Container } from "@/components/Container";
import avatarImage1 from "@/images/avatars/avatar-1.png";
import avatarImage2 from "@/images/avatars/avatar-2.png";
import avatarImage3 from "@/images/avatars/avatar-3.png";
import avatarImage4 from "@/images/avatars/avatar-4.png";
import avatarImage5 from "@/images/avatars/avatar-5.png";

const testimonials = [
  [
    {
      content:
        "Fotno completely changed how I deliver to clients. The password-protected galleries look so professional — my clients think I built a custom site for them.",
      author: {
        name: "Sarah Mitchell",
        role: "Wedding Photographer",
        image: avatarImage1,
      },
    },
    {
      content:
        "The bulk upload is a game-changer. I shot 2,000 photos at an event and had the gallery live within the hour. No more wrestling with WeTransfer links.",
      author: {
        name: "James Chen",
        role: "Event Photographer",
        image: avatarImage4,
      },
    },
  ],
  [
    {
      content:
        "I love the favorites feature. My clients pick their top shots, I see them instantly in my dashboard. Selection rounds that used to take weeks now take days.",
      author: {
        name: "Lina Kareem",
        role: "Portrait Photographer",
        image: avatarImage5,
      },
    },
    {
      content:
        "Clean, fast, beautiful. That's all I needed for client delivery and Fotno nails it. The dark mode galleries are especially stunning for my moody editorial work.",
      author: {
        name: "Omar Hassan",
        role: "Fashion Photographer",
        image: avatarImage2,
      },
    },
  ],
  [
    {
      content:
        "Switched from Google Drive links to Fotno and my client satisfaction went through the roof. The gallery experience just feels premium.",
      author: {
        name: "Nadia Fouad",
        role: "Product Photographer",
        image: avatarImage3,
      },
    },
    {
      content:
        "As a studio owner, I needed something that scales. Fotno handles our 50+ galleries without breaking a sweat and the pricing actually makes sense.",
      author: {
        name: "Karim Youssef",
        role: "Studio Owner",
        image: avatarImage4,
      },
    },
  ],
];

function StarRating() {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className="h-4 w-4 fill-primary text-primary"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section
      id="testimonials"
      aria-label="What our customers are saying"
      className="relative overflow-hidden bg-muted py-24 sm:py-32"
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
            Testimonials
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Loved by photographers
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Hear from real photographers who upgraded their delivery workflow
            with Fotno.
          </p>
        </motion.div>

        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-3"
        >
          {testimonials.map((column, columnIndex) => (
            <li key={columnIndex}>
              <ul role="list" className="flex flex-col gap-y-6 sm:gap-y-8">
                {column.map((testimonial, testimonialIndex) => (
                  <motion.li
                    key={testimonialIndex}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{
                      duration: 0.5,
                      delay: columnIndex * 0.1 + testimonialIndex * 0.05,
                    }}
                  >
                    <figure className="group relative rounded-2xl border border-border/50 bg-card p-6 shadow-sm transition-all duration-300 hover:border-border hover:shadow-md">
                      <div className="mb-4">
                        <StarRating />
                      </div>
                      <blockquote className="relative">
                        <p className="text-base leading-relaxed text-foreground">
                          &ldquo;{testimonial.content}&rdquo;
                        </p>
                      </blockquote>
                      <figcaption className="relative mt-6 flex items-center gap-4 border-t border-border/50 pt-6">
                        <div className="overflow-hidden rounded-full bg-muted ring-2 ring-border/50">
                          <Image
                            className="h-12 w-12 object-cover"
                            src={testimonial.author.image}
                            alt=""
                            width={48}
                            height={48}
                          />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-foreground">
                            {testimonial.author.name}
                          </div>
                          <div className="mt-0.5 text-sm text-muted-foreground">
                            {testimonial.author.role}
                          </div>
                        </div>
                      </figcaption>
                    </figure>
                  </motion.li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
