"use client";

import { useState } from "react";
import useSWR from "swr";
import { HardDrive, ImageIcon, Unplug, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { linkSocial } from "@workspace/lib/auth/auth-client";
import { apiRequest, jsonFetcher } from "@/lib/api/client";
import type { ImportSource } from "./source-selector";

interface AuthStatus {
  connected: boolean;
}

const SOURCE_CONFIG = {
  gdrive: {
    label: "Google Drive",
    icon: HardDrive,
    authUrl: "/api/gdrive/auth-status",
    disconnectUrl: "/api/gdrive/disconnect",
    scope: "https://www.googleapis.com/auth/drive.readonly",
  },
  gphotos: {
    label: "Google Photos",
    icon: ImageIcon,
    authUrl: "/api/gphotos/auth-status",
    disconnectUrl: "/api/gphotos/disconnect",
    scope: "https://www.googleapis.com/auth/photospicker.mediaitems.readonly",
  },
} as const;

export function ConnectBanner({ source }: { source: ImportSource }) {
  const config = SOURCE_CONFIG[source];
  const { data, mutate } = useSWR<AuthStatus>(config.authUrl, jsonFetcher);
  const [loading, setLoading] = useState(false);

  const connected = data?.connected ?? false;
  const Icon = config.icon;

  async function handleConnect() {
    setLoading(true);
    try {
      const response = await linkSocial({
        provider: "google",
        scopes: [config.scope],
        callbackURL: `${process.env.NEXT_PUBLIC_DASHBOARD_URL}/galleries/import`,
      });

      if (response.error) {
        toast.error(
          response.error.message || `Failed to connect ${config.label}`,
        );
        setLoading(false);
      } else if (response.data?.url) {
        window.location.href = response.data.url;
      }
    } catch {
      toast.error(`Failed to start ${config.label} authentication`);
      setLoading(false);
    }
  }

  async function handleDisconnect() {
    try {
      await apiRequest(config.disconnectUrl, { method: "POST" });
      await mutate();
      toast.success(`${config.label} disconnected`);
    } catch {
      toast.error("Failed to disconnect");
    }
  }

  if (connected) {
    return (
      <div className="flex items-center gap-2.5 rounded-lg border border-green-200 bg-green-50 px-3 py-2 dark:border-green-900 dark:bg-green-950/30">
        <Badge
          variant="outline"
          className="gap-1 border-green-300 text-green-700 dark:border-green-800 dark:text-green-400"
        >
          <Icon className="h-3 w-3" />
          Connected
        </Badge>
        <span className="flex-1 text-sm text-green-800 dark:text-green-300">
          {config.label}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={handleDisconnect}
        >
          <Unplug className="mr-1 h-3 w-3" />
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-dashed border-amber-300 bg-amber-50/50 px-4 py-3 dark:border-amber-800 dark:bg-amber-950/20">
      <Icon className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
      <span className="flex-1 text-sm text-amber-800 dark:text-amber-300">
        Connect your {config.label} account to continue
      </span>
      <Button size="sm" onClick={handleConnect} disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            Connecting...
          </>
        ) : (
          `Connect ${config.label}`
        )}
      </Button>
    </div>
  );
}
