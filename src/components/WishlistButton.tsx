"use client";

import { useWishlist } from "@/context/WishlistContext";
import { Heart } from "lucide-react";

interface WishlistButtonProps {
  productId: string;
  name: string;
  price: number;
  image: string;
  className?: string;
}

export default function WishlistButton({
  productId,
  name,
  price,
  image,
  className = "",
}: WishlistButtonProps) {
  const { isInWishlist, toggleItem } = useWishlist();
  const inWishlist = isInWishlist(productId);

  return (
    <button
      onClick={() => toggleItem({ id: productId, name, price, image })}
      className={`p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors ${className}`}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={`h-4 w-4 ${
          inWishlist ? "fill-red-500 text-red-500" : "text-gray-600"
        }`}
      />
    </button>
  );
}
