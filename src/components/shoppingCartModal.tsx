"use client";

import { useState } from "react";
import { PaystackConsumer } from "react-paystack";
import Image from "next/image";
import Link from "next/link";
import { authClient } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatGHS } from "@/lib/utils";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function ShoppingCartModal() {
  const {
    cartCount,
    shouldDisplayCart,
    handleCartClick,
    cartDetails,
    removeItem,
    incrementItem,
    decrementItem,
    totalPrice,
    clearCart,
  } = useCart();
  const { data: session } = authClient.useSession();
  const isSignedIn = !!session?.user;
  const user = session?.user;
  const router = useRouter();
  const [isPaying, setIsPaying] = useState(false);
  const [payError, setPayError] = useState("");

  const entries = Object.values(cartDetails ?? {});
  const isEmpty = cartCount === 0;
  const hasPublicKey = Boolean(process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY);

  const paystackConfig = {
    reference: `av-${Date.now()}-${cartCount}`,
    email: (user as any)?.email ?? "",
    amount: Math.round(totalPrice * 100),
    currency: "GHS",
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY as string,
    metadata: {
      custom_fields: [
        {
          display_name: "Total Items",
          variable_name: "total_items",
          value: cartCount,
        },
      ],
    },
  };

  async function handlePaymentSuccess() {
    const items = entries.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    if (isSignedIn) {
      try {
        await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderRef: paystackConfig.reference,
            total: totalPrice,
            items,
            email: paystackConfig.email,
          }),
        });
      } catch {
        // order saved locally only
      }
    }

    clearCart();
    setIsPaying(false);
    handleCartClick();
    if (isSignedIn) {
      router.push("/orders");
    }
  }

  return (
    <Sheet open={shouldDisplayCart} onOpenChange={() => !isPaying && handleCartClick()}>
      <SheetContent className="flex w-full flex-col gap-0 border-l border-gray-100 bg-white p-0 sm:max-w-lg">
        <SheetHeader className="border-b border-gray-100 px-6 py-5">
          <div className="flex items-center justify-between gap-3">
            <SheetTitle className="text-lg font-bold text-gray-900">Your cart</SheetTitle>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {isEmpty ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <ShoppingBag className="h-9 w-9 text-primary" aria-hidden="true" />
              </span>
              <div>
                <p className="text-lg font-semibold text-gray-900">Your cart is empty</p>
                <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                  Add something you love to get started.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleCartClick()}
                className="inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Continue shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {entries.map((entry) => (
                <li
                  key={entry.id}
                  className="flex gap-4 rounded-2xl border border-gray-100 bg-gray-50/60 p-3"
                >
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                    <Image
                      src={entry.image as string}
                      alt={entry.name || "Product image"}
                      width={160}
                      height={160}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">
                        {entry.name}
                      </h3>
                      {entry.description && (
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                          {entry.description}
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={() => removeItem(entry.id)}
                        aria-label={`Remove ${entry.name} from cart`}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-white hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                    <p className="mt-1 text-sm font-bold text-primary">
                      {formatGHS(entry.price)}
                    </p>
                    {entry.quantity > 1 && (
                      <p className="text-xs text-muted-foreground">
                        {formatGHS(entry.price)} each
                      </p>
                    )}
                    <div className="mt-3 flex items-center justify-between">
                      <div
                        className="flex items-center gap-1 rounded-full border border-gray-200 bg-white p-1"
                        aria-label="Quantity"
                      >
                        <button
                          type="button"
                          onClick={() => decrementItem(entry.id)}
                          disabled={entry.quantity <= 1}
                          aria-label={`Decrease quantity of ${entry.name}`}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                        <span
                          className="w-8 text-center text-sm font-semibold"
                          aria-live="polite"
                        >
                          {entry.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => incrementItem(entry.id)}
                          aria-label={`Increase quantity of ${entry.name}`}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                      <p className="text-sm font-bold text-gray-900">
                        {formatGHS(entry.price * entry.quantity)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {!isEmpty && (
          <div className="border-t border-gray-100 bg-white px-6 py-5">
            <div className="flex items-center justify-between text-base font-semibold text-gray-900">
              <span>Subtotal</span>
              <span>{formatGHS(totalPrice)}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Shipping and taxes calculated at checkout.
            </p>

            {!isSignedIn && (
              <p className="mt-3 text-sm text-muted-foreground">
                <Link href="/sign-in" className="font-medium text-primary">
                  Sign in
                </Link>{" "}
                to check out and save your order history.
              </p>
            )}

            {payError && (
              <p role="alert" className="mt-3 text-sm text-red-600">
                {payError}
              </p>
            )}

            <div className="mt-4">
              {!hasPublicKey || !paystackConfig.email ? (
                <div>
                  <button
                    type="button"
                    disabled
                    className="h-12 w-full cursor-not-allowed rounded-full bg-gray-200 text-sm font-semibold text-gray-500"
                    title={
                      !hasPublicKey
                        ? "Payment is not configured"
                        : "Sign in so we have an email for your receipt"
                    }
                  >
                    Checkout unavailable
                  </button>
                  <p className="mt-2 text-center text-xs text-muted-foreground">
                    {!hasPublicKey
                      ? "Payment gateway is not configured. Please contact support."
                      : "Please sign in so we have an email for your receipt."}
                  </p>
                </div>
              ) : (
                <PaystackConsumer
                  {...paystackConfig}
                  onSuccess={() => handlePaymentSuccess()}
                  onClose={() => setIsPaying(false)}
                >
                  {({ initializePayment }) => (
                    <button
                      type="button"
                      disabled={isPaying}
                      onClick={() => {
                        setPayError("");
                        setIsPaying(true);
                        try {
                          initializePayment();
                        } catch {
                          setPayError("Could not start payment. Please try again.");
                          setIsPaying(false);
                        }
                      }}
                      className="h-12 w-full rounded-full bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isPaying ? "Processing…" : `Checkout • ${formatGHS(totalPrice)}`}
                    </button>
                  )}
                </PaystackConsumer>
              )}
            </div>

            <div className="mt-4 flex justify-center text-center text-sm text-muted-foreground">
              <button
                type="button"
                onClick={() => handleCartClick()}
                className="font-medium text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Continue shopping
              </button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
