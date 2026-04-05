"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Switch } from "@workspace/ui/components/switch";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { apiRequest } from "@/lib/api/client";
import { GetGalleryResponse } from "@/lib/types/api";
import {
  FeatureGate,
  FeatureInlineGate,
} from "@/components/dashboard/feature-gate";

type Props = {
  galleryId: string;
  data: GetGalleryResponse;
  mutate: () => Promise<GetGalleryResponse | undefined>;
};

export function DownloadSettings({ galleryId, data, mutate }: Props) {
  const g = data.gallery;
  const [enabled, setEnabled] = useState(g.downloadEnabled);
  const [pin, setPin] = useState(g.downloadPin ?? "");
  const [sizeOriginal, setSizeOriginal] = useState(g.downloadSizeOriginal);
  const [sizeHighRes, setSizeHighRes] = useState(g.downloadSizeHighRes);
  const [sizeWeb, setSizeWeb] = useState(g.downloadSizeWeb);
  const [webMaxPx, setWebMaxPx] = useState(g.downloadWebMaxPx);
  const [highResMaxPx, setHighResMaxPx] = useState(g.downloadHighResMaxPx);
  const [downloadLimit, setDownloadLimit] = useState<string>(
    g.downloadLimit != null ? String(g.downloadLimit) : "",
  );
  const [saving, setSaving] = useState(false);

  async function onSave() {
    setSaving(true);
    try {
      await apiRequest(`/api/galleries/${galleryId}`, {
        method: "PATCH",
        body: JSON.stringify({
          downloadEnabled: enabled,
          downloadPin: pin || null,
          downloadSizeOriginal: sizeOriginal,
          downloadSizeHighRes: sizeHighRes,
          downloadSizeWeb: sizeWeb,
          downloadWebMaxPx: webMaxPx,
          downloadHighResMaxPx: highResMaxPx,
          downloadLimit: downloadLimit ? Number(downloadLimit) : null,
        }),
      });
      await mutate();
      toast.success("Download settings saved");
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
        <h3 className="text-base font-semibold">Download</h3>
        <p className="text-sm text-muted-foreground">
          Control how clients can download photos from this gallery.
        </p>
      </div>

      {/* Master toggle */}
      <FeatureGate featureKey="DOWNLOAD_ANALYTICS">
        <section className="space-y-4 rounded-xl border border-border/60 bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">Enable Downloads</h4>
              <p className="text-xs text-muted-foreground">
                Allow clients to download photos from this gallery.
              </p>
            </div>
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </div>
        </section>

        {enabled && (
          <>
            {/* Download PIN */}
            <section className="space-y-4 rounded-xl border border-border/60 bg-card p-5">
              <h4 className="text-sm font-medium">Download PIN</h4>
              <p className="text-xs text-muted-foreground">
                Require a 4-digit PIN before downloading. Leave empty to allow
                unrestricted downloads.
              </p>
              <Input
                value={pin}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                  setPin(v);
                }}
                placeholder="e.g. 1234"
                className="max-w-[120px]"
                maxLength={4}
                inputMode="numeric"
              />
            </section>

            {/* Download Sizes */}
            <section className="space-y-4 rounded-xl border border-border/60 bg-card p-5">
              <h4 className="text-sm font-medium">Available Sizes</h4>
              <p className="text-xs text-muted-foreground">
                Choose which sizes clients can download. If multiple are
                enabled, clients will see a size picker before downloading.
              </p>
              <div className="space-y-3">
                <label className="flex items-start gap-3">
                  <Checkbox
                    checked={sizeOriginal}
                    onCheckedChange={(c) => setSizeOriginal(c === true)}
                    className="mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-medium">Original</p>
                    <p className="text-xs text-muted-foreground">
                      Full resolution file exactly as you uploaded it.
                    </p>
                  </div>
                </label>

                {/* <label className="flex items-start gap-3">
                  <Checkbox
                    checked={sizeHighRes}
                    onCheckedChange={(c) => setSizeHighRes(c === true)}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">High Resolution</p>
                    <p className="text-xs text-muted-foreground">
                      Great for printing — long edge capped at:
                    </p>
                    {sizeHighRes && (
                      <div className="mt-2 flex items-center gap-2">
                        <Input
                          type="number"
                          value={highResMaxPx}
                          onChange={(e) =>
                            setHighResMaxPx(Number(e.target.value) || 3600)
                          }
                          className="w-24"
                          min={1000}
                          max={10000}
                        />
                        <span className="text-xs text-muted-foreground">px</span>
                      </div>
                    )}
                  </div>
                </label> */}

                <label className="flex items-start gap-3">
                  <Checkbox
                    checked={sizeWeb}
                    onCheckedChange={(c) => setSizeWeb(c === true)}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Web Size</p>
                    <p className="text-xs text-muted-foreground">
                      Smaller file, good for social media — long edge capped at:
                    </p>
                    {/* {sizeWeb && (
                      <div className="mt-2 flex items-center gap-2">
                        <Input
                          type="number"
                          value={webMaxPx}
                          onChange={(e) =>
                            setWebMaxPx(Number(e.target.value) || 2048)
                          }
                          className="w-24"
                          min={500}
                          max={5000}
                          // disabled
                        />
                        <span className="text-xs text-muted-foreground">px</span>
                      </div>
                    )} */}
                  </div>
                </label>
              </div>
            </section>

            {/* Download Limit */}
            <section className="space-y-4 rounded-xl border border-border/60 bg-card p-5">
              <div className="space-y-1.5">
                <Label htmlFor="downloadLimit" className="text-sm font-medium">
                  Download Limit (per photo)
                </Label>
                <Input
                  id="downloadLimit"
                  type="number"
                  value={downloadLimit}
                  onChange={(e) => setDownloadLimit(e.target.value)}
                  placeholder="Unlimited"
                  className="max-w-[160px]"
                  min={1}
                />
                <p className="text-xs text-muted-foreground">
                  Maximum number of times each photo can be downloaded. Leave
                  empty for unlimited.
                </p>
              </div>
            </section>
          </>
        )}

        <Button onClick={onSave} disabled={saving} className="w-full sm:w-auto">
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            "Save download settings"
          )}
        </Button>
      </FeatureGate>
    </div>
  );
}
