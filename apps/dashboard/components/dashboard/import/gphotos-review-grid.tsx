"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import type { PickedPhoto } from "./gphotos-picker";

export function GphotosReviewGrid({
  photos,
  onPickAgain,
}: {
  photos: PickedPhoto[];
  onPickAgain: () => void;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            {photos.length} photo{photos.length !== 1 ? "s" : ""} selected
          </CardTitle>
          <button
            type="button"
            onClick={onPickAgain}
            className="text-sm text-primary hover:underline"
          >
            Pick Again
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative aspect-square overflow-hidden rounded-md border bg-muted"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/gphotos/image?url=${encodeURIComponent(photo.baseUrl + "=w200-h200")}`}
                alt={photo.filename}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-1 opacity-0 transition-opacity group-hover:opacity-100">
                <p className="truncate text-[10px] text-white">
                  {photo.filename}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
