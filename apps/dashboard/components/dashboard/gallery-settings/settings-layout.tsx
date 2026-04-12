"use client";

import { useState } from "react";
import {
  Settings2,
  Shield,
  Download,
  Heart,
  AlertTriangle,
  BarChart3,
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { GetGalleryResponse } from "@/lib/types/api";
import { GeneralSettings } from "./general-settings";
import { PrivacySettings } from "./privacy-settings";
import { DownloadSettings } from "./download-settings";
import { FavoritesSettings } from "./favorites-settings";
import { DangerZone } from "./danger-zone";
import { AnalyticsSettings } from "./analytics-settings";

type Section = "general" | "privacy" | "download" | "favorites" | "analytics" | "danger";

const SECTIONS: {
  id: Section;
  label: string;
  icon: typeof Settings2;
  danger?: boolean;
}[] = [
  { id: "general", label: "General", icon: Settings2 },
  { id: "privacy", label: "Privacy", icon: Shield },
  { id: "download", label: "Download", icon: Download },
  { id: "favorites", label: "Favorites", icon: Heart },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle, danger: true },
];

type Props = {
  galleryId: string;
  data: GetGalleryResponse;
  mutate: () => Promise<GetGalleryResponse | undefined>;
};

export function GallerySettings({ galleryId, data, mutate }: Props) {
  const [active, setActive] = useState<Section>("general");

  return (
    <div className="flex gap-6">
      {/* Sidebar */}
      <nav className="hidden w-48 shrink-0 md:block">
        <ul className="space-y-0.5">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            const isActive = active === section.id;
            return (
              <li key={section.id}>
                {section.id === "danger" && (
                  <div className="my-2 border-t border-border/60" />
                )}
                <button
                  type="button"
                  onClick={() => setActive(section.id)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive
                      ? section.danger
                        ? "bg-destructive/10 text-destructive font-medium"
                        : "bg-primary/10 text-primary font-medium"
                      : section.danger
                        ? "text-destructive/70 hover:bg-destructive/5 hover:text-destructive"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {section.label}
                  {section.id === "download" && (
                    <span
                      className={cn(
                        "ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                        data.gallery.downloadEnabled
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {data.gallery.downloadEnabled ? "ON" : "OFF"}
                    </span>
                  )}
                  {section.id === "favorites" && (
                    <span
                      className={cn(
                        "ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                        data.gallery.favoritesEnabled
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {data.gallery.favoritesEnabled ? "ON" : "OFF"}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mobile select */}
      <div className="mb-4 w-full md:hidden">
        <select
          value={active}
          onChange={(e) => setActive(e.target.value as Section)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        >
          {SECTIONS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        {active === "general" && (
          <GeneralSettings
            galleryId={galleryId}
            data={data}
            mutate={mutate}
          />
        )}
        {active === "privacy" && (
          <PrivacySettings
            galleryId={galleryId}
            data={data}
            mutate={mutate}
          />
        )}
        {active === "download" && (
          <DownloadSettings
            galleryId={galleryId}
            data={data}
            mutate={mutate}
          />
        )}
        {active === "favorites" && (
          <FavoritesSettings
            galleryId={galleryId}
            data={data}
            mutate={mutate}
          />
        )}
        {active === "analytics" && (
          <AnalyticsSettings galleryId={galleryId} />
        )}
        {active === "danger" && (
          <DangerZone galleryId={galleryId} data={data} />
        )}
      </div>
    </div>
  );
}
