"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { apiRequest, jsonFetcher } from "@/lib/api/client";
import { ListClientsResponse } from "@/lib/types/api";

export function NewGalleryForm() {
  const router = useRouter();
  const { data } = useSWR<ListClientsResponse>("/api/clients", jsonFetcher);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [clientMode, setClientMode] = useState<"existing" | "new" | "none">(
    "none",
  );
  const [existingClientId, setExistingClientId] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const existingClients = useMemo(() => data?.clients ?? [], [data?.clients]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    try {
      const response = await apiRequest<{ gallery: { id: string } }>("/api/galleries", {
        method: "POST",
        body: JSON.stringify({
          title,
          slug,
          eventDate,
          deadline,
          clientId: clientMode === "existing" ? existingClientId : undefined,
          clientName: clientMode === "new" ? clientName : undefined,
          clientEmail: clientMode === "new" ? clientEmail : undefined,
        }),
      });

      toast.success("Gallery created");
      router.push(`/galleries/${response.gallery.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create gallery");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Gallery</h1>
        <p className="text-muted-foreground">Set up a draft gallery and start uploading photos.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gallery details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(event) => setTitle(event.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug (optional)</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
                placeholder="winter-family-session"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="eventDate">Date</Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={eventDate}
                  onChange={(event) => setEventDate(event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(event) => setDeadline(event.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Client</Label>
              <Select
                value={clientMode}
                onValueChange={(value) =>
                  setClientMode(value as "existing" | "new" | "none")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose client mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No client yet</SelectItem>
                  <SelectItem value="existing">Assign existing client</SelectItem>
                  <SelectItem value="new">Create client from email</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {clientMode === "existing" && (
              <div className="space-y-2">
                <Label>Existing Client</Label>
                <Select
                  value={existingClientId}
                  onValueChange={(value) => setExistingClientId(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {existingClients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name} ({client.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {clientMode === "new" && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    value={clientName}
                    onChange={(event) => setClientName(event.target.value)}
                    placeholder="Sarah Johnson"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientEmail">Client Email</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    required={clientMode === "new"}
                    value={clientEmail}
                    onChange={(event) => setClientEmail(event.target.value)}
                    placeholder="sarah@example.com"
                  />
                </div>
              </div>
            )}

            <Button type="submit" disabled={submitting}>
              {submitting ? "Creating..." : "Create gallery"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
