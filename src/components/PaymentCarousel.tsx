"use client";

import { useEffect, useRef } from "react";

const methods = [
  {
    name: "Visa",
    className: "border-transparent bg-gradient-to-br from-[#1a1f71] to-[#0e4595] text-white",
    content: <span className="font-serif text-xl font-semibold italic tracking-wide">Visa</span>,
  },
  {
    name: "Mastercard",
    className: "border-border bg-card text-foreground",
    content: (
      <div className="flex flex-col items-center gap-0.5">
        <div className="relative h-6 w-11">
          <span className="absolute left-0 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[#eb001b] mix-blend-multiply" />
          <span className="absolute right-0 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[#f79e1b] mix-blend-multiply" />
        </div>
        <span className="text-[9px] font-semibold tracking-tight">mastercard</span>
      </div>
    ),
  },
  {
    name: "MTN MoMo",
    className: "border-transparent bg-[#ffcc00] text-black",
    content: (
      <div className="flex flex-col items-center leading-none">
        <span className="text-xs font-extrabold tracking-widest">MTN</span>
        <span className="font-serif text-sm font-semibold">MoMo</span>
      </div>
    ),
  },
  {
    name: "Paystack",
    className: "border-border bg-card text-foreground",
    content: (
      <div className="flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-sm bg-[#00c3f7]" />
        <span className="font-serif text-sm font-semibold">Paystack</span>
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
      const step = (el.firstElementChild as HTMLElement | null)?.offsetWidth ?? 120;
      const gap = 12;
      if (el.scrollLeft >= oneSet * 2 - step) {
        el.scrollLeft = oneSet;
      }
      el.scrollBy({ left: step + gap, behavior: "smooth" });
    }, 2500);

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="mt-4 overflow-hidden" aria-label="Accepted payment methods">
      <div
        ref={scrollerRef}
        className="flex gap-3 overflow-x-auto scroll-smooth pb-1 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {items.map((m, i) => (
          <div
            key={`${m.name}-${i}`}
            className={`flex h-14 w-28 shrink-0 items-center justify-center rounded-xl border shadow-sm ${m.className}`}
          >
            {m.content}
          </div>
        ))}
      </div>
    </div>
  );
}
