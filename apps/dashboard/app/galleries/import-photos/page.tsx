import { redirect } from "next/navigation";

export default function ImportPhotosRedirect() {
  redirect("/galleries/import?source=gphotos");
}
