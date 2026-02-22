import { redirect } from "next/navigation";

export default function GalleryHomePage() {
  redirect(`${process.env.NEXT_PUBLIC_LANDING_URL}`);
}
