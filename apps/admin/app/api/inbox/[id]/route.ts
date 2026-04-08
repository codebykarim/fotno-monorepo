import { backendJsonFetch } from "@/lib/backend";
import { type NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const res = await backendJsonFetch(`/api/admin/inbox/${id}`);
  return Response.json(await res.json(), { status: res.status });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.text();
  const res = await backendJsonFetch(`/api/admin/inbox/${id}`, {
    method: "PATCH",
    body,
  });
  return Response.json(await res.json(), { status: res.status });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const res = await backendJsonFetch(`/api/admin/inbox/${id}`, {
    method: "DELETE",
  });
  return Response.json(await res.json(), { status: res.status });
}
