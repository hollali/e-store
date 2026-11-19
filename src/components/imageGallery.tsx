"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { urlFor } from "@/lib/sanity";
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

  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  if (safeImages.length === 0) {
    return (
      <div className="grid aspect-[4/5] place-items-center rounded-xl bg-muted text-sm text-muted-foreground">
        No image available
      </div>
    );
  }

  const index = Math.min(activeIndex, safeImages.length - 1);
  const bigImage = safeImages[index];

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted">
        <Image
          src={urlFor(bigImage).url()}
          alt={productName}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 45vw"
          className="object-cover object-center transition-transform duration-700 ease-out hover:scale-[1.02]"
        />
        {onSale && (
          <span className="absolute left-4 top-4 rounded-full bg-destructive px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-destructive-foreground shadow-sm">
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
            const isActive = idx === index;
            return (
              <button
                key={idx}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`View image ${idx + 1} of ${safeImages.length} for ${productName}`}
                onClick={() => setActiveIndex(idx)}
                className={cn(
                  "relative aspect-[4/5] w-16 shrink-0 overflow-hidden rounded-lg bg-muted outline-none transition focus-visible:ring-2 focus-visible:ring-primary",
                  isActive
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                    : "opacity-70 hover:opacity-100",
                )}
              >
                <Image
                  src={urlFor(image).url()}
                  fill
                  sizes="64px"
                  alt={`${productName} thumbnail ${idx + 1}`}
                  className="object-cover object-center"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
