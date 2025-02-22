import { ResetPasswordForm } from "@/components/reset-password-form";
import { Section } from "@workspace/ui/lib/craft";
import { Icons } from "@workspace/ui/lib/icons";
import Link from "next/link";
import { redirect } from "next/navigation";

type tParams = Promise<{ token: string[] }>;

export default async function ResetPasswordPage(props: { params: tParams }) {
  // const { token } = await props.params;

  const token = Array.isArray((await props.params).token)
    ? (await props.params).token[0]
    : (await props.params).token;

  if (!token) {
    redirect("/login");
  }

  return (
    <Section className="bg-muted min-h-svh m-auto flex flex-col items-center justify-center ">
      <Link href="https://fotno.com">
        <div className="flex items-center justify-center gap-2">
          <Icons.logo className="h-8 w-auto text-blue-500" />
          <h1 className="text-2xl font-bold">FOTNO</h1>
        </div>
      </Link>
      <div className="w-full max-w-sm md:max-w-4xl p-6 md:p-10">
        <ResetPasswordForm token={token} />
      </div>
    </Section>
  );
}
