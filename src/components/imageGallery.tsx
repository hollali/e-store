"use client";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: any[];
  productName?: string;
  onSale?: boolean;
  saleLabel?: string;
}

export default function ImageGallery({
  images,
  productName = "Product",
  onSale = false,
  saleLabel = "SALE",
}: ImageGalleryProps) {
  const safeImages = Array.isArray(images) ? images.filter(Boolean) : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const bigImage = safeImages[activeIndex] ?? safeImages[0];

  if (safeImages.length === 0) {
    return (
      <div className="grid place-items-center rounded-lg bg-gray-100 aspect-square text-sm text-gray-500">
        No image available
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <div
        className="order-last flex gap-3 lg:order-none lg:flex-col"
        role="tablist"
        aria-label={`Product images for ${productName}`}
      >
        {safeImages.map((image: any, idx: number) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`View image ${idx + 1} of ${safeImages.length} for ${productName}`}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "h-20 w-20 overflow-hidden rounded-lg bg-gray-100 outline-none transition ring-offset-2 focus-visible:ring-2 focus-visible:ring-primary",
                isActive
                  ? "ring-2 ring-primary ring-offset-2"
                  : "opacity-70 hover:opacity-100",
              )}
            >
              <Image
                src={urlFor(image).url()}
                width={200}
                height={200}
                alt={`${productName} thumbnail ${idx + 1}`}
                className="h-full w-full object-cover object-center"
              />
            </button>
          );
        })}
      </div>
      <div className="relative overflow-hidden rounded-lg bg-gray-100 lg:col-span-4">
        <Image
          src={urlFor(bigImage).url()}
          alt={productName}
          width={800}
          height={800}
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="h-full w-full object-cover object-center"
        />
        {onSale && (
          <span className="absolute left-0 top-0 rounded-br-lg bg-red-500 px-3 py-1.5 text-sm font-semibold uppercase tracking-wider text-white">
            {saleLabel}
          </span>
        )}
      </div>
    </div>
  );
}
