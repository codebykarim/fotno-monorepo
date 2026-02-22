import { redirect } from "next/navigation";

export default async function NotFound() {
  redirect("/account");
  return <div>Not Found</div>;
}
