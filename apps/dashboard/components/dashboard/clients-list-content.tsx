"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { apiRequest, jsonFetcher } from "@/lib/api/client";
import { ListClientsResponse } from "@/lib/types/api";

export function ClientsListContent() {
  const { data, isLoading, mutate } = useSWR<ListClientsResponse>("/api/clients", jsonFetcher);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [draftEmail, setDraftEmail] = useState("");
  const [draftGalleryIds, setDraftGalleryIds] = useState<string[]>([]);

  const allGalleries = useMemo(() => data?.galleries ?? [], [data?.galleries]);

  const startEdit = (client: ListClientsResponse["clients"][number]) => {
    setEditingClientId(client.id);
    setDraftName(client.name);
    setDraftEmail(client.email);
    setDraftGalleryIds(client.galleryIds);
  };

  const cancelEdit = () => {
    setEditingClientId(null);
    setDraftName("");
    setDraftEmail("");
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
          galleryIds: draftGalleryIds,
        }),
      });
      toast.success("Client updated");
      cancelEdit();
      await mutate();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update client");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
        <p className="text-muted-foreground">Clients and galleries shared with each contact.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2">Galleries</th>
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Deadline</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading &&
                  Array.from({ length: 4 }).map((_, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="py-3 pr-4">
                        <Skeleton className="h-4 w-28" />
                      </td>
                      <td className="py-3 pr-4">
                        <Skeleton className="h-4 w-40" />
                      </td>
                      <td className="py-3">
                        <Skeleton className="h-4 w-52" />
                      </td>
                      <td className="py-3 pr-4">
                        <Skeleton className="h-4 w-20" />
                      </td>
                      <td className="py-3 pr-4">
                        <Skeleton className="h-4 w-20" />
                      </td>
                      <td className="py-3 text-right">
                        <Skeleton className="ml-auto h-8 w-16" />
                      </td>
                    </tr>
                  ))}

                {!isLoading &&
                  data?.clients.map((client) => (
                    <tr key={client.id} className="border-b">
                      <td className="py-3 pr-4 font-medium">
                        {editingClientId === client.id ? (
                          <Input value={draftName} onChange={(event) => setDraftName(event.target.value)} />
                        ) : (
                          client.name
                        )}
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground">
                        {editingClientId === client.id ? (
                          <Input
                            type="email"
                            value={draftEmail}
                            onChange={(event) => setDraftEmail(event.target.value)}
                          />
                        ) : (
                          client.email
                        )}
                      </td>
                      <td className="py-3 text-muted-foreground">
                        {editingClientId === client.id ? (
                          <div className="grid gap-1">
                            {allGalleries.map((gallery) => (
                              <label key={gallery.id} className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={draftGalleryIds.includes(gallery.id)}
                                  onChange={() => toggleGallery(gallery.id)}
                                />
                                <span className="text-xs">
                                  {gallery.title}
                                </span>
                              </label>
                            ))}
                          </div>
                        ) : client.galleries.length > 0 ? (
                          client.galleries.map((gallery) => gallery.title).join(", ")
                        ) : (
                          "No galleries shared"
                        )}
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground">
                        {client.galleries
                          .map((gallery) => gallery.eventDate)
                          .filter(Boolean)
                          .join(", ") || "-"}
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground">
                        {client.galleries
                          .map((gallery) => gallery.deadline)
                          .filter(Boolean)
                          .join(", ") || "-"}
                      </td>
                      <td className="py-3 text-right">
                        {editingClientId === client.id ? (
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={cancelEdit}>
                              Cancel
                            </Button>
                            <Button size="sm" onClick={saveClient}>
                              Save
                            </Button>
                          </div>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => startEdit(client)}>
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
