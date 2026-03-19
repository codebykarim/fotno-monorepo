import { Button } from "@/components/Button";
import { Container } from "@/components/Container";

export function CallToAction() {
  return (
    <section
      id="get-started-today"
      className="relative overflow-hidden py-32"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.72 0.14 65) 0%, oklch(0.65 0.14 50) 50%, oklch(0.60 0.12 40) 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, oklch(1 0 0 / 0.15), transparent 60%), radial-gradient(circle at 80% 50%, oklch(1 0 0 / 0.1), transparent 50%)",
        }}
      />
      <Container className="relative">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="text-3xl tracking-tight font-semibold text-primary-foreground sm:text-4xl">
            Start delivering like a pro
          </h2>
          <p className="mt-4 text-lg tracking-tight text-primary-foreground/80">
            Join hundreds of photographers who've upgraded their delivery
            workflow. Sign up and choose a plan to get started.
          </p>
          <Button
            href={`${process.env.NEXT_PUBLIC_AUTH_URL}/account`}
            color="white"
            className="mt-10"
          >
            Get started
          </Button>
        </div>
      </Container>
    </section>
  );
}
