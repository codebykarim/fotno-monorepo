"use client";
import Image from "next/image";
import { LayoutGroup, motion } from "motion/react";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import logoLaravel from "@/images/logos/laravel.svg";
import logoMirage from "@/images/logos/mirage.svg";
import logoStatamic from "@/images/logos/statamic.svg";
import logoStaticKit from "@/images/logos/statickit.svg";
import logoTransistor from "@/images/logos/transistor.svg";
import logoTuple from "@/images/logos/tuple.svg";
import { TextRotate } from "@workspace/ui/components/text-rotate";
export function Hero() {
  return (
    <Container className="pt-20 pb-16 text-center lg:pt-32">
      <div className="mx-auto w-full max-w-4xl text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-medium flex flex-col sm:flex-row flex-wrap items-center justify-center font-overusedGrotesk bg-background dark:text-muted text-foreground p-6 sm:p-12 md:p-16 lg:p-20">
        <LayoutGroup>
          <motion.h1
            className="flex flex-wrap justify-center text-center sm:text-left whitespace-pre-wrap sm:whitespace-pre"
            layout
          >
            <motion.span
              className="pt-0.5 sm:pt-1 md:pt-2"
              layout
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
            >
              FOTNO Made it easy to{" "}
            </motion.span>
            <TextRotate
              texts={[
                " Share ",
                " Store ",
                " Showcase ",
                " Edit ",
                " Connect ",
              ]}
              mainClassName="text-white px-2 sm:px-2 md:px-3 bg-primary overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg mx-1"
              staggerFrom={"last"}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={2000}
            />
            <motion.span
              className="pt-0.5 sm:pt-1 md:pt-2"
              layout
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
            >
              {" "}
              For Photographers.
            </motion.span>
          </motion.h1>
        </LayoutGroup>
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-foreground/80">
        Throw away your clunky old way of managing your clients We've built a
        platform that makes it easy to manage your photos and videos.
      </p>
      <div className="mt-10 flex justify-center gap-x-6">
        <Button href={`${process.env.NEXT_PUBLIC_AUTH_URL}/register`}>
          Get 1 month free
        </Button>
        <Button
          href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          variant="outline"
          color="main"
        >
          <svg
            aria-hidden="true"
            className="h-3 w-3 flex-none fill-primary group-active:fill-current"
          >
            <path d="m9.997 6.91-7.583 3.447A1 1 0 0 1 1 9.447V2.553a1 1 0 0 1 1.414-.91L9.997 5.09c.782.355.782 1.465 0 1.82Z" />
          </svg>
          <span className="ml-3">Learn more</span>
        </Button>
      </div>
      <div className="mt-36 lg:mt-44">
        <p className="font-display text-base text-slate-900">
          Trusted by these photographers so far
        </p>
        <ul
          role="list"
          className="mt-8 flex items-center justify-center gap-x-8 sm:flex-col sm:gap-x-0 sm:gap-y-10 xl:flex-row xl:gap-x-12 xl:gap-y-0"
        >
          {[
            [
              { name: "Transistor", logo: logoTransistor },
              { name: "Tuple", logo: logoTuple },
              { name: "StaticKit", logo: logoStaticKit },
            ],
            [
              { name: "Mirage", logo: logoMirage },
              { name: "Laravel", logo: logoLaravel },
              { name: "Statamic", logo: logoStatamic },
            ],
          ].map((group, groupIndex) => (
            <li key={groupIndex}>
              <ul
                role="list"
                className="flex flex-col items-center gap-y-8 sm:flex-row sm:gap-x-12 sm:gap-y-0"
              >
                {group.map((company) => (
                  <li key={company.name} className="flex">
                    <Image src={company.logo} alt={company.name} unoptimized />
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}
