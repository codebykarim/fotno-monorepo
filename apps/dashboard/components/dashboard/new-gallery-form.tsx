"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { apiRequest } from "@/lib/api/client";

export function NewGalleryForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    try {
      const response = await apiRequest<{ gallery: { id: string } }>("/api/galleries", {
        method: "POST",
        body: JSON.stringify({ title, slug }),
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

            <Button type="submit" disabled={submitting}>
              {submitting ? "Creating..." : "Create gallery"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
