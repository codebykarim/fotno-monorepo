"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Switch } from "@workspace/ui/components/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { apiRequest } from "@/lib/api/client";
import { GetGalleryResponse } from "@/lib/types/api";

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "ar", label: "Arabic" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "es", label: "Spanish" },
  { value: "pt", label: "Portuguese" },
  { value: "it", label: "Italian" },
  { value: "nl", label: "Dutch" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "zh", label: "Chinese" },
  { value: "tr", label: "Turkish" },
];

type Props = {
  galleryId: string;
  data: GetGalleryResponse;
  mutate: () => Promise<GetGalleryResponse | undefined>;
};

export function GeneralSettings({ galleryId, data, mutate }: Props) {
  const g = data.gallery;
  const [title, setTitle] = useState(g.title);
  const [slug, setSlug] = useState(g.slug);
  const [eventDate, setEventDate] = useState(g.eventDate ?? "");
  const [deadline, setDeadline] = useState(g.deadline ?? "");
  const [expiresAt, setExpiresAt] = useState(
    g.expiresAt ? g.expiresAt.split("T")[0] : "",
  );
  const [categoryTags, setCategoryTags] = useState<string[]>(g.categoryTags);
  const [tagInput, setTagInput] = useState("");
  const [slideshowEnabled, setSlideshowEnabled] = useState(g.slideshowEnabled);
  const [socialSharingEnabled, setSocialSharingEnabled] = useState(
    g.socialSharingEnabled,
  );
  const [emailRegistration, setEmailRegistration] = useState(
    g.emailRegistration,
  );
  const [language, setLanguage] = useState(g.language);
  const [saving, setSaving] = useState(false);

  const galleryBaseUrl =
    process.env.NEXT_PUBLIC_GALLERY_URL ?? "http://localhost:3003";
  const slugPreview = `${galleryBaseUrl.replace(/\/$/, "").replace(/^https?:\/\//, "")}/`;

  function addTag() {
    const tag = tagInput.trim();
    if (tag && !categoryTags.includes(tag)) {
      setCategoryTags([...categoryTags, tag]);
    }
    setTagInput("");
  }

  function removeTag(tag: string) {
    setCategoryTags(categoryTags.filter((t) => t !== tag));
  }

  async function onSave() {
    setSaving(true);
    try {
      await apiRequest(`/api/galleries/${galleryId}`, {
        method: "PATCH",
        body: JSON.stringify({
          title,
          slug,
          eventDate: eventDate || null,
          deadline: deadline || null,
          expiresAt: expiresAt || null,
          categoryTags,
          slideshowEnabled,
          socialSharingEnabled,
          emailRegistration,
          language,
        }),
      });
      await mutate();
      toast.success("Settings saved");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save settings",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold">General</h3>
        <p className="text-sm text-muted-foreground">
          Basic gallery information and display settings.
        </p>
      </div>

      {/* Title & Slug */}
      <section className="space-y-4 rounded-xl border border-border/60 bg-card p-5">
        <h4 className="text-sm font-medium">Gallery Info</h4>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="gallery-title" className="text-xs">
              Title
            </Label>
            <Input
              id="gallery-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="slug" className="text-xs">
              Slug
            </Label>
            <div className="flex">
              <span className="flex items-center rounded-l-md border border-r-0 border-input bg-muted px-2.5 text-xs text-muted-foreground whitespace-nowrap">
                {slugPreview}
              </span>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="rounded-l-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Dates */}
      <section className="space-y-4 rounded-xl border border-border/60 bg-card p-5">
        <h4 className="text-sm font-medium">Dates</h4>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="eventDate" className="text-xs">
              Event Date
            </Label>
            <Input
              id="eventDate"
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="deadline" className="text-xs">
              Deadline
            </Label>
            <Input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="expiresAt" className="text-xs">
              Auto-Expire
            </Label>
            <Input
              id="expiresAt"
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
            <p className="text-[10px] text-muted-foreground">
              Gallery becomes inaccessible after this date.
            </p>
          </div>
        </div>
      </section>

      {/* Category Tags */}
      <section className="space-y-4 rounded-xl border border-border/60 bg-card p-5">
        <h4 className="text-sm font-medium">Category Tags</h4>
        <div className="flex flex-wrap gap-1.5">
          {categoryTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="rounded-full p-0.5 hover:bg-primary/20"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Add a tag..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
            className="max-w-xs"
          />
          <Button variant="outline" size="sm" onClick={addTag} disabled={!tagInput.trim()}>
            Add
          </Button>
        </div>
      </section>

      {/* Display Options */}
      <section className="space-y-4 rounded-xl border border-border/60 bg-card p-5">
        <h4 className="text-sm font-medium">Display Options</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Slideshow</p>
              <p className="text-xs text-muted-foreground">
                Allow clients to view photos in a slideshow.
              </p>
            </div>
            <Switch
              checked={slideshowEnabled}
              onCheckedChange={setSlideshowEnabled}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Social Sharing</p>
              <p className="text-xs text-muted-foreground">
                Show social sharing buttons on the gallery.
              </p>
            </div>
            <Switch
              checked={socialSharingEnabled}
              onCheckedChange={setSocialSharingEnabled}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Email Registration</p>
              <p className="text-xs text-muted-foreground">
                Require visitors to enter their email before viewing.
              </p>
            </div>
            <Switch
              checked={emailRegistration}
              onCheckedChange={setEmailRegistration}
            />
          </div>
        </div>
      </section>

      {/* Language */}
      <section className="space-y-4 rounded-xl border border-border/60 bg-card p-5">
        <h4 className="text-sm font-medium">Language</h4>
        <div className="max-w-xs">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      <Button onClick={onSave} disabled={saving} className="w-full sm:w-auto">
        {saving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
          </>
        ) : (
          "Save settings"
        )}
      </Button>
    </div>
  );
}
