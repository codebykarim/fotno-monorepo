"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
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
import { apiRequest } from "@/lib/api/client";
import { addDays, addMonths, formatDisplayDate, formatLocalDate } from "@/lib/utils/date";
import { FeatureInlineGate } from "@/components/dashboard/feature-gate";

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
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [eventDate, setEventDate] = useState<Date | undefined>(new Date());
  const [deadline, setDeadline] = useState<Date | undefined>(
    addMonths(new Date(), 1),
  );
  const [expiresAt, setExpiresAt] = useState<Date | undefined>(
    addMonths(new Date(), 2),
  );
  const [submitting, setSubmitting] = useState(false);

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

            <FeatureInlineGate featureKey="CUSTOM_SLUGS">
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (optional)</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(event) => setSlug(event.target.value)}
                  placeholder="winter-family-session"
                />
              </div>
            </FeatureInlineGate>

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

            <Button type="submit" disabled={submitting}>
              {submitting ? "Creating..." : "Create gallery"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
