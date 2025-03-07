import { ResetPasswordForm } from "@/components/reset-password-form";
import { Section } from "@workspace/ui/components/craft";
import { Icons } from "@workspace/ui/components/icons";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const token = await searchParams.then((params) => params.token);

  if (!token) {
    redirect("/login");
  }

  return (
    <Section className="bg-background min-h-svh m-auto flex flex-col items-center justify-center">
      <Link href="#" aria-label="Home">
        <div className="flex items-center justify-center gap-2">
          <Icons.logo className="h-8 w-auto text-primary" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-foreground bg-clip-text text-transparent">
            FOTNO
          </h1>
        </div>
      </Link>
      <div className="w-full max-w-sm md:max-w-4xl p-6 md:p-10">
        <ResetPasswordForm token={token} />
      </div>
    </Section>
  );
}
