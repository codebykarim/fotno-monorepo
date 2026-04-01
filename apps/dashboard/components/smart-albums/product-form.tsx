"use client";

import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

interface Product {
  id: string;
  name: string;
  size: string;
  coverType: string;
  paperType: string;
  maxPages: number;
  priceCents: number;
  currency: string;
}

interface ProductFormProps {
  product?: Product;
  onSave?: () => void;
  trigger?: React.ReactNode;
  /** Controlled open state (for external dialogs like edit-from-dropdown) */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ProductForm({
  product,
  onSave,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: ProductFormProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: product?.name ?? "",
    size: product?.size ?? "",
    coverType: product?.coverType ?? "",
    paperType: product?.paperType ?? "",
    maxPages: product?.maxPages ?? 10,
    priceCents: product?.priceCents ?? 0,
  });

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled
    ? (v: boolean) => controlledOnOpenChange?.(v)
    : setInternalOpen;

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = product
        ? `/api/smart-albums/products/${product.id}`
        : "/api/smart-albums/products";
      const method = product ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save product");
      }

      setOpen(false);
      onSave?.();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const dialogContent = (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
        <DialogDescription>
          {product
            ? "Update the product details"
            : "Create a new album product offering"}
        </DialogDescription>
      </DialogHeader>

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="e.g., Classic 12x12"
            disabled={loading}
          />
        </div>

        <div>
          <Label htmlFor="size">Size</Label>
          <Input
            id="size"
            value={formData.size}
            onChange={(e) => handleInputChange("size", e.target.value)}
            placeholder="e.g., 12x12"
            disabled={loading || !!product}
          />
        </div>

        <div>
          <Label htmlFor="coverType">Cover Type</Label>
          <Select
            value={formData.coverType}
            onValueChange={(v) => handleInputChange("coverType", v)}
            disabled={loading || !!product}
          >
            <SelectTrigger id="coverType">
              <SelectValue placeholder="Select cover type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="leather">Leather</SelectItem>
              <SelectItem value="linen">Linen</SelectItem>
              <SelectItem value="cloth">Cloth</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="paperType">Paper Type</Label>
          <Select
            value={formData.paperType}
            onValueChange={(v) => handleInputChange("paperType", v)}
            disabled={loading || !!product}
          >
            <SelectTrigger id="paperType">
              <SelectValue placeholder="Select paper type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="matte">Matte</SelectItem>
              <SelectItem value="lustre">Lustre</SelectItem>
              <SelectItem value="glossy">Glossy</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="maxPages">Max Pages (spreads)</Label>
          <Input
            id="maxPages"
            type="number"
            min="2"
            value={formData.maxPages}
            onChange={(e) =>
              handleInputChange("maxPages", parseInt(e.target.value, 10))
            }
            disabled={loading}
          />
        </div>

        <div>
          <Label htmlFor="price">Price (cents USD)</Label>
          <Input
            id="price"
            type="number"
            min="0"
            value={formData.priceCents}
            onChange={(e) =>
              handleInputChange("priceCents", parseInt(e.target.value, 10))
            }
            disabled={loading}
          />
          <p className="text-xs text-muted-foreground mt-1">
            ${(formData.priceCents / 100).toFixed(2)}
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );

  // Controlled mode: no trigger, dialog is managed externally
  if (isControlled) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        {dialogContent}
      </Dialog>
    );
  }

  // Uncontrolled mode: with trigger button
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>{product ? "Edit Product" : "Add Product"}</Button>}
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  );
}
