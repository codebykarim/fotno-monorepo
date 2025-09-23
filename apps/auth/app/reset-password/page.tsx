import { ResetPasswordForm } from "@/components/reset-password-form";
import { redirect } from "next/navigation";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const token = await searchParams.then((params) => params.token);
  const email = await searchParams.then((params) => params.email);

  if (!token) {
    redirect("/account");
  }

  return <ResetPasswordForm token={token} email={email} />;
}
