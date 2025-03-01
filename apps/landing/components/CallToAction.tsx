import Image from "next/image";

import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import backgroundImage from "@/images/background-call-to-action.jpg";

export function CallToAction() {
  return (
    <section
      id="get-started-today"
      className="relative overflow-hidden bg-foreground py-32"
    >
      {/* <Image
        className="absolute top-1/2 left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
        src={backgroundImage}
        alt=""
        width={2347}
        height={1244}
        unoptimized
      /> */}
      <Container className="relative">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="font-display text-3xl tracking-tight text-background sm:text-4xl">
            Get started today
          </h2>
          <p className="mt-4 text-lg tracking-tight text-background">
            It’s time to take control of your photos and videos. Subscribe to
            Fotno today and get 1 month <span className="font-bold">Free</span>.
          </p>
          <Button
            href={`${process.env.NEXT_PUBLIC_AUTH_URL}/register`}
            color="secondary"
            className="mt-10"
          >
            Get 1 month free
          </Button>
        </div>
      </Container>
    </section>
  );
}
