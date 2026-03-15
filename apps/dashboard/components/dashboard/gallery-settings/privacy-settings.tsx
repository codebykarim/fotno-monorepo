"use client";

import { useState } from "react";
import { Copy, Eye, EyeOff, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Switch } from "@workspace/ui/components/switch";
import { apiRequest } from "@/lib/api/client";
import { GetGalleryResponse } from "@/lib/types/api";

type Props = {
  galleryId: string;
  data: GetGalleryResponse;
  mutate: () => Promise<GetGalleryResponse | undefined>;
};

function generatePassword(length = 8): string {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length)),
  ).join("");
}

export function PrivacySettings({ galleryId, data, mutate }: Props) {
  const g = data.gallery;
  const [passwordEnabled, setPasswordEnabled] = useState(g.passwordEnabled);
  const [password, setPassword] = useState(g.password ?? "");
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  async function savePassword(enabled: boolean, pw: string) {
    setSaving(true);
    try {
      await apiRequest(`/api/galleries/${galleryId}`, {
        method: "PATCH",
        body: JSON.stringify({
          passwordEnabled: enabled,
          password: pw,
        }),
      });
      await mutate();
      toast.success(
        enabled ? "Password protection enabled" : "Password removed",
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update password",
      );
    } finally {
      setSaving(false);
    }
  }

  function handleGenerate() {
    const pw = generatePassword();
    setPassword(pw);
    setShowPassword(true);
  }

  function copyPassword() {
    navigator.clipboard.writeText(password);
    toast.success("Password copied");
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold">Privacy</h3>
        <p className="text-sm text-muted-foreground">
          Control who can access your gallery.
        </p>
      </div>

      {/* Password Protection */}
      <section className="space-y-4 rounded-xl border border-border/60 bg-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium">Password Protection</h4>
            <p className="text-xs text-muted-foreground">
              Require a password to view this gallery.
            </p>
          </div>
          <Switch
            checked={passwordEnabled}
            disabled={saving}
            onCheckedChange={(checked) => {
              setPasswordEnabled(checked);
              if (!checked) {
                setPassword("");
                void savePassword(false, "");
              }
            }}
          />
        </div>

        {passwordEnabled && (
          <div className="space-y-3">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter gallery password"
                className="pr-20 text-sm"
              />
              <div className="absolute right-2 top-1/2 flex -translate-y-1/2 gap-1">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="rounded p-1 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                </button>
                {password && (
                  <button
                    type="button"
                    onClick={copyPassword}
                    className="rounded p-1 text-muted-foreground hover:text-foreground"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerate}
                className="gap-1.5"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Generate
              </Button>
              <Button
                size="sm"
                disabled={saving || !password.trim()}
                onClick={() => void savePassword(true, password)}
                className="gap-1.5"
              >
                {saving && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                )}
                {g.passwordEnabled ? "Update Password" : "Set Password"}
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
