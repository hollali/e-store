"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useUser } from "@clerk/nextjs";

export interface CartItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  image: string;
  quantity: number;
}

interface CartContextType {
  cartDetails: Record<string, CartItem>;
  cartCount: number;
  totalPrice: number;
  shouldDisplayCart: boolean;
  handleCartClick: () => void;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  incrementItem: (id: string) => void;
  decrementItem: (id: string) => void;
  clearCart: () => void;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

const CART_KEY = "africvogue_cart";

function loadLocalCart(): Record<string, CartItem> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocalCart(items: Record<string, CartItem>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    // storage full or unavailable
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, isSignedIn, isLoaded } = useUser();
  const [cartDetails, setCartDetails] = useState<Record<string, CartItem>>({});
  const [shouldDisplayCart, setShouldDisplayCart] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Load cart from appropriate source
  useEffect(() => {
    if (!isLoaded) return;

    async function load() {
      if (isSignedIn && user) {
        try {
          const res = await fetch("/api/cart");
          if (res.ok) {
            const items: any[] = await res.json();
            const mapped: Record<string, CartItem> = {};
            for (const item of items) {
              mapped[item.productId] = {
                id: item.productId,
                name: item.name,
                price: Number(item.price),
                currency: item.currency || "GHS",
                image: item.image,
                quantity: item.quantity,
              };
            }
            setCartDetails(mapped);
          }
        } catch {
          // fallback to local
          setCartDetails(loadLocalCart());
        }
      } else {
        setCartDetails(loadLocalCart());
      }
      setIsLoading(false);
      setInitialized(true);
    }

    load();
  }, [isSignedIn, user, isLoaded]);

  // Persist cart
  const persist = useCallback(
    async (items: Record<string, CartItem>) => {
      saveLocalCart(items);
      if (isSignedIn) {
        try {
          await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items }),
          });
        } catch {
          // silently fail
        }
      }
    },
    [isSignedIn],
  );

  const cartCount = Object.values(cartDetails).reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = Object.values(cartDetails).reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCartClick = useCallback(() => setShouldDisplayCart((prev) => !prev), []);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      setCartDetails((prev) => {
        const existing = prev[item.id];
        const qty = item.quantity || 1;
        const updated = {
          ...prev,
          [item.id]: existing
            ? { ...existing, quantity: existing.quantity + qty }
            : {
                id: item.id,
                name: item.name,
                price: item.price,
                currency: item.currency,
                image: item.image,
                quantity: qty,
              },
        };
        persist(updated);
        return updated;
      });
    },
    [persist],
  );

  const removeItem = useCallback(
    (id: string) => {
      setCartDetails((prev) => {
        const updated = { ...prev };
        delete updated[id];
        persist(updated);
        return updated;
      });
    },
    [persist],
  );

  const incrementItem = useCallback(
    (id: string) => {
      setCartDetails((prev) => {
        const item = prev[id];
        if (!item) return prev;
        const updated = { ...prev, [id]: { ...item, quantity: item.quantity + 1 } };
        persist(updated);
        return updated;
      });
    },
    [persist],
  );

  const decrementItem = useCallback(
    (id: string) => {
      setCartDetails((prev) => {
        const item = prev[id];
        if (!item) return prev;
        if (item.quantity <= 1) {
          const updated = { ...prev };
          delete updated[id];
          persist(updated);
          return updated;
        }
        const updated = { ...prev, [id]: { ...item, quantity: item.quantity - 1 } };
        persist(updated);
        return updated;
      });
    },
    [persist],
  );

  const clearCart = useCallback(() => {
    setCartDetails({});
    persist({});
  }, [persist]);

  return (
    <CartContext.Provider
      value={{
        cartDetails,
        cartCount,
        totalPrice,
        shouldDisplayCart,
        handleCartClick,
        addItem,
        removeItem,
        incrementItem,
        decrementItem,
        clearCart,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
