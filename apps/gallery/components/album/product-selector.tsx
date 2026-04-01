"use client";

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
  widthCm: number;
  heightCm: number;
  coverType: string;
  paperType: string;
  maxSpreads: number;
  priceCents: number;
  currency: string;
}

interface ProductSelectorProps {
  products: Product[];
  selectedProductId?: string;
  onSelectProduct: (productId: string) => void;
  disabled?: boolean;
}

export function ProductSelector({
  products,
  selectedProductId,
  onSelectProduct,
  disabled = false,
}: ProductSelectorProps) {
  if (products.length === 0) return null;

  return (
    <Select
      value={selectedProductId || ""}
      onValueChange={onSelectProduct}
      disabled={disabled}
    >
      <SelectTrigger className="h-8 w-[200px] text-xs">
        <SelectValue placeholder="Select product" />
      </SelectTrigger>
      <SelectContent>
        {products.map((product) => {
          const price = (product.priceCents / 100).toFixed(2);
          return (
            <SelectItem key={product.id} value={product.id}>
              <div className="flex items-center gap-2">
                <span className="font-medium">{product.name}</span>
                <span className="text-muted-foreground">
                  {product.widthCm}x{product.heightCm}cm &middot; ${price}
                </span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
