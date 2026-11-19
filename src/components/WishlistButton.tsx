"use client";

import { useWishlist } from "@/context/WishlistContext";
import { Heart } from "lucide-react";

interface WishlistButtonProps {
  productId: string;
  name: string;
  price: number;
  image: string;
  slug?: string;
  className?: string;
}

export default function WishlistButton({
  productId,
  name,
  price,
  image,
  slug,
  className = "",
}: WishlistButtonProps) {
  const { isInWishlist, toggleItem } = useWishlist();
  const inWishlist = isInWishlist(productId);

  return (
    <button
      type="button"
      onClick={() => toggleItem({ id: productId, name, price, image, slug })}
      aria-pressed={inWishlist}
      className={`flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-card/90 text-foreground shadow-sm backdrop-blur transition-all hover:scale-105 hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${className}`}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        aria-hidden="true"
        className={`h-5 w-5 ${
          inWishlist ? "fill-red-500 text-red-500" : "text-muted-foreground"
        }`}
      />
    </button>
  );
}
