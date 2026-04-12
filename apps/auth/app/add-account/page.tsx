import { UnifiedAuthForm } from "@/components/unified-auth-form";

export default async function AddAccountPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const plan = typeof params.plan === "string" ? params.plan : undefined;
  const callbackURL =
    typeof params.callbackURL === "string" ? params.callbackURL : undefined;
  return (
    <UnifiedAuthForm
      addAccountMode
      plan={plan}
      callbackURL={callbackURL}
    />
  );
}
