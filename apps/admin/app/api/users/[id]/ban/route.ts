import { backendJsonFetch } from "@/lib/backend";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const res = await backendJsonFetch(`/api/admin/users/${id}/ban`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return Response.json(await res.json(), { status: res.status });
}
