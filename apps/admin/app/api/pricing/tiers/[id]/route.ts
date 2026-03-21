import { backendJsonFetch } from "@/lib/backend";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const res = await backendJsonFetch(`/api/admin/pricing/tiers/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  return Response.json(await res.json(), { status: res.status });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const res = await backendJsonFetch(`/api/admin/pricing/tiers/${id}`, {
    method: "DELETE",
  });
  return Response.json(await res.json(), { status: res.status });
}
