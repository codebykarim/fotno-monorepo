import { backendJsonFetch } from "@/lib/backend";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const res = await backendJsonFetch(`/api/admin/users/${id}/impersonate`, {
    method: "POST",
    body: JSON.stringify({}),
  });
  return Response.json(await res.json(), { status: res.status });
}
