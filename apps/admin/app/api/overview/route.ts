import { backendJsonFetch } from "@/lib/backend";

export async function GET() {
  const res = await backendJsonFetch("/api/admin/overview");
  return Response.json(await res.json(), { status: res.status });
}
