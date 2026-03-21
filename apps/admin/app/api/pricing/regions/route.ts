import { backendJsonFetch } from "@/lib/backend";

export async function POST(req: Request) {
  const body = await req.json();
  const res = await backendJsonFetch("/api/admin/pricing/regions", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return Response.json(await res.json(), { status: res.status });
}
