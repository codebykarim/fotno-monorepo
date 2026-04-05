"use client";

import { useState, useCallback } from "react";
import { Loader2, Monitor, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import { Switch } from "@workspace/ui/components/switch";
import { apiRequest } from "@/lib/api/client";

type NotificationPrefs = {
  galleryExpiryBrowser: boolean;
  galleryExpiryEmail: boolean;
  storageWarningBrowser: boolean;
  storageWarningEmail: boolean;
  billingFailedBrowser: boolean;
  billingFailedEmail: boolean;
};

type Props = {
  data: NotificationPrefs;
  mutate: () => void;
};

async function requestFcmPermissionAndRegister(): Promise<boolean> {
  if (!("Notification" in window)) {
    toast.error("This browser does not support push notifications.");
    return false;
  }

  if (Notification.permission === "denied") {
    toast.error(
      "Notifications are blocked. Please enable them in your browser settings.",
    );
    return false;
  }

  if (Notification.permission === "default") {
    const result = await Notification.requestPermission();
    if (result !== "granted") {
      toast.error("Notification permission was not granted.");
      return false;
    }
  }

  // Get FCM token from the service worker
  try {
    const { getToken } = await import("firebase/messaging");
    const { initializeApp } = await import("firebase/app");
    const { getMessaging } = await import("firebase/messaging");

    const app = initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY, // client-side key — will need your Firebase web config
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    });

    const messaging = getMessaging(app);
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    if (token) {
      await apiRequest("/api/settings/fcm/register", {
        method: "POST",
        body: JSON.stringify({ token, device: navigator.userAgent }),
      });
      return true;
    }

    toast.error("Failed to get push notification token.");
    return false;
  } catch {
    // FCM SDK not available — still allow toggling, token can be registered later
    console.warn(
      "[Notifications] FCM SDK not available, skipping token registration",
    );
    return true;
  }
}

const NOTIFICATION_TYPES = [
  {
    key: "galleryExpiry" as const,
    label: "Gallery Expiry Reminder",
    description: "Get notified before a gallery is automatically deleted.",
  },
  {
    key: "storageWarning" as const,
    label: "Storage Warning",
    description: "Get notified when your storage usage exceeds 85%.",
  },
  {
    key: "billingFailed" as const,
    label: "Billing Failed",
    description: "Get notified if a subscription payment fails.",
  },
];

export function NotificationSettings({ data, mutate }: Props) {
  const [prefs, setPrefs] = useState<NotificationPrefs>({ ...data });
  const [saving, setSaving] = useState(false);
  const [requestingPermission, setRequestingPermission] = useState(false);

  const hasChanges =
    prefs.galleryExpiryBrowser !== data.galleryExpiryBrowser ||
    prefs.galleryExpiryEmail !== data.galleryExpiryEmail ||
    prefs.storageWarningBrowser !== data.storageWarningBrowser ||
    prefs.storageWarningEmail !== data.storageWarningEmail ||
    prefs.billingFailedBrowser !== data.billingFailedBrowser ||
    prefs.billingFailedEmail !== data.billingFailedEmail;

  const handleBrowserToggle = useCallback(
    async (
      key: "galleryExpiry" | "storageWarning" | "billingFailed",
      checked: boolean,
    ) => {
      const browserKey = `${key}Browser` as keyof NotificationPrefs;

      if (checked) {
        // Check if any browser notification is already enabled (permission already granted)
        const anyBrowserOn =
          prefs.galleryExpiryBrowser ||
          prefs.storageWarningBrowser ||
          prefs.billingFailedBrowser;

        if (!anyBrowserOn) {
          setRequestingPermission(true);
          const granted = await requestFcmPermissionAndRegister();
          setRequestingPermission(false);
          if (!granted) return;
        }
      }

      setPrefs((prev) => ({ ...prev, [browserKey]: checked }));
    },
    [prefs],
  );

  const handleEmailToggle = useCallback(
    (
      key: "galleryExpiry" | "storageWarning" | "billingFailed",
      checked: boolean,
    ) => {
      const emailKey = `${key}Email` as keyof NotificationPrefs;
      setPrefs((prev) => ({ ...prev, [emailKey]: checked }));
    },
    [],
  );

  async function onSave() {
    setSaving(true);
    try {
      await apiRequest("/api/settings/notifications", {
        method: "PATCH",
        body: JSON.stringify(prefs),
      });
      mutate();
      toast.success("Notification preferences saved");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save notification preferences",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold">Notifications</h3>
        <p className="text-sm text-muted-foreground">
          Choose which notifications you want to receive and how.
        </p>
      </div>

      {/* Channel legend */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Monitor className="h-3.5 w-3.5" /> Browser
        </span>
        <span className="flex items-center gap-1.5">
          <Mail className="h-3.5 w-3.5" /> Email
        </span>
      </div>

      <section className="space-y-1 rounded-xl border border-border/60 bg-card p-5">
        {NOTIFICATION_TYPES.map((type, idx) => {
          const browserKey = `${type.key}Browser` as keyof NotificationPrefs;
          const emailKey = `${type.key}Email` as keyof NotificationPrefs;

          return (
            <div key={type.key}>
              {idx > 0 && <div className="my-3 border-t border-border/40" />}
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{type.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {type.description}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex flex-col items-center gap-1">
                    <Monitor className="h-3.5 w-3.5 text-muted-foreground" />
                    <Switch
                      checked={prefs[browserKey]}
                      onCheckedChange={(checked) =>
                        handleBrowserToggle(type.key, checked)
                      }
                      disabled={requestingPermission}
                    />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    <Switch
                      checked={prefs[emailKey]}
                      onCheckedChange={(checked) =>
                        handleEmailToggle(type.key, checked)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

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
          "Save preferences"
        )}
      </Button>
    </div>
  );
}
