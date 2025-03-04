import { redirect } from "next/navigation";

export default async function NotFound() {
  redirect("/");
  return <div>Not Found</div>;
}
