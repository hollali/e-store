"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatGHS, getCartItemId, getProductId } from "@/lib/utils";
import StarRating from "./StarRating";
import WishlistButton from "./WishlistButton";

export interface ProductCardData {
  _id: string;
  price_id?: string;
  imageUrl: string;
  price: number;
  slug?: string;
  categoryName?: string;
  name: string;
  rating?: number;
  reviewCount?: number;
}

interface ProductCardProps {
  product: ProductCardData;
  variant?: "default" | "wishlist";
  onRemove?: () => void;
  footer?: ReactNode;
}

export default function ProductCard({
  product,
  variant = "default",
  onRemove,
  footer,
}: ProductCardProps) {
  const { addItem, handleCartClick } = useCart();
  const productId = getProductId(product);
  const href = `/product/${product.slug || productId}`;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: getCartItemId(productId),
      name: product.name,
      price: product.price,
      currency: "GHS",
      image: product.imageUrl,
      quantity: 1,
    });
    handleCartClick();
  };

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <Link
          href={href}
          aria-label={`View ${product.name}`}
          className="block h-full w-full rounded-t-xl outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
        >
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={600}
            height={750}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading="lazy"
            className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />
        </Link>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/25 via-black/5 to-transparent" />
        <div className="absolute right-3 top-3">
          {variant === "wishlist" ? (
            <button
              type="button"
              onClick={onRemove}
              aria-label={`Remove ${product.name} from wishlist`}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-card/95 text-red-600 shadow-sm backdrop-blur transition-colors hover:bg-red-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : (
            <WishlistButton
              productId={productId}
              name={product.name}
              price={product.price}
              image={product.imageUrl}
              slug={product.slug}
              className="h-9 w-9 bg-card/95 backdrop-blur"
            />
          )}
        </div>
        {variant === "default" && (
          <button
            type="button"
            onClick={handleQuickAdd}
            aria-label={`Quick add ${product.name} to cart`}
            className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-card/95 text-foreground shadow-md backdrop-blur transition-all duration-300 hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100"
          >
            <Plus className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="eyebrow">{product.categoryName ?? "AfricVogue"}</p>
        <h3 className="font-serif text-lg leading-snug text-foreground">
          <Link
            href={href}
            title={product.name}
            className="line-clamp-2 outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-primary"
          >
            {product.name}
          </Link>
        </h3>
        {product.rating !== undefined && product.rating > 0 && (
          <StarRating rating={product.rating} count={product.reviewCount} size="sm" />
        )}
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <p className="font-serif text-xl font-semibold text-foreground">
            {formatGHS(product.price)}
          </p>
          <Link
            href={href}
            aria-label={`View ${product.name}`}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        {footer}
      </div>
    </article>
  );
}
