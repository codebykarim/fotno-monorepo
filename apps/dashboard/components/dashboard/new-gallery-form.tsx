"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import { Calendar } from "@workspace/ui/components/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { apiRequest, jsonFetcher } from "@/lib/api/client";
import { ListClientsResponse } from "@/lib/types/api";
import { addDays, addMonths, formatDisplayDate, formatLocalDate } from "@/lib/utils/date";

const QUICK_EXPIRY = [
  { label: "1 week from now", months: 0, days: 7 },
  { label: "2 weeks from now", months: 0, days: 14 },
  { label: "1 month from now", months: 1, days: 0 },
  { label: "6 months from now", months: 6, days: 0 },
  { label: "1 year from now", months: 12, days: 0 },
];

function quickDate(months: number, days: number): Date {
  return addDays(addMonths(new Date(), months), days);
}

export function NewGalleryForm() {
  const router = useRouter();
  const { data } = useSWR<ListClientsResponse>("/api/clients", jsonFetcher);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [eventDate, setEventDate] = useState<Date | undefined>(new Date());
  const [deadline, setDeadline] = useState<Date | undefined>(
    addMonths(new Date(), 1),
  );
  const [expiresAt, setExpiresAt] = useState<Date | undefined>(
    addMonths(new Date(), 2),
  );
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
          eventDate: formatLocalDate(eventDate),
          deadline: formatLocalDate(deadline),
          expiresAt: formatLocalDate(expiresAt),
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
                <Label>Event Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formatDisplayDate(eventDate)}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={eventDate} onSelect={setEventDate} />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Deadline</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formatDisplayDate(deadline)}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={deadline} onSelect={setDeadline} />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Auto-Delete</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDisplayDate(expiresAt)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="flex">
                    <Calendar mode="single" selected={expiresAt} onSelect={setExpiresAt} />
                    <div className="border-l p-3">
                      <p className="mb-2 text-xs font-medium text-muted-foreground">
                        QUICK SELECT
                      </p>
                      <div className="flex flex-col gap-1">
                        {QUICK_EXPIRY.map((opt) => (
                          <Button
                            key={opt.label}
                            variant="ghost"
                            size="sm"
                            className="justify-start text-xs"
                            onClick={() => setExpiresAt(quickDate(opt.months, opt.days))}
                          >
                            {opt.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <p className="text-[10px] text-muted-foreground">
                Gallery and all its photos will be permanently deleted after this date.
              </p>
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
