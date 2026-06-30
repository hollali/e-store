"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useUser } from "@clerk/nextjs";

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  isInWishlist: (id: string) => boolean;
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: WishlistItem) => void;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

const WISH_KEY = "africvogue_wishlist";

function loadLocalWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WISH_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalWishlist(items: WishlistItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(WISH_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user, isSignedIn, isLoaded } = useUser();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    async function load() {
      if (isSignedIn) {
        try {
          const res = await fetch("/api/wishlist");
          if (res.ok) {
            const data: any[] = await res.json();
            setItems(data.map((i) => ({ id: i.productId, name: i.name, price: Number(i.price), image: i.image })));
          }
        } catch {
          setItems(loadLocalWishlist());
        }
      } else {
        setItems(loadLocalWishlist());
      }
      setIsLoading(false);
    }

    load();
  }, [isSignedIn, user, isLoaded]);

  const persist = useCallback(
    async (newItems: WishlistItem[]) => {
      saveLocalWishlist(newItems);
      if (isSignedIn) {
        try {
          await fetch("/api/wishlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: newItems }),
          });
        } catch {
          // ignore
        }
      }
    },
    [isSignedIn],
  );

  const isInWishlist = useCallback((id: string) => items.some((i) => i.id === id), [items]);

  const addItem = useCallback(
    (item: WishlistItem) => {
      setItems((prev) => {
        if (prev.some((i) => i.id === item.id)) return prev;
        const updated = [...prev, item];
        persist(updated);
        return updated;
      });
    },
    [persist],
  );

  const removeItem = useCallback(
    (id: string) => {
      setItems((prev) => {
        const updated = prev.filter((i) => i.id !== id);
        persist(updated);
        return updated;
      });
    },
    [persist],
  );

  const toggleItem = useCallback(
    (item: WishlistItem) => {
      if (isInWishlist(item.id)) {
        removeItem(item.id);
      } else {
        addItem(item);
      }
    },
    [isInWishlist, addItem, removeItem],
  );

  return (
    <WishlistContext.Provider value={{ items, isInWishlist, addItem, removeItem, toggleItem, isLoading }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
