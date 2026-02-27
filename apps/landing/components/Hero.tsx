"use client";
import { LayoutGroup, motion } from "motion/react";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { TextRotate } from "@workspace/ui/components/text-rotate";

export function Hero() {
  return (
    <Container className="pt-20 pb-16 text-center lg:pt-32">
      <div className="mx-auto w-full max-w-4xl text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-medium flex flex-col sm:flex-row flex-wrap items-center justify-center bg-background text-foreground p-6 sm:p-12 md:p-16 lg:p-20">
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
              FOTNO makes it easy to{" "}
            </motion.span>
            <TextRotate
              texts={[
                " Share ",
                " Store ",
                " Showcase ",
                " Deliver ",
                " Connect ",
              ]}
              mainClassName="text-primary-foreground px-2 sm:px-2 md:px-3 bg-primary overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg mx-1"
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
              for Photographers.
            </motion.span>
          </motion.h1>
        </LayoutGroup>
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-muted-foreground">
        The all-in-one platform for photographers. Upload, organize, and deliver
        stunning galleries to your clients -- with password protection, favorites,
        and a seamless experience they'll love.
      </p>
      <div className="mt-10 flex justify-center gap-x-6">
        <Button href={`${process.env.NEXT_PUBLIC_AUTH_URL}/account`}>
          Get 1 month free
        </Button>
        <Button
          href="#features"
          variant="outline"
          color="main"
        >
          <svg
            aria-hidden="true"
            className="h-3 w-3 flex-none fill-primary group-active:fill-current"
          >
            <path d="m9.997 6.91-7.583 3.447A1 1 0 0 1 1 9.447V2.553a1 1 0 0 1 1.414-.91L9.997 5.09c.782.355.782 1.465 0 1.82Z" />
          </svg>
          <span className="ml-3">See features</span>
        </Button>
      </div>
      <div className="mt-36 lg:mt-44">
        <p className="text-base text-muted-foreground">
          Trusted by photographers who care about their craft
        </p>
        <div className="mt-8 flex items-center justify-center gap-x-8 text-muted-foreground/60">
          <span className="text-lg font-semibold tracking-tight">Wedding</span>
          <span className="text-border">|</span>
          <span className="text-lg font-semibold tracking-tight">Portrait</span>
          <span className="text-border">|</span>
          <span className="text-lg font-semibold tracking-tight">Product</span>
          <span className="text-border">|</span>
          <span className="text-lg font-semibold tracking-tight">Event</span>
          <span className="text-border">|</span>
          <span className="text-lg font-semibold tracking-tight">Fashion</span>
        </div>
      </div>
    </Container>
  );
}
