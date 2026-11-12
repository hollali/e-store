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
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-3xl bg-gray-100">
        <Image
          src={urlFor(bigImage).url()}
          alt={productName}
          width={900}
          height={900}
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="aspect-square w-full object-cover object-center transition-transform duration-500 hover:scale-[1.02]"
        />
        {onSale && (
          <span className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm">
            {saleLabel}
          </span>
        )}
      </div>
      {safeImages.length > 1 && (
        <div
          className="flex gap-3 overflow-x-auto pb-1"
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
                  "h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-gray-100 outline-none transition focus-visible:ring-2 focus-visible:ring-primary",
                  isActive
                    ? "ring-2 ring-primary ring-offset-2"
                    : "opacity-70 hover:opacity-100",
                )}
              >
                <Image
                  src={urlFor(image).url()}
                  width={160}
                  height={160}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  className="h-full w-full object-cover object-center"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
