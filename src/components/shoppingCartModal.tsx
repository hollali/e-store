"use client";

import { useState } from "react";
import { PaystackConsumer } from "react-paystack";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
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
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const [isPaying, setIsPaying] = useState(false);
  const [payError, setPayError] = useState("");

  const entries = Object.values(cartDetails ?? {});
  const isEmpty = cartCount === 0;
  const hasPublicKey = Boolean(process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY);

  const paystackConfig = {
    reference: `av-${Date.now()}-${cartCount}`,
    email: user?.primaryEmailAddress?.emailAddress ?? "",
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
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="border-b border-gray-200 pb-3 text-left text-lg font-bold">
            <span aria-live="polite">
              Cart {cartCount > 0 ? `(${cartCount} ${cartCount === 1 ? "item" : "items"})` : ""}
            </span>
          </SheetTitle>
        </SheetHeader>
        <div className="flex h-full flex-col">
          <div className="mt-4 flex-1 overflow-y-auto">
            {isEmpty ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 py-16 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <ShoppingBag className="h-7 w-7 text-gray-400" aria-hidden="true" />
                </span>
                <p className="text-lg font-semibold text-gray-900">Your cart is empty</p>
                <p className="max-w-xs text-sm text-gray-500">
                  Looks like you haven&apos;t added anything yet. Explore our latest arrivals.
                </p>
                <button
                  type="button"
                  onClick={() => handleCartClick()}
                  className="mt-2 inline-flex h-11 items-center rounded-md bg-primary px-6 text-sm font-medium text-white hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Continue shopping
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {entries.map((entry) => (
                  <li key={entry.id} className="flex gap-4 py-4">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100">
                      <Image
                        src={entry.image as string}
                        alt={entry.name || "Product image"}
                        width={160}
                        height={160}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between gap-2">
                        <h3 className="line-clamp-2 text-sm font-medium text-gray-900">
                          {entry.name}
                        </h3>
                        <button
                          type="button"
                          onClick={() => removeItem(entry.id)}
                          aria-label={`Remove ${entry.name} from cart`}
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {formatGHS(entry.price * entry.quantity)}
                        {entry.quantity > 1 && (
                          <span className="ml-2 text-xs font-normal text-gray-500">
                            ({formatGHS(entry.price)} each)
                          </span>
                        )}
                      </p>
                      <div className="mt-2 flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => decrementItem(entry.id)}
                          aria-label={`Decrease quantity of ${entry.name}`}
                          className="flex h-11 w-11 items-center justify-center rounded-md border border-gray-200 text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                          <Minus className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <span
                          className="w-10 text-center text-sm font-medium"
                          aria-live="polite"
                          aria-label={`Quantity: ${entry.quantity}`}
                        >
                          {entry.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => incrementItem(entry.id)}
                          aria-label={`Increase quantity of ${entry.name}`}
                          className="flex h-11 w-11 items-center justify-center rounded-md border border-gray-200 text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                          <Plus className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {!isEmpty && (
            <div className="border-t border-gray-200 py-4">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Subtotal</p>
                <p aria-live="polite">{formatGHS(totalPrice)}</p>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Shipping calculated at checkout.
              </p>
              {!isSignedIn && (
                <p className="mt-2 text-sm text-gray-500">
                  <Link href="/sign-in" className="font-medium text-primary hover:underline">
                    Sign in
                  </Link>{" "}
                  to save your order history. You can still check out as a guest.
                </p>
              )}
              {payError && (
                <p role="alert" className="mt-2 text-sm text-red-600">
                  {payError}
                </p>
              )}
              <div className="mt-4">
                {!hasPublicKey || !paystackConfig.email ? (
                  <div>
                    <button
                      type="button"
                      disabled
                      className="w-full cursor-not-allowed rounded-md bg-gray-200 py-3 px-4 text-sm font-medium text-gray-500"
                      title={
                        !hasPublicKey
                          ? "Payment is not configured"
                          : "Sign in or add an email to check out"
                      }
                    >
                      Checkout unavailable
                    </button>
                    <p className="mt-2 text-xs text-gray-500">
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
                        className="h-12 w-full rounded-md bg-primary py-2 px-4 text-sm font-semibold text-white hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isPaying ? "Processing…" : `Checkout • ${formatGHS(totalPrice)}`}
                      </button>
                    )}
                  </PaystackConsumer>
                )}
              </div>
              <div className="mt-4 flex justify-center text-center text-sm text-gray-500">
                <p>
                  or{" "}
                  <button
                    type="button"
                    onClick={() => handleCartClick()}
                    className="rounded-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    Continue shopping
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
