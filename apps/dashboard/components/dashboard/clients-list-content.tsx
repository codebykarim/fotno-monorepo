"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { apiRequest, jsonFetcher } from "@/lib/api/client";
import { ListClientsResponse } from "@/lib/types/api";
import Link from "next/link";

export function ClientsListContent() {
  const { data, isLoading, mutate } = useSWR<ListClientsResponse>(
    "/api/clients",
    jsonFetcher,
  );
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [draftEmail, setDraftEmail] = useState("");
  const [draftPhone, setDraftPhone] = useState("");
  const [draftGalleryIds, setDraftGalleryIds] = useState<string[]>([]);

  const allGalleries = useMemo(() => data?.galleries ?? [], [data?.galleries]);

  const startEdit = (client: ListClientsResponse["clients"][number]) => {
    setEditingClientId(client.id);
    setDraftName(client.name);
    setDraftEmail(client.email);
    setDraftPhone(client.phone ?? "");
    setDraftGalleryIds(client.galleryIds);
  };

  const cancelEdit = () => {
    setEditingClientId(null);
    setDraftName("");
    setDraftEmail("");
    setDraftPhone("");
    setDraftGalleryIds([]);
  };

  const toggleGallery = (galleryId: string) => {
    setDraftGalleryIds((current) =>
      current.includes(galleryId)
        ? current.filter((id) => id !== galleryId)
        : [...current, galleryId],
    );
  };

  const saveClient = async () => {
    if (!editingClientId) {
      return;
    }

    try {
      await apiRequest(`/api/clients/${editingClientId}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: draftName,
          email: draftEmail,
          phone: draftPhone.trim() || null,
          galleryIds: draftGalleryIds,
        }),
      });
      toast.success("Client updated");
      cancelEdit();
      await mutate();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update client",
      );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
        <p className="text-muted-foreground">
          Clients and galleries shared with each contact.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-2xl border border-border/70 bg-card">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40">
                <tr className="text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Client</th>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium">Shared galleries</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading &&
                  Array.from({ length: 4 }).map((_, idx) => (
                    <tr key={idx} className="border-t border-border/60">
                      <td className="px-4 py-4">
                        <Skeleton className="h-4 w-28" />
                      </td>
                      <td className="px-4 py-4">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="mt-2 h-4 w-32" />
                      </td>
                      <td className="px-4 py-4">
                        <Skeleton className="h-4 w-52" />
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Skeleton className="ml-auto h-8 w-16" />
                      </td>
                    </tr>
                  ))}

                {!isLoading &&
                  data?.clients.map((client) => (
                    <tr
                      key={client.id}
                      className="border-t border-border/60 transition-colors hover:bg-muted/20"
                    >
                      <td className="px-4 py-4 align-top font-medium">
                        {editingClientId === client.id ? (
                          <Input
                            value={draftName}
                            onChange={(event) =>
                              setDraftName(event.target.value)
                            }
                          />
                        ) : (
                          <div className="space-y-1">
                            <p className="font-medium text-foreground">
                              {client.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              ID: {client.id.slice(0, 8)}
                            </p>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 align-top text-muted-foreground">
                        {editingClientId === client.id ? (
                          <div className="grid gap-2">
                            <Input
                              type="email"
                              value={draftEmail}
                              onChange={(event) =>
                                setDraftEmail(event.target.value)
                              }
                              placeholder="Email"
                            />
                            <Input
                              value={draftPhone}
                              onChange={(event) =>
                                setDraftPhone(event.target.value)
                              }
                              placeholder="Phone number"
                            />
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <p>{client.email}</p>
                            <p className="text-xs">
                              {client.phone?.trim() || "No phone number"}
                            </p>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 align-top text-muted-foreground">
                        {editingClientId === client.id ? (
                          <div className="grid gap-1.5">
                            {allGalleries.map((gallery) => (
                              <label
                                key={gallery.id}
                                className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted/40"
                              >
                                <input
                                  type="checkbox"
                                  checked={draftGalleryIds.includes(gallery.id)}
                                  onChange={() => toggleGallery(gallery.id)}
                                />
                                <span className="text-xs">{gallery.title}</span>
                              </label>
                            ))}
                          </div>
                        ) : client.galleries.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {client.galleries.map((gallery) => (
                              <Link
                                href={`/galleries/${gallery.id}`}
                                key={gallery.id}
                              >
                                <span className="rounded-full border border-border/70 bg-muted/40 px-2.5 py-1 text-xs text-foreground">
                                  {gallery.title}
                                </span>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          "No galleries shared"
                        )}
                      </td>
                      <td className="px-4 py-4 text-right align-top">
                        {editingClientId === client.id ? (
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={cancelEdit}
                            >
                              Cancel
                            </Button>
                            <Button size="sm" onClick={saveClient}>
                              Save
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEdit(client)}
                          >
                            Edit
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
