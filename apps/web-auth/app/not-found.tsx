import { redirect } from "next/navigation";

export default async function NotFound() {
  redirect("/login");
  return <div>Not Found</div>;
}
