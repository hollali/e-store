"use client";

import { useWishlist } from "@/context/WishlistContext";
import Image from "next/image";
import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";

export default function WishlistPage() {
  const { items, removeItem, isLoading } = useWishlist();
  const cedisSign = "\u20B5";

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <p className="text-center text-gray-500">Loading wishlist...</p>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="h-6 w-6 text-red-500" />
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            My Wishlist
          </h2>
        </div>
        {items.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Your wishlist is empty</p>
            <Link
              href="/all"
              className="mt-4 inline-block text-primary hover:underline"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {items.map((item) => (
              <div key={item.id} className="group relative">
                <Link href={`/product/${item.id}`}>
                  <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-80">
                    <Image
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-center"
                      width={300}
                      height={300}
                    />
                  </div>
                </Link>
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors"
                  aria-label={`Remove ${item.name} from wishlist`}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </button>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-primary font-semibold">
                      <Link
                        href={`/product/${item.id}`}
                        className="line-clamp-1"
                      >
                        {item.name}
                      </Link>
                    </h3>
                    <p className="text-sm font-medium text-gray-900">
                      {cedisSign} {item.price}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
