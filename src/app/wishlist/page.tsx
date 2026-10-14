"use client";

import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { Heart, Trash2, ShoppingBag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatGHS } from "@/lib/utils";

export default function WishlistPage() {
  const { items, removeItem, isLoading } = useWishlist();
  const { addItem, handleCartClick } = useCart();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <Skeleton className="h-8 w-48" />
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-square w-full rounded-md" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const handleMoveToCart = (item: (typeof items)[number]) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      currency: "GHS",
      image: item.image,
      quantity: 1,
    });
    removeItem(item.id);
    handleCartClick();
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="flex items-center gap-3 mb-2">
          <Heart className="h-6 w-6 text-red-500" aria-hidden="true" />
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            My Wishlist
          </h1>
        </div>
        <p className="mb-8 text-sm text-gray-500" aria-live="polite">
          {items.length === 0 ? "No saved items" : `${items.length} ${items.length === 1 ? "item" : "items"}`}
        </p>
        {items.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" aria-hidden="true" />
            <p className="text-gray-500 text-lg">Your wishlist is empty</p>
            <Link
              href="/all"
              className="mt-4 inline-flex h-11 items-center rounded-md bg-primary px-6 text-sm font-medium text-white hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
            {items.map((item) => (
              <div key={item.id} className="group relative flex flex-col">
                <Link
                  href={`/product/${item.slug || item.id}`}
                  aria-label={`View ${item.name}`}
                  className="block overflow-hidden rounded-md bg-gray-100 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <div className="aspect-square w-full">
                    <Image
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      width={600}
                      height={600}
                      sizes="(max-width: 640px) 50vw, 25vw"
                      loading="lazy"
                    />
                  </div>
                </Link>
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 shadow-sm hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label={`Remove ${item.name} from wishlist`}
                >
                  <Trash2 className="h-4 w-4 text-red-500" aria-hidden="true" />
                </button>
                <div className="mt-3 flex flex-1 flex-col gap-1">
                  <h2 className="text-sm font-medium text-gray-900">
                    <Link
                      href={`/product/${item.slug || item.id}`}
                      title={item.name}
                      className="line-clamp-1 hover:text-primary"
                    >
                      {item.name}
                    </Link>
                  </h2>
                  <p className="text-base font-bold text-gray-900">
                    {formatGHS(item.price)}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleMoveToCart(item)}
                    className="mt-2 inline-flex h-11 items-center justify-center gap-1.5 rounded-md border border-gray-200 text-sm font-semibold text-gray-900 hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                    Move to cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
