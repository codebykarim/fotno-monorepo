import { redirect } from "next/navigation";

type LegacyGalleryPageProps = {
  params: Promise<{ shareToken: string }>;
};

export default async function LegacyGalleryPage({
  params,
}: LegacyGalleryPageProps) {
  const { shareToken } = await params;
  redirect(`/${shareToken}`);
}
