import { ResetPasswordForm } from "@/components/reset-password-form";
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

  return <ResetPasswordForm token={token} />;
}
