"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { urlFor } from "../lib/sanity";
import { Heart, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [sizeError, setSizeError] = useState("");
  const inWishlist = isInWishlist(price_id);
  const imageUrl = urlFor(image).url();

  const handleAdd = () => {
    // Size is optional for accessories / one-size items, but nudge for apparel
    addItem({
      id: size ? `${price_id}-${size}` : price_id,
      name: size ? `${name} (${size})` : name,
      description,
      price,
      currency,
      image: imageUrl,
      quantity,
    });
    handleCartClick();
    setSizeError("");
  };

  return (
    <div className="w-full space-y-4">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span id="size-label" className="text-sm font-medium text-gray-700">
            Size
          </span>
          <span className="text-xs text-gray-500">One-size items can skip this</span>
        </div>
        <div role="radiogroup" aria-labelledby="size-label" className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={size === s}
              onClick={() => {
                setSize(size === s ? null : s);
                setSizeError("");
              }}
              className={cn(
                "flex h-11 min-w-11 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                size === s
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-gray-200 text-gray-700 hover:border-gray-400",
              )}
            >
              {s}
            </button>
          ))}
        </div>
        {sizeError && (
          <p role="alert" className="mt-1 text-xs text-red-600">
            {sizeError}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1" aria-label="Quantity">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="flex h-11 w-11 items-center justify-center rounded-md border border-gray-200 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Minus className="h-4 w-4" aria-hidden="true" />
          </button>
          <span className="w-10 text-center text-sm font-semibold" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(99, q + 1))}
            aria-label="Increase quantity"
            className="flex h-11 w-11 items-center justify-center rounded-md border border-gray-200 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <Button onClick={handleAdd} className="h-11 flex-1 px-6">
          Add To Cart
        </Button>
        <button
          type="button"
          onClick={() =>
            toggleItem({ id: price_id, name, price, image: imageUrl, slug })
          }
          aria-pressed={inWishlist}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          className="flex h-11 w-11 items-center justify-center rounded-full border hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <Heart
            aria-hidden="true"
            className={`h-5 w-5 ${
              inWishlist ? "fill-red-500 text-red-500" : "text-gray-500"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
