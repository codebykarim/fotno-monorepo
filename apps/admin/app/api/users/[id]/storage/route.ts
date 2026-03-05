import { backendJsonFetch } from "@/lib/backend";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const res = await backendJsonFetch(`/api/admin/users/${id}/storage`);
  return Response.json(await res.json(), { status: res.status });
}
