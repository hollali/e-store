"use client";

import { simplifiedProduct } from "@/app/interface";
import Image from "next/image";
import Link from "next/link";
import StarRating from "./StarRating";
import WishlistButton from "./WishlistButton";
import { useCart } from "@/context/CartContext";
import { formatGHS } from "@/lib/utils";
import { Plus } from "lucide-react";

export default function ProductCard({ product }: { product: simplifiedProduct }) {
  const { addItem, handleCartClick } = useCart();
  const productId = product.price_id ?? product._id;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: productId,
      name: product.name,
      price: product.price,
      currency: "GHS",
      image: product.imageUrl,
      quantity: 1,
    });
    handleCartClick();
  };

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-square w-full overflow-hidden rounded-md bg-gray-100">
        <Link
          href={`/product/${product.slug}`}
          aria-label={`View ${product.name}`}
          className="block h-full w-full outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md"
        >
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={600}
            height={600}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading="lazy"
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <div className="absolute right-2 top-2">
          <WishlistButton
            productId={productId}
            name={product.name}
            price={product.price}
            image={product.imageUrl}
          />
        </div>
        <button
          type="button"
          onClick={handleQuickAdd}
          aria-label={`Quick add ${product.name} to cart`}
          className="absolute inset-x-2 bottom-2 flex h-11 items-center justify-center gap-1.5 rounded-md bg-white/95 text-sm font-semibold text-gray-900 shadow-sm backdrop-blur transition-all hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Quick Add
        </button>
      </div>
      <div className="mt-3 flex flex-1 flex-col gap-1">
        <p className="text-xs uppercase tracking-wide text-gray-500">{product.categoryName}</p>
        <h3 className="text-sm font-medium text-gray-900">
          <Link
            href={`/product/${product.slug}`}
            title={product.name}
            className="line-clamp-1 outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
          >
            {product.name}
          </Link>
        </h3>
        {product.rating !== undefined && product.rating > 0 && (
          <StarRating rating={product.rating} count={product.reviewCount} size="sm" />
        )}
        <p className="text-base font-bold text-gray-900">{formatGHS(product.price)}</p>
      </div>
    </article>
  );
}
