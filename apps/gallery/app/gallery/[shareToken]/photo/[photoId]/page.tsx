import { redirect } from "next/navigation";

type LegacyPhotoPageProps = {
  params: Promise<{ shareToken: string; photoId: string }>;
};

export default async function LegacyPhotoPage({ params }: LegacyPhotoPageProps) {
  const { shareToken, photoId } = await params;
  redirect(`/${shareToken}/photo/${photoId}`);
}
