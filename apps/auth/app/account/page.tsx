import { UnifiedAuthForm } from "@/components/unified-auth-form";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const email = await searchParams.then((params) => params.email);
  return <UnifiedAuthForm resetEmail={email} />;
}
