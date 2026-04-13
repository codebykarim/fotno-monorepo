"use client";

import { useState, useCallback } from "react";
import useSWR from "swr";
import { jsonFetcher, apiRequest } from "@/lib/api/client";
import { DataTable, type Column } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { StatCard } from "@/components/stat-card";
import { formatCurrency } from "@/lib/format";
import type {
  PricingData,
  PricingTier,
  RegionalPricing,
  TierOverride,
} from "@/lib/types/admin";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@workspace/ui/components/dialog";
import {
  Layers,
  Globe,
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { FEATURE_KEYS, FEATURE_LABELS } from "@workspace/lib";

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

export function PricingPage() {
  const { data, isLoading, mutate } = useSWR<PricingData>(
    "/api/pricing",
    jsonFetcher,
    { refreshInterval: 60000, revalidateOnFocus: false },
  );

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-semibold">Pricing Management</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          title="Active Tiers"
          value={data ? data.tiers.filter((t) => t.active).length : "—"}
          icon={Layers}
        />
        <StatCard
          title="Total Tiers"
          value={data?.tiers.length ?? "—"}
          icon={Layers}
        />
        <StatCard
          title="Active Regions"
          value={data ? data.regions.filter((r) => r.active).length : "—"}
          icon={Globe}
        />
        <StatCard
          title="Total Regions"
          value={data?.regions.length ?? "—"}
          icon={Globe}
        />
      </div>

      {/* Tiers Section */}
      <TiersSection
        tiers={data?.tiers ?? []}
        isLoading={isLoading}
        mutate={mutate}
      />

      {/* Regions Section */}
      <RegionsSection
        regions={data?.regions ?? []}
        tiers={data?.tiers ?? []}
        isLoading={isLoading}
        mutate={mutate}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tiers Section
// ---------------------------------------------------------------------------

function TiersSection({
  tiers,
  isLoading,
  mutate,
}: {
  tiers: PricingTier[];
  isLoading: boolean;
  mutate: () => void;
}) {
  const [editingTier, setEditingTier] = useState<PricingTier | null>(null);
  const [showAddTier, setShowAddTier] = useState(false);

  const handleDeleteTier = useCallback(
    async (tier: PricingTier) => {
      if (!confirm(`Delete tier "${tier.label}"?`)) return;
      try {
        await apiRequest(`/api/pricing/tiers/${tier.id}`, {
          method: "DELETE",
        });
        toast.success("Tier deleted");
        mutate();
      } catch (e: any) {
        toast.error(e.message);
      }
    },
    [mutate],
  );

  const columns: Column<PricingTier>[] = [
    {
      key: "gb",
      header: "GB",
      render: (t) => <span className="font-medium">{t.gb}</span>,
    },
    {
      key: "label",
      header: "Label",
      render: (t) => t.label,
    },
    {
      key: "price",
      header: "Price (USD)",
      render: (t) => (
        <span className="font-medium">{formatCurrency(t.priceCents)}/mo</span>
      ),
    },
    {
      key: "galleryLimit",
      header: "Gallery Limit",
      render: (t) => (
        <span className="text-sm">
          {t.galleryLimit != null ? t.galleryLimit : "Unlimited"}
        </span>
      ),
    },
    {
      key: "features",
      header: "Features",
      render: (t) => (
        <span className="text-xs text-muted-foreground">
          {t.features?.length ? `${t.features.length} enabled` : "None"}
        </span>
      ),
    },
    {
      key: "stripePriceId",
      header: "Stripe Price ID",
      render: (t) => (
        <span className="text-xs text-muted-foreground font-mono">
          {t.stripePriceId ?? "—"}
        </span>
      ),
    },
    {
      key: "sortOrder",
      header: "Sort",
      render: (t) => t.sortOrder,
    },
    {
      key: "active",
      header: "Status",
      render: (t) => <StatusBadge status={t.active ? "ACTIVE" : "EXPIRED"} />,
    },
    {
      key: "actions",
      header: "",
      render: (t) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setEditingTier(t)}
            className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => handleDeleteTier(t)}
            className="rounded p-1.5 text-muted-foreground hover:bg-red-500/10 hover:text-red-600"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Storage Tiers</h2>
        <button
          onClick={() => setShowAddTier(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Tier
        </button>
      </div>

      <DataTable columns={columns} data={tiers} isLoading={isLoading} />

      {showAddTier && (
        <TierDialog onClose={() => setShowAddTier(false)} onSaved={mutate} />
      )}

      {editingTier && (
        <TierDialog
          tier={editingTier}
          onClose={() => setEditingTier(null)}
          onSaved={mutate}
        />
      )}
    </div>
  );
}

// Feature keys and labels imported from @workspace/lib (single source of truth)

// ---------------------------------------------------------------------------
// Tier Dialog (Add / Edit)
// ---------------------------------------------------------------------------

function TierDialog({
  tier,
  onClose,
  onSaved,
}: {
  tier?: PricingTier;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!tier;
  const [gb, setGb] = useState(tier?.gb?.toString() ?? "");
  const [label, setLabel] = useState(tier?.label ?? "");
  const [priceCents, setPriceCents] = useState(
    tier?.priceCents?.toString() ?? "",
  );
  const [stripePriceId, setLsVariantId] = useState(tier?.stripePriceId ?? "");
  const [galleryLimit, setGalleryLimit] = useState(
    tier?.galleryLimit?.toString() ?? "",
  );
  const [sortOrder, setSortOrder] = useState(
    tier?.sortOrder?.toString() ?? "0",
  );
  const [active, setActive] = useState(tier?.active ?? true);
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(
    new Set(tier?.features ?? []),
  );
  const [saving, setSaving] = useState(false);

  const toggleFeature = (key: string) => {
    setSelectedFeatures((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        gb: Number(gb),
        label,
        priceCents: Number(priceCents),
        galleryLimit: galleryLimit.trim() ? Number(galleryLimit) : null,
        sortOrder: Number(sortOrder),
        active,
        features: Array.from(selectedFeatures),
      };
      if (stripePriceId.trim()) body.stripePriceId = stripePriceId.trim();

      if (isEdit) {
        await apiRequest(`/api/pricing/tiers/${tier!.id}`, {
          method: "PUT",
          body: JSON.stringify(body),
        });
        toast.success("Tier updated");
      } else {
        await apiRequest("/api/pricing/tiers", {
          method: "POST",
          body: JSON.stringify(body),
        });
        toast.success("Tier created");
      }
      onSaved();
      onClose();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Tier" : "Add Tier"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the storage tier details and features."
              : "Create a new storage tier with features."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <FieldInput label="GB" value={gb} onChange={setGb} type="number" />
            <FieldInput label="Label" value={label} onChange={setLabel} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FieldInput
              label="Price (cents)"
              value={priceCents}
              onChange={setPriceCents}
              type="number"
            />
            <FieldInput
              label="Sort Order"
              value={sortOrder}
              onChange={setSortOrder}
              type="number"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FieldInput
              label="Gallery Limit"
              value={galleryLimit}
              onChange={setGalleryLimit}
              type="number"
              placeholder="Empty = unlimited"
            />
            <FieldInput
              label="Stripe Price ID"
              value={stripePriceId}
              onChange={setLsVariantId}
              placeholder="Optional"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="rounded"
            />
            Active
          </label>

          {/* Features */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium">
              Plan Features
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {FEATURE_KEYS.map((key) => (
                <label
                  key={key}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedFeatures.has(key)}
                    onChange={() => toggleFeature(key)}
                    className="rounded"
                  />
                  {FEATURE_LABELS[key]}
                </label>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <button
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || gb === "" || !label || priceCents === ""}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? "Saving..." : isEdit ? "Update" : "Create"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Regions Section
// ---------------------------------------------------------------------------

function RegionsSection({
  regions,
  tiers,
  isLoading,
  mutate,
}: {
  regions: RegionalPricing[];
  tiers: PricingTier[];
  isLoading: boolean;
  mutate: () => void;
}) {
  const [editingRegion, setEditingRegion] = useState<RegionalPricing | null>(
    null,
  );
  const [showAddRegion, setShowAddRegion] = useState(false);

  const handleDeleteRegion = useCallback(
    async (region: RegionalPricing) => {
      if (!confirm(`Delete region "${region.countryCode}"?`)) return;
      try {
        await apiRequest(`/api/pricing/regions/${region.id}`, {
          method: "DELETE",
        });
        toast.success("Region deleted");
        mutate();
      } catch (e: any) {
        toast.error(e.message);
      }
    },
    [mutate],
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Regional Pricing</h2>
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Regional Pricing</h2>
        <button
          onClick={() => setShowAddRegion(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Region
        </button>
      </div>

      {regions.length === 0 ? (
        <div className="rounded-xl border border-border p-8 text-center text-muted-foreground text-sm">
          No regional pricing configured
        </div>
      ) : (
        <div className="grid gap-4">
          {regions.map((region) => (
            <RegionCard
              key={region.id}
              region={region}
              onEdit={() => setEditingRegion(region)}
              onDelete={() => handleDeleteRegion(region)}
            />
          ))}
        </div>
      )}

      {showAddRegion && (
        <RegionDialog
          tiers={tiers}
          onClose={() => setShowAddRegion(false)}
          onSaved={mutate}
        />
      )}

      {editingRegion && (
        <RegionDialog
          region={editingRegion}
          tiers={tiers}
          onClose={() => setEditingRegion(null)}
          onSaved={mutate}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Region Card (collapsible with tier overrides)
// ---------------------------------------------------------------------------

function RegionCard({
  region,
  onEdit,
  onDelete,
}: {
  region: RegionalPricing;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="rounded p-0.5 hover:bg-muted"
          >
            {expanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">
                {region.countryCode}
              </span>
              <StatusBadge status={region.active ? "ACTIVE" : "EXPIRED"} />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {region.currency} ({region.symbol}) &middot; PPP{" "}
              {region.pppMultiplier.toFixed(2)} &middot; Locale: {region.locale}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {region.tierOverrides.length} override
            {region.tierOverrides.length !== 1 ? "s" : ""}
          </span>
          <button
            onClick={onEdit}
            className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="rounded p-1.5 text-muted-foreground hover:bg-red-500/10 hover:text-red-600"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Expanded tier overrides */}
      {expanded && region.tierOverrides.length > 0 && (
        <div className="border-t border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-5 py-2 text-left font-medium text-muted-foreground">
                  Tier (GB)
                </th>
                <th className="px-5 py-2 text-left font-medium text-muted-foreground">
                  Local Price
                </th>
                <th className="px-5 py-2 text-left font-medium text-muted-foreground">
                  Checkout (USD)
                </th>
                <th className="px-5 py-2 text-left font-medium text-muted-foreground">
                  Storage Override
                </th>
              </tr>
            </thead>
            <tbody>
              {region.tierOverrides.map((ov) => (
                <tr
                  key={ov.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-5 py-2 font-medium">{ov.tierGb} GB</td>
                  <td className="px-5 py-2">
                    {region.symbol}
                    {(ov.localPriceCents / 100).toFixed(2)}
                  </td>
                  <td className="px-5 py-2">
                    {ov.checkoutCents != null
                      ? formatCurrency(ov.checkoutCents)
                      : "—"}
                  </td>
                  <td className="px-5 py-2">
                    {ov.storageOverrideGb != null
                      ? `${ov.storageOverrideGb} GB`
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {expanded && region.tierOverrides.length === 0 && (
        <div className="border-t border-border px-5 py-4 text-sm text-muted-foreground">
          No tier overrides configured for this region
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Region Dialog (Add / Edit)
// ---------------------------------------------------------------------------

interface OverrideRow {
  tierGb: string;
  localPriceCents: string;
  checkoutCents: string;
  storageOverrideGb: string;
}

function RegionDialog({
  region,
  tiers,
  onClose,
  onSaved,
}: {
  region?: RegionalPricing;
  tiers: PricingTier[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!region;
  const [countryCode, setCountryCode] = useState(region?.countryCode ?? "");
  const [currency, setCurrency] = useState(region?.currency ?? "");
  const [symbol, setSymbol] = useState(region?.symbol ?? "");
  const [locale, setLocale] = useState(region?.locale ?? "");
  const [pppMultiplier, setPppMultiplier] = useState(
    region?.pppMultiplier?.toString() ?? "",
  );
  const [active, setActive] = useState(region?.active ?? true);
  const [overrides, setOverrides] = useState<OverrideRow[]>(
    region?.tierOverrides.map((ov) => ({
      tierGb: ov.tierGb.toString(),
      localPriceCents: ov.localPriceCents.toString(),
      checkoutCents: ov.checkoutCents?.toString() ?? "",
      storageOverrideGb: ov.storageOverrideGb?.toString() ?? "",
    })) ?? [],
  );
  const [saving, setSaving] = useState(false);

  const addOverrideRow = () => {
    setOverrides([
      ...overrides,
      {
        tierGb: "",
        localPriceCents: "",
        checkoutCents: "",
        storageOverrideGb: "",
      },
    ]);
  };

  const updateOverride = (
    index: number,
    field: keyof OverrideRow,
    value: string,
  ) => {
    const updated = [...overrides];
    updated[index] = { ...updated[index], [field]: value } as OverrideRow;
    setOverrides(updated);
  };

  const removeOverride = (index: number) => {
    setOverrides(overrides.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const tierOverrides = overrides
        .filter((o) => o.tierGb && o.localPriceCents)
        .map((o) => ({
          tierGb: Number(o.tierGb),
          localPriceCents: Number(o.localPriceCents),
          ...(o.checkoutCents
            ? { checkoutCents: Number(o.checkoutCents) }
            : {}),
          ...(o.storageOverrideGb
            ? { storageOverrideGb: Number(o.storageOverrideGb) }
            : {}),
        }));

      const body: Record<string, unknown> = {
        countryCode: countryCode.toUpperCase(),
        currency: currency.toUpperCase(),
        symbol,
        locale,
        pppMultiplier: Number(pppMultiplier),
        active,
        tierOverrides,
      };

      if (isEdit) {
        await apiRequest(`/api/pricing/regions/${region!.id}`, {
          method: "PUT",
          body: JSON.stringify(body),
        });
        toast.success("Region updated");
      } else {
        await apiRequest("/api/pricing/regions", {
          method: "POST",
          body: JSON.stringify(body),
        });
        toast.success("Region created");
      }
      onSaved();
      onClose();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Region" : "Add Region"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update regional pricing and tier overrides."
              : "Configure regional pricing with PPP adjustments."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <FieldInput
              label="Country Code"
              value={countryCode}
              onChange={setCountryCode}
              placeholder="e.g. BR"
            />
            <FieldInput
              label="Currency"
              value={currency}
              onChange={setCurrency}
              placeholder="e.g. BRL"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <FieldInput
              label="Symbol"
              value={symbol}
              onChange={setSymbol}
              placeholder="e.g. R$"
            />
            <FieldInput
              label="Locale"
              value={locale}
              onChange={setLocale}
              placeholder="e.g. pt-BR"
            />
            <FieldInput
              label="PPP Multiplier"
              value={pppMultiplier}
              onChange={setPppMultiplier}
              type="number"
              placeholder="e.g. 0.35"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="rounded"
            />
            Active
          </label>

          {/* Tier Overrides */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Tier Overrides</p>
              <button
                onClick={addOverrideRow}
                className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs hover:bg-muted"
              >
                <Plus className="h-3 w-3" />
                Add Override
              </button>
            </div>
            {overrides.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No tier overrides. Click &quot;Add Override&quot; to add one.
              </p>
            )}
            {overrides.map((ov, i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 items-end"
              >
                <div>
                  {i === 0 && (
                    <label className="text-xs text-muted-foreground mb-1 block">
                      Tier GB
                    </label>
                  )}
                  <select
                    value={ov.tierGb}
                    onChange={(e) =>
                      updateOverride(i, "tierGb", e.target.value)
                    }
                    className="h-9 w-full rounded-lg border border-border bg-background px-2 text-sm"
                  >
                    <option value="">Select tier</option>
                    {tiers.map((t) => (
                      <option key={t.id} value={t.gb}>
                        {t.gb} GB - {t.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  {i === 0 && (
                    <label className="text-xs text-muted-foreground mb-1 block">
                      Local Price (cents)
                    </label>
                  )}
                  <input
                    type="number"
                    value={ov.localPriceCents}
                    onChange={(e) =>
                      updateOverride(i, "localPriceCents", e.target.value)
                    }
                    className="h-9 w-full rounded-lg border border-border bg-background px-2 text-sm"
                    placeholder="Cents"
                  />
                </div>
                <div>
                  {i === 0 && (
                    <label className="text-xs text-muted-foreground mb-1 block">
                      Checkout USD (cents)
                    </label>
                  )}
                  <input
                    type="number"
                    value={ov.checkoutCents}
                    onChange={(e) =>
                      updateOverride(i, "checkoutCents", e.target.value)
                    }
                    className="h-9 w-full rounded-lg border border-border bg-background px-2 text-sm"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  {i === 0 && (
                    <label className="text-xs text-muted-foreground mb-1 block">
                      Storage Override GB
                    </label>
                  )}
                  <input
                    type="number"
                    value={ov.storageOverrideGb}
                    onChange={(e) =>
                      updateOverride(i, "storageOverrideGb", e.target.value)
                    }
                    className="h-9 w-full rounded-lg border border-border bg-background px-2 text-sm"
                    placeholder="Optional"
                  />
                </div>
                <button
                  onClick={() => removeOverride(i)}
                  className="h-9 rounded p-2 text-muted-foreground hover:bg-red-500/10 hover:text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <button
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              saving ||
              !countryCode ||
              !currency ||
              !symbol ||
              !locale ||
              !pppMultiplier
            }
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? "Saving..." : isEdit ? "Update" : "Create"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Shared field input component
// ---------------------------------------------------------------------------

function FieldInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs text-muted-foreground mb-1 block">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  );
}
