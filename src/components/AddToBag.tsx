"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { urlFor } from "../lib/sanity";
import { Heart, Minus, Plus } from "lucide-react";
import { cn, getCartItemId } from "@/lib/utils";

export interface ProductCart {
  name: string;
  description: string;
  price: number;
  currency: string;
  image: any;
  price_id: string;
  slug?: string;
}

const SIZES = ["XS", "S", "M", "L", "XL"];

export default function AddToBag({
  currency,
  description,
  image,
  name,
  price,
  price_id,
  slug,
}: ProductCart) {
  const { addItem, handleCartClick } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState<string | null>(null);
  const inWishlist = isInWishlist(price_id);
  const imageUrl = image ? urlFor(image).url() : "";

  const handleAdd = () => {
    addItem({
      id: getCartItemId(price_id, size),
      name: size ? `${name} (${size})` : name,
      description,
      price,
      currency,
      image: imageUrl,
      quantity,
    });
    handleCartClick();
  };

  return (
    <div className="w-full space-y-5">
      <div>
        <div className="mb-2 flex items-center justify-between gap-2">
          <span id="size-label" className="eyebrow">
            Select size
          </span>
          <span className="text-xs text-muted-foreground">One-size? Skip this</span>
        </div>
        <div role="radiogroup" aria-labelledby="size-label" className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={size === s}
              onClick={() => setSize(size === s ? null : s)}
              className={cn(
                "flex h-11 min-w-11 items-center justify-center rounded-full border px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                size === s
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-foreground hover:border-primary/50",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div
          className="flex items-center gap-1 rounded-full border border-border bg-background p-1"
          aria-label="Quantity"
        >
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Minus className="h-4 w-4" aria-hidden="true" />
          </button>
          <span className="w-8 text-center text-sm font-semibold" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(99, q + 1))}
            aria-label="Increase quantity"
            className="flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <Button onClick={handleAdd} className="h-11 flex-1 rounded-full px-6">
          Add to bag
        </Button>
        <button
          type="button"
          onClick={() =>
            toggleItem({ id: price_id, name, price, image: imageUrl, slug })
          }
          aria-pressed={inWishlist}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <Heart
            aria-hidden="true"
            className={`h-5 w-5 ${inWishlist ? "fill-red-500 text-red-500" : ""}`}
          />
        </button>
      </div>
    </div>
  );
}
