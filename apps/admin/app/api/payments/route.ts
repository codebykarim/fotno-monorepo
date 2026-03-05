import { backendJsonFetch } from "@/lib/backend";
import { type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams.toString();
  const res = await backendJsonFetch(`/api/admin/payments?${params}`);
  return Response.json(await res.json(), { status: res.status });
}
