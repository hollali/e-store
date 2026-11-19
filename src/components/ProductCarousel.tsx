"use client";

import { useEffect, useRef } from "react";
import ProductCard from "@/components/ProductCard";
import { simplifiedProduct } from "@/app/interface";

export default function ProductCarousel({ products }: { products: simplifiedProduct[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const items = [...products, ...products, ...products];

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || products.length === 0) return;

    let oneSet = 0;
    const measure = () => {
      oneSet = el.scrollWidth / 3;
      el.scrollLeft = oneSet;
    };
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);

    const interval = setInterval(() => {
      if (!oneSet) return;
      if (el.scrollLeft >= oneSet * 2 - 10) {
        el.scrollLeft = oneSet;
      }
      el.scrollBy({ left: el.clientWidth * 0.8, behavior: "smooth" });
    }, 3000);

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, [products]);

  return (
    <div className="mt-6">
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {items.map((product, i) => (
          <div
            key={`${product._id}-${i}`}
            className="snap-start shrink-0 w-1/2 sm:w-1/3 lg:w-1/4"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
