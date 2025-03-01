import { RegisterForm } from "@/components/register-form";
import { Section } from "@workspace/ui/lib/craft";
import { Icons } from "@workspace/ui/lib/icons";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <Section className="bg-foreground min-h-svh m-auto flex flex-col items-center justify-center">
      <Link href={`${process.env.NEXT_PUBLIC_LANDING_URL}`} aria-label="Home">
        <div className="flex items-center justify-center gap-2">
          <Icons.logo className="h-8 w-auto text-secondary" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-secondary to-background bg-clip-text text-transparent">
            FOTNO
          </h1>
        </div>
      </Link>
      <div className="w-full max-w-sm md:max-w-4xl p-6 md:p-10">
        <RegisterForm />
      </div>
    </Section>
  );
}
