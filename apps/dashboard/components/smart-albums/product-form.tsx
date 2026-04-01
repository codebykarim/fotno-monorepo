"use client";

import { useState, useRef } from "react";
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
import { Checkbox } from "@workspace/ui/components/checkbox";
import { X, Upload, ImagePlus } from "lucide-react";

interface Product {
  id: string;
  name: string;
  widthCm: number;
  heightCm: number;
  coverType: string;
  paperType: string;
  maxSpreads: number;
  minSpreads: number | null;
  allowFewerSpreads: boolean;
  hasCover: boolean;
  hasFirstPage: boolean;
  hasLastPage: boolean;
  images: string[];
  priceCents: number;
  currency: string;
}

interface ProductFormProps {
  product?: Product;
  onSave?: () => void;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const COVER_TYPE_PRESETS = ["Leather", "Linen", "Cloth", "Velvet", "Wood", "Acrylic"];
const PAPER_TYPE_PRESETS = ["Matte", "Lustre", "Glossy", "Fine Art", "Silk"];

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
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: product?.name ?? "",
    widthCm: product?.widthCm ?? 20,
    heightCm: product?.heightCm ?? 15,
    coverType: product?.coverType ?? "",
    paperType: product?.paperType ?? "",
    maxSpreads: product?.maxSpreads ?? 10,
    minSpreads: product?.minSpreads ?? null as number | null,
    allowFewerSpreads: product?.allowFewerSpreads ?? false,
    hasCover: product?.hasCover ?? true,
    hasFirstPage: product?.hasFirstPage ?? true,
    hasLastPage: product?.hasLastPage ?? true,
    priceCents: product?.priceCents ?? 0,
  });

  // Track uploaded product images (s3 keys)
  const [imageKeys, setImageKeys] = useState<string[]>(
    (product?.images as string[]) ?? [],
  );
  // Track image preview URLs for newly uploaded images
  const [imagePreviews, setImagePreviews] = useState<
    Array<{ key: string; url: string }>
  >([]);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled
    ? (v: boolean) => controlledOnOpenChange?.(v)
    : setInternalOpen;

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (files: FileList) => {
    if (!product) return; // Can only upload images for existing products
    setUploadingImages(true);
    setError(null);

    try {
      for (const file of Array.from(files)) {
        // 1. Get presigned URL
        const presignRes = await fetch(
          `/api/smart-albums/products/${product.id}/images/presign`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fileName: file.name,
              contentType: file.type,
            }),
          },
        );
        if (!presignRes.ok) {
          const data = await presignRes.json().catch(() => null);
          throw new Error(data?.error || "Failed to get upload URL");
        }
        const { key, uploadUrl } = await presignRes.json();

        // 2. Upload to S3
        const uploadRes = await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });
        if (!uploadRes.ok) {
          throw new Error("Failed to upload image");
        }

        // 3. Confirm upload
        const confirmRes = await fetch(
          `/api/smart-albums/products/${product.id}/images`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key }),
          },
        );
        if (!confirmRes.ok) {
          throw new Error("Failed to confirm image upload");
        }
        const { images } = await confirmRes.json();
        setImageKeys(images);

        // Add preview URL
        const previewUrl = URL.createObjectURL(file);
        setImagePreviews((prev) => [...prev, { key, url: previewUrl }]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploadingImages(false);
    }
  };

  const handleRemoveImage = async (key: string) => {
    if (!product) return;
    try {
      const res = await fetch(
        `/api/smart-albums/products/${product.id}/images`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key }),
        },
      );
      if (!res.ok) {
        throw new Error("Failed to remove image");
      }
      const { images } = await res.json();
      setImageKeys(images);
      setImagePreviews((prev) => prev.filter((p) => p.key !== key));
    } catch (err: any) {
      setError(err.message);
    }
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

      const payload: any = { ...formData };
      if (!payload.allowFewerSpreads) {
        payload.minSpreads = null;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
    <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
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
            placeholder="e.g., Classic Wedding Album"
            disabled={loading}
          />
        </div>

        {/* Size: Width and Height in cm */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="widthCm">Width (cm)</Label>
            <Input
              id="widthCm"
              type="number"
              min="1"
              step="0.5"
              value={formData.widthCm}
              onChange={(e) =>
                handleInputChange("widthCm", parseFloat(e.target.value) || 0)
              }
              disabled={loading || !!product}
            />
          </div>
          <div>
            <Label htmlFor="heightCm">Height (cm)</Label>
            <Input
              id="heightCm"
              type="number"
              min="1"
              step="0.5"
              value={formData.heightCm}
              onChange={(e) =>
                handleInputChange("heightCm", parseFloat(e.target.value) || 0)
              }
              disabled={loading || !!product}
            />
          </div>
        </div>

        {/* Cover Type: input with datalist for presets + custom */}
        <div>
          <Label htmlFor="coverType">Cover Type</Label>
          <Input
            id="coverType"
            list="cover-type-presets"
            value={formData.coverType}
            onChange={(e) => handleInputChange("coverType", e.target.value)}
            placeholder="Select or type custom..."
            disabled={loading || !!product}
          />
          <datalist id="cover-type-presets">
            {COVER_TYPE_PRESETS.map((type) => (
              <option key={type} value={type} />
            ))}
          </datalist>
        </div>

        {/* Paper Type: input with datalist for presets + custom */}
        <div>
          <Label htmlFor="paperType">Paper Type</Label>
          <Input
            id="paperType"
            list="paper-type-presets"
            value={formData.paperType}
            onChange={(e) => handleInputChange("paperType", e.target.value)}
            placeholder="Select or type custom..."
            disabled={loading || !!product}
          />
          <datalist id="paper-type-presets">
            {PAPER_TYPE_PRESETS.map((type) => (
              <option key={type} value={type} />
            ))}
          </datalist>
        </div>

        {/* Spreads configuration */}
        <div>
          <Label htmlFor="maxSpreads">Max Spreads</Label>
          <Input
            id="maxSpreads"
            type="number"
            min="1"
            value={formData.maxSpreads}
            onChange={(e) =>
              handleInputChange("maxSpreads", parseInt(e.target.value, 10) || 1)
            }
            disabled={loading}
          />
        </div>

        {/* Allow fewer spreads */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Checkbox
              id="allowFewerSpreads"
              checked={formData.allowFewerSpreads}
              onCheckedChange={(checked) =>
                handleInputChange("allowFewerSpreads", !!checked)
              }
              disabled={loading}
            />
            <Label htmlFor="allowFewerSpreads" className="text-sm font-normal">
              Allow client to use fewer spreads
            </Label>
          </div>

          {formData.allowFewerSpreads && (
            <div className="ml-6">
              <Label htmlFor="minSpreads">Minimum Spreads</Label>
              <Input
                id="minSpreads"
                type="number"
                min="1"
                max={formData.maxSpreads}
                value={formData.minSpreads ?? 1}
                onChange={(e) =>
                  handleInputChange(
                    "minSpreads",
                    parseInt(e.target.value, 10) || 1,
                  )
                }
                disabled={loading}
              />
            </div>
          )}
        </div>

        {/* Page configuration checkboxes */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Album Pages</Label>
          <div className="space-y-2 ml-1">
            <div className="flex items-center gap-2">
              <Checkbox
                id="hasCover"
                checked={formData.hasCover}
                onCheckedChange={(checked) =>
                  handleInputChange("hasCover", !!checked)
                }
                disabled={loading}
              />
              <Label htmlFor="hasCover" className="text-sm font-normal">
                Cover page
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="hasFirstPage"
                checked={formData.hasFirstPage}
                onCheckedChange={(checked) =>
                  handleInputChange("hasFirstPage", !!checked)
                }
                disabled={loading}
              />
              <Label htmlFor="hasFirstPage" className="text-sm font-normal">
                First page
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="hasLastPage"
                checked={formData.hasLastPage}
                onCheckedChange={(checked) =>
                  handleInputChange("hasLastPage", !!checked)
                }
                disabled={loading}
              />
              <Label htmlFor="hasLastPage" className="text-sm font-normal">
                Last page
              </Label>
            </div>
          </div>
        </div>

        {/* Price */}
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

        {/* Product Example Images (only for existing products) */}
        {product && (
          <div>
            <Label className="text-sm font-medium">
              Example Photos
            </Label>
            <p className="text-xs text-muted-foreground mb-2">
              Upload photos showing the finished product
            </p>

            <div className="flex flex-wrap gap-2 mb-2">
              {imageKeys.map((key) => {
                const preview = imagePreviews.find((p) => p.key === key);
                return (
                  <div
                    key={key}
                    className="relative w-20 h-20 rounded-md border overflow-hidden group"
                  >
                    {preview ? (
                      <img
                        src={preview.url}
                        alt="Product example"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <ImagePlus className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(key)}
                      className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </div>
                );
              })}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImages}
                className="w-20 h-20 rounded-md border border-dashed flex flex-col items-center justify-center gap-1 hover:bg-muted/50 transition-colors disabled:opacity-50"
              >
                <Upload className="h-4 w-4 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">
                  {uploadingImages ? "..." : "Add"}
                </span>
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.length) {
                  handleImageUpload(e.target.files);
                  e.target.value = "";
                }
              }}
            />
          </div>
        )}

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

  if (isControlled) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        {dialogContent}
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>{product ? "Edit Product" : "Add Product"}</Button>}
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  );
}
