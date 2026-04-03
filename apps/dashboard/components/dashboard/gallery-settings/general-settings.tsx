"use client";

import { useState } from "react";
import { CalendarIcon, Loader2, X as XIcon } from "lucide-react";
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
import { Calendar } from "@workspace/ui/components/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { apiRequest } from "@/lib/api/client";
import { GetGalleryResponse } from "@/lib/types/api";
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
  const [eventDate, setEventDate] = useState<Date | undefined>(
    g.eventDate ? new Date(g.eventDate + "T00:00:00") : undefined,
  );
  const [deadline, setDeadline] = useState<Date | undefined>(
    g.deadline ? new Date(g.deadline + "T00:00:00") : undefined,
  );
  const [expiresAt, setExpiresAt] = useState<Date | undefined>(
    g.expiresAt ? new Date(g.expiresAt.split("T")[0] + "T00:00:00") : undefined,
  );
  const [categoryTags, setCategoryTags] = useState<string[]>(g.categoryTags);
  const [tagInput, setTagInput] = useState("");
  const [slideshowEnabled, setSlideshowEnabled] = useState(g.slideshowEnabled);
  const [socialSharingEnabled, setSocialSharingEnabled] = useState(
    g.socialSharingEnabled,
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
          eventDate: formatLocalDate(eventDate),
          deadline: formatLocalDate(deadline),
          expiresAt: formatLocalDate(expiresAt),
          categoryTags,
          slideshowEnabled,
          socialSharingEnabled,
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
            <Label className="text-xs">Event Date</Label>
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
                <Calendar
                  mode="single"
                  selected={eventDate}
                  onSelect={setEventDate}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Deadline</Label>
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
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={setDeadline}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Auto-Delete</Label>
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
                  <Calendar
                    mode="single"
                    selected={expiresAt}
                    onSelect={setExpiresAt}
                  />
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
                          onClick={() =>
                            setExpiresAt(quickDate(opt.months, opt.days))
                          }
                        >
                          {opt.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <p className="text-[10px] text-destructive">
              Gallery and all photos will be permanently deleted after this
              date.
            </p>
          </div>
        </div>
      </section>

      {/* Category Tags */}
      {/* <section className="space-y-4 rounded-xl border border-border/60 bg-card p-5">
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
      </section> */}

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
          {/* <div className="flex items-center justify-between">
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
          </div> */}
        </div>
      </section>

      {/* Language */}
      {/* <section className="space-y-4 rounded-xl border border-border/60 bg-card p-5">
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
      </section> */}

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
