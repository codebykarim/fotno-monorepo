"use client";

import useSWR from "swr";
import { jsonFetcher } from "@/lib/api/client";
import type { ServicesHealthResponse, ServiceHealth } from "@/lib/types/admin";
import { cn } from "@workspace/ui/lib/utils";

const statusDot: Record<string, string> = {
  healthy: "bg-emerald-500",
  degraded: "bg-amber-500",
  down: "bg-red-500",
};

const statusLabel: Record<string, string> = {
  healthy: "Healthy",
  degraded: "Degraded",
  down: "Down",
};

function ServiceCard({ service }: { service: ServiceHealth }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium">{service.name}</h3>
        <div className="flex items-center gap-2">
          <div className={cn("h-2.5 w-2.5 rounded-full", statusDot[service.status])} />
          <span className="text-sm text-muted-foreground">
            {statusLabel[service.status]}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Response time</span>
        <span className="font-medium">{service.responseTime}ms</span>
      </div>
      {service.details && Object.keys(service.details).length > 0 && (
        <div className="mt-3 border-t border-border pt-3 space-y-1">
          {Object.entries(service.details).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{key}</span>
              <span className="font-mono">{String(value)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ServicesPage() {
  const { data, isLoading } = useSWR<ServicesHealthResponse>(
    "/api/services/health",
    jsonFetcher,
    { refreshInterval: 10000 }
  );

  if (isLoading || !data) {
    return <div className="text-muted-foreground">Checking services...</div>;
  }

  const appServices = data.services.filter(
    (s) => !["PostgreSQL", "Redis"].includes(s.name)
  );
  const infraServices = data.services.filter((s) =>
    ["PostgreSQL", "Redis"].includes(s.name)
  );

  const healthyCount = data.services.filter((s) => s.status === "healthy").length;
  const totalCount = data.services.length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Services</h1>
        <div className="text-sm text-muted-foreground">
          {healthyCount}/{totalCount} healthy &middot; Last checked{" "}
          {new Date(data.checkedAt).toLocaleTimeString()}
        </div>
      </div>

      {/* Application Services */}
      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-3">
          Application Services
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {appServices.map((service) => (
            <ServiceCard key={service.name} service={service} />
          ))}
        </div>
      </div>

      {/* Infrastructure */}
      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-3">
          Infrastructure
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {infraServices.map((service) => (
            <ServiceCard key={service.name} service={service} />
          ))}
        </div>
      </div>
    </div>
  );
}
