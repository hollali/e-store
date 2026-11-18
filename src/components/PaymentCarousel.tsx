"use client";

import { useEffect, useRef } from "react";

const methods = [
  {
    name: "Visa",
    className: "bg-gradient-to-br from-[#1a1f71] to-[#0e4595] text-white",
    content: <span className="text-xl font-bold italic tracking-wider">VISA</span>,
  },
  {
    name: "Mastercard",
    className: "bg-white text-gray-900 border border-gray-200",
    content: (
      <div className="flex flex-col items-center gap-1">
        <div className="relative h-7 w-12">
          <span className="absolute left-0 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full bg-[#eb001b] mix-blend-multiply" />
          <span className="absolute right-0 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full bg-[#f79e1b] mix-blend-multiply" />
        </div>
        <span className="text-[10px] font-bold lowercase tracking-tight">mastercard</span>
      </div>
    ),
  },
  {
    name: "MTN MoMo",
    className: "bg-[#ffcc00] text-black",
    content: (
      <div className="flex flex-col items-center leading-none">
        <span className="text-xs font-extrabold tracking-widest">MTN</span>
        <span className="text-sm font-bold">MoMo</span>
      </div>
    ),
  },
  {
    name: "Paystack",
    className: "bg-white text-[#011b33] border border-gray-200",
    content: (
      <div className="flex items-center gap-1">
        <span className="h-3 w-3 rounded-sm bg-[#00c3f7]" />
        <span className="text-sm font-bold">Paystack</span>
      </div>
    ),
  },
];

export default function PaymentCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const items = [...methods, ...methods, ...methods];

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const oneSet = el.scrollWidth / 3;
    el.scrollLeft = oneSet;

    const interval = setInterval(() => {
      if (!el) return;
      const step = (el.firstElementChild as HTMLElement | null)?.offsetWidth ?? 120;
      const gap = 12;
      if (el.scrollLeft >= oneSet * 2 - step) {
        el.scrollLeft = oneSet;
      }
      el.scrollBy({ left: step + gap, behavior: "smooth" });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-4 overflow-hidden" aria-label="Accepted payment methods">
      <div
        ref={scrollerRef}
        className="flex gap-3 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {items.map((m, i) => (
          <div
            key={`${m.name}-${i}`}
            className={`flex h-12 w-28 shrink-0 items-center justify-center rounded-lg shadow-sm ${m.className}`}
          >
            {m.content}
          </div>
        ))}
      </div>
    </div>
  );
}
