"use client";

import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

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
              <Skeleton className="aspect-[4/5] w-full rounded-xl" />
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
    <div className="bg-background">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="mb-2 flex items-center gap-3">
          <Heart className="h-6 w-6 text-primary" aria-hidden="true" />
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground">
            My Wishlist
          </h1>
        </div>
        <p className="mb-8 text-sm text-muted-foreground" aria-live="polite">
          {items.length === 0
            ? "No saved items"
            : `${items.length} ${items.length === 1 ? "piece" : "pieces"} saved`}
        </p>
        {items.length === 0 ? (
          <div className="py-16 text-center">
            <Heart className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" aria-hidden="true" />
            <p className="font-serif text-xl text-foreground">Your wishlist is empty</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Keep the pieces you love close.
            </p>
            <Link
              href="/all"
              className="mt-6 inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
            {items.map((item) => (
              <ProductCard
                key={item.id}
                product={{
                  _id: item.id,
                  price_id: item.id,
                  imageUrl: item.image || "/maleitem.png",
                  price: item.price,
                  slug: item.slug || item.id,
                  name: item.name,
                }}
                variant="wishlist"
                onRemove={() => removeItem(item.id)}
                footer={
                  <button
                    type="button"
                    onClick={() => handleMoveToCart(item)}
                    className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border border-border text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                    Move to cart
                  </button>
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
