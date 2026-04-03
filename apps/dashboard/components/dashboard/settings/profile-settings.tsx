"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { apiRequest } from "@/lib/api/client";

type ProfileData = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  providers: string[];
  canChangeEmail: boolean;
};

type Props = {
  data: ProfileData;
  mutate: () => void;
};

export function ProfileSettings({ data, mutate }: Props) {
  const [name, setName] = useState(data.name);
  const [email, setEmail] = useState(data.email);
  const [saving, setSaving] = useState(false);

  const hasChanges = name !== data.name || email !== data.email;

  async function onSave() {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    try {
      await apiRequest("/api/settings/profile", {
        method: "PATCH",
        body: JSON.stringify({ name, email }),
      });
      mutate();
      toast.success("Profile updated");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold">Profile</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account name and email address.
        </p>
      </div>

      <section className="space-y-4 rounded-xl border border-border/60 bg-card p-5">
        <h4 className="text-sm font-medium">Personal Information</h4>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="profile-name" className="text-xs">
              Name
            </Label>
            <Input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="profile-email" className="text-xs">
              Email
            </Label>
            <Input
              id="profile-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!data.canChangeEmail}
            />
            {!data.canChangeEmail && (
              <p className="text-[10px] text-muted-foreground">
                Email is managed by your{" "}
                {data.providers.filter((p) => p !== "credential").join(", ")}{" "}
                account and cannot be changed here.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* {data.providers.length > 0 && (
        <section className="space-y-4 rounded-xl border border-border/60 bg-card p-5">
          <h4 className="text-sm font-medium">Connected Accounts</h4>
          <div className="flex flex-wrap gap-2">
            {data.providers.map((provider) => (
              <span
                key={provider}
                className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary capitalize"
              >
                {provider === "credential" ? "Email/Password" : provider}
              </span>
            ))}
          </div>
        </section>
      )} */}

      <Button
        onClick={onSave}
        disabled={saving || !hasChanges}
        className="w-full sm:w-auto"
      >
        {saving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
          </>
        ) : (
          "Save changes"
        )}
      </Button>
    </div>
  );
}
