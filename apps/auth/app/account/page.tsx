import { UnifiedAuthForm } from "@/components/unified-auth-form";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const email = params.email;
  const plan = typeof params.plan === "string" ? params.plan : undefined;
  const callbackURL =
    typeof params.callbackURL === "string" ? params.callbackURL : undefined;
  return (
    <UnifiedAuthForm
      resetEmail={email}
      plan={plan}
      callbackURL={callbackURL}
    />
  );
}
